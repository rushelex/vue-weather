<template>
  <Card v-if="this.localCoords.length === 2" class="map">
    <yandex-map
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
import Card from "@/components/Card.vue";
import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  name: "Map",

  components: {
    Card,
    yandexMap,
    ymapMarker
  },

  props: {
    coords: Array,
    findLocation: Function
  },

  data() {
    return {
      localCoords: this.coords,
      ymapSettings: {
        apiKey: "88a99d43-03f8-4572-be63-fae267111ff9",
        lang: "ru_RU",
        coordorder: "latlong",
        version: "2.1"
      }
    };
  },

  methods: {
    getPosition(e) {
      this.localCoords = e.get("coords");
      // this.findLocation();
      // console.log("this.localCoords :>> ", this.localCoords);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss";

.map {
  height: 500px;
  margin-top: 50px;
}

.ymap-container {
  height: 100%;
}
</style>
