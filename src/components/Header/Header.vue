<template>
  <div class="header">
    <div class="header__title">Weather app</div>
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style lang="scss" scoped>
@import "~@/scss";

.header {
  position: fixed;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;

  &__title {
    font-family: "Montserrat";
    font-size: 30px;
    font-weight: 700;
    line-height: 100%;
  }
}
</style>
