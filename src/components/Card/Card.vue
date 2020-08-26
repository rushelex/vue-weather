<template>
  <div class="card" :class="{ skeleton: loading }">
    <slot />
  </div>
</template>

<script>
export default {
  name: "Card",

  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./_Card.scss";
</style>
