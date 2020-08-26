<template>
  <transition v-if="this.error" name="easeOutBounce">
    <div class="toast">
      <span>Не удалось получить местоположение.</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",

  props: {
    error: {
      default: false,
      type: undefined,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./_Toast.scss";
</style>
