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
    Skeleton
  },

  props: {
    activeDay: String,
    forecastList: Array,
    getTime: Function,
    getTempC: Function,
    getConvertedDate: Function
  },

  methods: {
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
    transformFirstSymbol(str) {
      if (!str) return str;
      return str[0].toUpperCase() + str.slice(1);
    }
  },

  computed: {
    loading() {
      return this.$store.state.loading;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/scss";

.forecast-day {
  position: relative;
  margin-top: 20px;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;

  &.skeleton {
    width: 100%;
    padding: 0;

    &::after {
      display: none;
    }
  }

  &__inner {
    display: flex;
    overflow: auto;
  }

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

@media screen and (max-width: 600px) {
  .forecast-day {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 15px;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 100%
      );
      pointer-events: none;
    }

    .item {
      &__icon {
        right: 0;
      }
    }
  }
}
</style>
