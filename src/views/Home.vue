<template>
  <div class="home">
    <Toast :error="this.error" />

    <transition name="fade">
      <Welcome
        v-if="!localStorageApiKey && !storeApiKey"
        :update="this.findLocation"
      />
    </transition>

    <transition name="fade">
      <MainBlock
        v-if="storeApiKey"
        :today="this.today"
        :forecastList="this.forecastList"
        :activeDay="this.activeDay"
        :getTime="this.getTime"
        :getTempC="this.getTempC"
        :getConvertedDate="this.getConvertedDate"
      />
    </transition>

    <transition name="fade">
      <Forecast
        v-if="storeApiKey"
        :forecastListForEachDay="this.forecastListForEachDay"
        :findLocation="this.findLocation"
        :getTempC="this.getTempC"
        :setActiveDay="this.setActiveDay"
      />
    </transition>

    <transition name="fade">
      <Map
        v-if="storeApiKey"
        :coords="mapCoords"
        :findLocation="findLocation"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import Toast from "@/components/Toast.vue";
import Welcome from "@/components/Welcome.vue";
import MainBlock from "@/components/MainBlock.vue";
import Forecast from "@/components/Forecast.vue";
import Map from "@/components/Map.vue";

export default {
  name: "Home",

  components: {
    Toast,
    Welcome,
    MainBlock,
    Forecast,
    Map
  },

  data() {
    return {
      apiKey: null,
      today: {
        date: null,
        temp: null,
        icon: null
      },
      mapCoords: [],
      forecastList: null,
      forecastListOfDay: null,
      forecastListForEachDay: null,
      averageTempOfDay: null,
      error: false
    };
  },

  mounted() {
    let checkLocalStorageApiKeyInterval = setInterval(() => {
      if (localStorage.apiKey) {
        this.apiKey = localStorage.apiKey;
        this.$store.commit("setApiKey", this.apiKey);
        this.findLocation(...this.storeCoords);

        const checkTodayInterval = setInterval(() => {
          if (this.today.date) {
            this.setActiveDay(this.getConvertedDate(this.today.date));
            clearInterval(checkTodayInterval);
          }
        }, 100);
        clearInterval(checkLocalStorageApiKeyInterval);
      }
    }, 0);
  },

  methods: {
    findLocation(lat = null, lon = null) {
      this.$store.commit("setLoading", true);
      let latitude;
      let longitude;

      const success = async location => {
        if (!lat && !lon) {
          latitude = await location?.coords?.latitude;
          longitude = await location?.coords?.longitude;
        } else {
          latitude = lat;
          longitude = lon;
        }

        if (latitude && longitude) {
          if (this.mapCoords.length === 2) {
            this.mapCoords = [];
            this.mapCoords.push(latitude, longitude);
          } else {
            this.mapCoords.push(latitude, longitude);
          }
        }

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.storeApiKey}&lang=ru`
          )
          .then(response => {
            this.today.date = response?.data?.dt;
            this.today.temp = response?.data?.main?.temp;
            this.today.icon = response?.data?.weather?.[0]?.icon;
            this.error = false;
          })
          .catch(error => {
            this.error = error;
            this.$store.commit("setApiKey", "");
          })
          .finally(() => this.$store.commit("setLoading", false));

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${this.storeApiKey}&lang=ru`
          )
          .then(response => {
            this.forecastList = response.data.list;
            this.forecastListForEachDay = this.getForecastListForEachDay(
              this.forecastList
            );
            this.error = false;
          })
          .catch(error => {
            this.error = error;
            this.$store.commit("setApiKey", "");
          })
          .finally(() => (this.loading = false));
      };

      const error = error => {
        this.error = error;
      };

      navigator.geolocation.getCurrentPosition(success, error);
    },
    getDate(timestamp) {
      if (timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString("ru", {
          day: "numeric",
          month: "long"
        });
      }
    },
    getConvertedDate(timestamp) {
      let today =
        this.getDate(timestamp)
          .slice(0, 2)
          .replace(/[, ]/g, "") ===
        new Date().toLocaleDateString("ru", {
          day: "numeric"
        });
      let tomorrow =
        this.getDate(timestamp)
          .slice(0, 2)
          .replace(/[, ]/g, "") ===
        String(+new Date().toLocaleDateString("ru", { day: "numeric" }) + 1);

      if (today) {
        return "Сегодня";
      } else if (tomorrow) {
        return "Завтра";
      } else {
        return this.getDate(timestamp);
      }
    },
    getTime(timestamp) {
      let hours = new Date(timestamp * 1000).getHours();
      let minutes = new Date(timestamp * 1000).getMinutes();
      let hours_formatted = /^[0-9]$/.test(hours) ? `0${hours}` : hours;
      let minutes_formatted = /^[0-9]$/.test(minutes) ? `0${minutes}` : minutes;

      return `${hours_formatted}:${minutes_formatted}`;
    },
    getTempC(temp) {
      if (typeof temp !== "number") {
        return "--";
      } else {
        return Math.round(temp - 275.15);
      }
    },
    getTempF(temp) {
      if (typeof temp !== "number") {
        return "--";
      } else {
        return Math.round((temp - 275.15) * (9 / 5) + 32);
      }
    },
    getForecastListForEachDay(forecastList) {
      let lastDay = null;
      let lastDayForecast = [];
      let forecastListForEachDay = {};

      forecastList.forEach(item => {
        if (this.getConvertedDate(item.dt) !== lastDay) {
          lastDay = this.getConvertedDate(item.dt);
          lastDayForecast = [];
          lastDayForecast.push(item);
          forecastListForEachDay[
            this.getConvertedDate(item.dt)
          ] = lastDayForecast;
        } else {
          lastDayForecast.push(item);
          forecastListForEachDay[
            this.getConvertedDate(item.dt)
          ] = lastDayForecast;
        }
      });

      return forecastListForEachDay;
    },
    setActiveDay(convertedDate) {
      this.$store.commit("setActiveDay", convertedDate);
    }
  },

  computed: {
    storeApiKey() {
      return this.$store.state.apiKey;
    },
    localStorageApiKey() {
      return localStorage.apiKey;
    },
    activeDay() {
      return this.$store.state.activeDay;
    },
    storeCoords() {
      return this.$store.state.coords;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss";

.home {
  width: 100%;
  max-width: calc(1200px + 30px);
  height: calc(100% - 64px);
  margin: 0 auto;
  margin-top: 64px;
  padding: 50px 15px;
  overflow: hidden;
  overflow-y: initial;
}
</style>
