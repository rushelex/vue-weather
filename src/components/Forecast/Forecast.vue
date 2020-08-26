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
    Skeleton,
  },

  props: {
    forecastListForEachDay: Object,
    findLocation: Function,
    getTempC: Function,
    setActiveDay: Function,
  },

  methods: {
    /**
     * Returns average value temperature of day
     *
     * @param {array} day
     * @returns {number}
     */
    getAverageTempOfDay(day) {
      let tempArr = [];
      let averageTemp = null;

      day.forEach((item) => tempArr.push(item?.main?.temp));
      averageTemp = tempArr.reduce((a, b) => a + b, 0) / tempArr.length;
      averageTemp = Math.round(averageTemp);

      return averageTemp;
    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./_Forecast.scss";
</style>
