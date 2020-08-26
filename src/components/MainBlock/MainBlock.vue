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
    ForecastDay,
  },

  props: {
    today: Object,
    forecastList: Array,
    activeDay: String,
    getTime: Function,
    getTempC: Function,
    getConvertedDate: Function,
  },

  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./_MainBlock.scss";
</style>
