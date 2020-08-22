<template>
  <div class="home">
    <!-- <button @click="findLocation">Обновить</button>
    <div v-if="this.loading">Loading...</div>
    <div v-if="this.error">{{ this.error }}</div> -->

    <transition name="fade">
      <Welcome
        v-if="!localStorageApiKey && !storeApiKey"
        :update="this.findLocation"
      />
    </transition>

    <transition name="fade">
      <Card v-if="storeApiKey" class="main">
        <div class="main__header">
          <div class="main__temp temp">
            <span class="temp__number">{{ getTempC(today.temp) }}</span>
            <span class="temp__unit"> °C</span>
          </div>
          <div v-if="today.date" class="main__title title">
            <span>{{ this.activeDay }}</span>
          </div>
          <img
            v-if="today.icon"
            class="main__icon"
            :src="`http://openweathermap.org/img/wn/${today.icon}@2x.png`"
            alt="Weather icon"
          />
        </div>
        <div class="main__body">
          <div class="main__forecast-day forecast-day">
            <div
              class="forecast-day__item item"
              v-for="item in getForecastListOfDay(this.forecastList)"
              :key="item.dt"
            >
              <div class="item__temp">
                <span class="item__temp-number">{{
                  getTempC(item.main.temp)
                }}</span>
                <span class="item__temp-unit"> °C</span>
              </div>
              <div class="item__descr">
                <span>{{
                  transformFirstSymbol(item.weather[0].description)
                }}</span>
              </div>
              <div class="item__time">
                <span>{{ getTime(item.dt) }}</span>
              </div>
              <img
                class="item__icon"
                :src="
                  `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`
                "
                alt="Weather icon"
              />
            </div>
          </div>
        </div>
      </Card>
    </transition>

    <transition name="fade">
      <Card v-if="storeApiKey" class="forecast">
        <div
          v-for="(value, key) in this.forecastListForEachDay"
          :key="value.dt"
          class="forecast__day day"
          :class="{ active: key === activeDay }"
          @click="
            () => {
              findLocation();
              setActiveDay(key);
            }
          "
        >
          <div class="day__date">
            <span>{{ key }}</span>
          </div>
          <div class="day__temp temp">
            <div class="temp__number">
              {{ getTempC(getAverageTempOfDay(value)) }}
            </div>
            <div class="temp__unit">°C</div>
          </div>
        </div>
      </Card>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import Welcome from "@/components/Welcome.vue";
import Card from "@/components/Card.vue";

