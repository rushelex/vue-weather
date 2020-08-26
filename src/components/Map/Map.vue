<template>
  <Card
    class="map"
    :class="{ skeletonLoaded: loading && this.localCoords.length === 2 }"
  >
    <Skeleton
      v-if="loading && this.localCoords.length !== 2"
      width="100%"
      height="100%"
    />
    <yandex-map
      v-else
      :settings="this.ymapSettings"
      :coords="this.localCoords"
      @click="getPosition"
    >
      <ymap-marker
        :coords="this.localCoords"
        marker-id="1"
        hint-content="Вы здесь"
      />
    </yandex-map>
  </Card>
</template>

<script>
import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";
import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  name: "Map",

  components: {
    Card,
    Skeleton,
    yandexMap,
    ymapMarker,
  },

  props: {
    coords: Array,
    findLocation: Function,
  },

  data() {
    return {
      localCoords: this.coords,
      ymapSettings: {
        apiKey: "88a99d43-03f8-4572-be63-fae267111ff9",
        lang: "ru_RU",
        coordorder: "latlong",
        version: "2.1",
      },
    };
  },

  methods: {
    /**
     * 1. Runs the this.findLocation() function
     * 2. Adds an array with latitude and longitude coordinates to the Store when clicking on the map
     *
     * @param {object} e
     */
    getPosition(e) {
      this.localCoords = e.get("coords");
      this.findLocation(...this.localCoords);
      this.$store.commit("setCoords", this.localCoords);
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
@import "./_Map.scss";
</style>
