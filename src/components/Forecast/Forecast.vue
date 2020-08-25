<template>
  <Card
    class="forecast"
    :class="{ skeletonLoaded: loading && this.forecastListForEachDay }"
  >
    <Skeleton
      v-if="loading && !this.forecastListForEachDay"
      width="100%"
      height="110px"
      class="forecast__day day"
    />
    <div
      v-else
      v-for="(value, key) in this.forecastListForEachDay"
      :key="value.dt"
      class="forecast__day day"
      :class="{ active: key === activeDay }"
      @click="
        () => {
          findLocation(...coords);
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
</template>

<script>
import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default {
  name: "Forecast",

  components: {
    Card,
    Skeleton
  },

  props: {
    forecastListForEachDay: Object,
    findLocation: Function,
    getTempC: Function,
    setActiveDay: Function
  },

  methods: {
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
    }
  },

  computed: {
    activeDay() {
      return this.$store.state.activeDay;
    },
    coords() {
      return this.$store.state.coords;
    },
    loading() {
      return this.$store.state.loading;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/scss";

.forecast {
  margin-top: 50px;
  padding: 0;
  display: flex;
  overflow: hidden;

  &.skeletonLoaded {
    padding: 0 !important;

    &::after {
      display: none;
    }
  }

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

    &.skeleton {
      cursor: default;

      &:hover {
        box-shadow: initial;
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
</style>
