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

  props: ["error"]
};
</script>

<style lang="scss" scoped>
@import "@/scss";

.toast {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999999;
  width: auto;
  min-width: 200px;
  height: 50px;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $errorColorBg;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

@media screen and (max-width: 768px) {
  .toast {
    top: 15px;
    left: 20px;
  }
}
</style>
