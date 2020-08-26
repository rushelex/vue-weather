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
        :activeDay="this.activeDay"
        :forecastList="this.forecastList"
        :getConvertedDate="this.getConvertedDate"
        :getTempC="this.getTempC"
        :getTime="this.getTime"
        :today="this.today"
      />
    </transition>

    <transition name="fade">
      <Forecast
        v-if="storeApiKey"
        :findLocation="this.findLocation"
        :forecastListForEachDay="this.forecastListForEachDay"
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
import Toast from "@/components/Toast";
import Welcome from "@/components/Welcome";
import MainBlock from "@/components/MainBlock";
import Forecast from "@/components/Forecast";
import Map from "@/components/Map";

export default {
  name: "Home",

  components: {
    Toast,
    Welcome,
    MainBlock,
    Forecast,
    Map,
  },

  data() {
    return {
      apiKey: null,
      today: {
        date: null,
        temp: null,
        icon: null,
      },
      mapCoords: [],
      forecastList: null,
      forecastListOfDay: null,
      forecastListForEachDay: null,
      averageTempOfDay: null,
      error: false,
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
    /**
     * Location request from the user,
     * followed by a request for a weather forecast
     *
     * @param {number|*} lat
     * @param {number|*} lon
     */
    findLocation(lat = null, lon = null) {
      this.$store.commit("setLoading", true);
      let latitude;
      let longitude;

      /**
       * Makes a request to the OpenWeatherMap API
       * and receives a list of weather for 5 days
       * with an interval of 3 hours
       *
       * @param {object} location
       * @param {number} location.coords.latitude
       * @param {number} location.coords.longitude
       * @returns {Promise<void>}
       */
      const success = async (location) => {
        if (!lat && !lon) {
          latitude = location?.coords?.latitude;
          longitude = location?.coords?.longitude;
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

        // Weather request for the current time
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.storeApiKey}&lang=ru`
          )
          .then((response) => {
            this.today.date = response?.data?.dt;
            this.today.temp = response?.data?.main?.temp;
            this.today.icon = response?.data?.weather?.[0]?.icon;
            this.error = false;
          })
          .catch((error) => {
            this.error = error;
            this.$store.commit("setApiKey", "");
          })
          .finally(() => this.$store.commit("setLoading", false));

        // Main request for 5 days weather forecast
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${this.storeApiKey}&lang=ru`
          )
          .then((response) => {
            this.forecastList = response.data.list;
            this.forecastListForEachDay = this.getForecastListForEachDay(
              this.forecastList
            );
            this.error = false;
          })
          .catch((error) => {
            this.error = error;
            this.$store.commit("setApiKey", "");
          })
          .finally(() => (this.loading = false));
      };

      /**
       * Writes an error to the component data if no location is obtained
       *
       * @param {any} error
       */
      const error = (error) => {
        this.error = error;
      };

      navigator.geolocation.getCurrentPosition(success, error);
    },

    /**
     * Converts a timestamp and returns the date in "dd MMMM" format
     *
     * @param {number} timestamp
     */

    getDate(timestamp) {
      if (timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString("ru", {
          day: "numeric",
          month: "long",
        });
      }
    },

    /**
     * Returns a user-friendly date by converting a timestamp
     *
     * @param {number} timestamp
     */
    getConvertedDate(timestamp) {
      let today =
        this.getDate(timestamp).slice(0, 2).replace(/[, ]/g, "") ===
        new Date().toLocaleDateString("ru", {
          day: "numeric",
        });
      let tomorrow =
        this.getDate(timestamp).slice(0, 2).replace(/[, ]/g, "") ===
        String(+new Date().toLocaleDateString("ru", { day: "numeric" }) + 1);

      return today ? "Сегодня" : tomorrow ? "Завтра" : this.getDate(timestamp);
    },

    /**
     * Returns formatted time by timestamp
     *
     * @param {number} timestamp
     * @returns {string}
     */
    getTime(timestamp) {
      let hours = new Date(timestamp * 1000).getHours();
      let minutes = new Date(timestamp * 1000).getMinutes();
      let hours_formatted = /^[0-9]$/.test(String(hours)) ? `0${hours}` : hours;
      let minutes_formatted = /^[0-9]$/.test(String(minutes))
        ? `0${minutes}`
        : minutes;

      return `${hours_formatted}:${minutes_formatted}`;
    },

    /**
     * Returns converted temperature from Kelvin to Celsius
     *
     * @param {string} temp
     * @returns {string|number}
     */
    getTempC(temp) {
      return typeof temp === "number" ? Math.round(temp - 275.15) : "--";
    },

    /**
     * Returns the weather forecast object for each day
     *
     * @param {array} forecastList
     * @returns {object} { "Сегодня": Object[], "Завтра": Object[], "dd.mm.yyyy": Object[], ... }
     */
    getForecastListForEachDay(forecastList) {
      let lastDay = null;
      let lastDayForecast = [];
      let forecastListForEachDay = {};

      forecastList.forEach((item) => {
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

    /**
     * Adds active day to the Store
     *
     * @param {string} convertedDate
     */
    setActiveDay(convertedDate) {
      this.$store.commit("setActiveDay", convertedDate);
    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/scss";

.home {
  width: 100%;
  max-width: calc(1200px + 30px);
  height: calc(100% - 64px);
  margin: 64px auto 0;
  padding: 50px 15px;
  overflow: hidden;
  overflow-y: initial;
}
</style>
