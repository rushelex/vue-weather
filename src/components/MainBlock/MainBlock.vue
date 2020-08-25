<template>
  <Card class="main">
    <div class="main__header">
      <Skeleton
        v-if="loading && !today.temp"
        width="100px"
        height="100px"
        class="main__temp temp"
      />
      <div v-else class="main__temp temp">
        <span class="temp__number">{{ getTempC(today.temp) }}</span>
        <span class="temp__unit"> °C</span>
      </div>

      <Skeleton
        v-if="loading && !today.date"
        width="200px"
        height="50px"
        class="main__title title"
      />
      <div v-else class="main__title title">
        <span>{{ this.activeDay }}</span>
      </div>

      <Skeleton
        v-if="loading && !today.icon"
        width="100px"
        height="100px"
        class="main__icon"
      />
      <img
        v-else
        class="main__icon"
        :src="`http://openweathermap.org/img/wn/${today.icon}@2x.png`"
        alt="Weather icon"
      />
    </div>
    <div class="main__body">
      <ForecastDay
        class="main__forecast-day"
        :activeDay="this.activeDay"
        :forecastList="this.forecastList"
        :getTime="this.getTime"
        :getTempC="this.getTempC"
        :getConvertedDate="this.getConvertedDate"
      />
    </div>
  </Card>
</template>

<script>
import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";
import ForecastDay from "@/components/ForecastDay";

export default {
  name: "MainBlock",

  components: {
    Card,
    Skeleton,
    ForecastDay
  },

  props: {
    today: Object,
    forecastList: Array,
    activeDay: String,
    getTime: Function,
    getTempC: Function,
    getConvertedDate: Function
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

    &.skeleton {
      filter: initial;
    }
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

      &.skeleton {
        bottom: 0;
      }
    }

    .title {
      margin-left: 0;
    }
  }
}
</style>
