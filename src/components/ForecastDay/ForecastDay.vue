<template>
  <div class="forecast-day" :class="{ skeleton: loading }">
    <Skeleton
      v-if="loading"
      width="100%"
      height="143px"
      class="forecast-day__inner"
    />
    <div v-else class="forecast-day__inner">
      <div
        class="forecast-day__item item"
        v-for="item in getForecastListOfDay(this.forecastList)"
        :key="item.dt"
      >
        <div class="item__temp">
          <span class="item__temp-number">{{ getTempC(item.main.temp) }}</span>
          <span class="item__temp-unit"> °C</span>
        </div>
        <div class="item__descr">
          <span>{{ transformFirstSymbol(item.weather[0].description) }}</span>
        </div>
        <div class="item__time">
          <span>{{ getTime(item.dt) }}</span>
        </div>
        <img
          class="item__icon"
          :src="`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`"
          alt="Weather icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Skeleton from "@/components/Skeleton";

export default {
  name: "ForecastDay",

  components: {
    Skeleton,
  },

  props: {
    activeDay: String,
    forecastList: Array,
    getTime: Function,
    getTempC: Function,
    getConvertedDate: Function,
  },

  methods: {
    /**
     * Returns the weather forecast of day
     *
     * @param {array} forecastList
     * @returns {array}
     */
    getForecastListOfDay(forecastList) {
      let forecastListOfDay = [];

      if (forecastList) {
        forecastList.forEach((item) => {
          if (this.activeDay === this.getConvertedDate(item.dt)) {
            forecastListOfDay.push(item);
          }
        });

        return forecastListOfDay;
      }
    },

    /**
     * Returns the same string with the first large character
     *
     * @param {string} str
     * @returns {string|*}
     */
    transformFirstSymbol(str) {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    },
  },

  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./_ForecastDay.scss";
</style>