export default {
  name: "Home",

  components: {
    Welcome,
    // Title
    Card
  },

  data() {
    return {
      apiKey: null,
      today: {
        date: null,
        temp: null,
        icon: null
      },
      forecastList: null,
      forecastListOfDay: null,
      forecastListForEachDay: null,
      averageTempOfDay: null,
      loading: false,
      error: false
    };
  },

  mounted() {
    if (localStorage.apiKey) {
      this.apiKey = localStorage.apiKey;
      this.$store.commit("setApiKey", this.apiKey);
      this.findLocation();

      const interval = setInterval(() => {
        if (this.today.date) {
          this.setActiveDay(this.getConvertedDate(this.today.date));
          clearInterval(interval);
        }
      }, 0);
    }
  },

  methods: {
    findLocation() {
      this.loading = true;

      navigator.geolocation.getCurrentPosition(async location => {
        let latitude = await location?.coords?.latitude;
        let longitude = await location?.coords?.longitude;

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
          .finally(() => (this.loading = false));

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
      });
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
    transformFirstSymbol(str) {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    },
    getDate(timestamp) {
      if (timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString("ru", {
          day: "numeric",
          month: "long"
        });
      }
    },
    getTime(timestamp) {
      let hours = new Date(timestamp * 1000).getHours();
      let minutes = new Date(timestamp * 1000).getMinutes();
      let hours_formatted = /^[0-9]$/.test(hours) ? `0${hours}` : hours;
      let minutes_formatted = /^[0-9]$/.test(minutes) ? `0${minutes}` : minutes;

      return `${hours_formatted}:${minutes_formatted}`;
    },
    getTempF(temp) {
      if (typeof temp !== "number") {
        return "--";
      } else {
        return Math.round((temp - 275.15) * (9 / 5) + 32);
      }
    },
    getTempC(temp) {
      if (typeof temp !== "number") {
        return "--";
      } else {
        return Math.round(temp - 275.15);
      }
    },
    getForecastListOfDay(forecastList) {
      let forecastListOfDay = [];

      if (forecastList) {
        forecastList.forEach(item => {
          if (this.activeDay === this.getConvertedDate(item.dt)) {
            forecastListOfDay.push(item);
          }
        });

        return forecastListOfDay;
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
    getAverageTempOfDay(day) {
      let tempArr = [];
      let tempSum = null;
      let averageTemp = null;

      day.forEach(item => {
        tempArr.push(item?.main?.temp);
      });

      tempSum = tempArr.reduce((a, b) => a + b, 0);
      averageTemp = tempSum / tempArr.length;
      averageTemp = Math.round(averageTemp);

      return averageTemp;
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
  padding: 15px;
  padding-top: 50px;
  overflow: hidden;
  overflow-y: initial;
}

.main {
  padding-bottom: 0px;

  &__header {
    position: relative;
    display: flex;
    min-height: 120px;
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: 0;
    width: 100px;
    transform: translateY(-50%);
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.6));
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  .temp {
    display: flex;
    pointer-events: none;
    user-select: none;

    &__number {
      font-size: 68px;
      font-weight: 700;
      line-height: 100%;
    }

    &__unit {
      margin-top: 5px;
      margin-bottom: auto;
      font-size: 30px;
      font-weight: 500;
      line-height: 100%;
    }
  }

  .title {
    font-size: 40px;
    font-weight: 500;
    line-height: 100%;
    margin-left: 40px;
    pointer-events: none;
    user-select: none;
  }
}

.forecast-day {
  margin-top: 20px;
  padding: 20px 0;
  display: flex;
  border-top: 1px solid #e0e0e0;
  overflow: auto;

  &__item {
    padding: 0 10px;
    flex: 1;

    &:not(:first-of-type) {
      margin-left: 10px;
    }
  }

  .item {
    position: relative;
    min-width: 120px;
    max-width: 200px;
    display: flex;
    flex-direction: column;

    &:not(:first-of-type) {
      margin-left: 10px;
      border-left: 1px solid #e0e0e0;
    }

    &__temp {
      display: flex;
      align-items: center;
      pointer-events: none;
      user-select: none;
    }

    &__temp-number {
      font-size: 34px;
      font-weight: 700;
      line-height: 100%;
    }

    &__temp-unit {
      margin-bottom: auto;
      margin-top: 3px;
      font-size: 20px;
      font-weight: 500;
      line-height: 100%;
    }

    &__descr {
      max-width: 100%;
      height: 30px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 13px;
      line-height: 100%;
      pointer-events: none;
      user-select: none;

      > span {
        &:first-letter {
          text-transform: uppercase;
        }
      }
    }

    &__time {
      margin-top: 30px;
      pointer-events: none;
      user-select: none;
    }

    &__icon {
      position: absolute;
      top: -10px;
      right: 0;
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.6));
      pointer-events: none;
      user-select: none;
      -webkit-user-drag: none;
    }
  }
}

.forecast {
  margin-top: 50px;
  padding: 0;
  display: flex;
  overflow: hidden;

  .day {
    position: relative;
    min-width: 120px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    flex: 1;
    cursor: pointer;

    &:first-of-type {
      padding-left: 30px;
    }

    &:last-of-type {
      padding-right: 30px;
    }

    &:not(:first-of-type)::after {
      content: "";
      position: absolute;
      top: 20px;
      left: 0;
      bottom: 20px;
      width: 1px;
      background-color: #e0e0e0;
      opacity: 1;
      transition: 0.3s;
    }

    &:hover,
    &.active {
      box-shadow: inset 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
    }

    &.active {
      &::after {
        top: 0;
        bottom: 0;
        opacity: 0;
      }

      & + .day::after {
        top: 0;
        bottom: 0;
        opacity: 0;
      }
    }

    &__date {
      font-size: 24px;
      line-height: 100%;
      text-align: center;
      pointer-events: none;
      user-select: none;
    }

    .temp {
      margin-top: 30px;
      display: flex;
      pointer-events: none;
      user-select: none;

      &__number {
        font-size: 34px;
        font-weight: 700;
        line-height: 100%;
      }

      &__unit {
        margin-bottom: auto;
        margin-top: 3px;
        font-size: 20px;
        font-weight: 500;
        line-height: 100%;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .forecast {
    .day {
      padding: 30px 15px;

      &__date {
        font-size: 14px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .forecast {
    flex-direction: column;

    .day {
      padding: 15px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &:first-of-type {
        padding-left: 15px;
      }

      &:last-of-type {
        padding-right: 15px;
      }

      &:not(:first-of-type)::after {
        top: 0;
        right: 20px;
        bottom: initial;
        left: 20px;
        width: initial;
        height: 1px;
      }

      &.active {
        &::after {
          right: 0;
          left: 0;
          opacity: 0;
        }

        & + .day::after {
          right: 0;
          left: 0;
          opacity: 0;
        }
      }

      &__date {
        font-size: 14px;
      }

      .temp {
        margin-top: initial;
        margin-right: 30px;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .main {
    &__header {
      flex-direction: column-reverse;
    }

    &__temp {
      margin-top: 20px;
    }

    &__icon {
      top: initial;
      bottom: -20px;
      transform: initial;
    }

    .title {
      margin-left: 0;
    }
  }

  .forecast-day {
    .item {
      &__icon {
        right: 0;
      }
    }
  }
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
