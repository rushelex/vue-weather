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
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);

  &.skeleton {
    padding: 20px !important;
  }
}
</style>
