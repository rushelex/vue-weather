<template>
  <div class="welcome">
    <Card>
      <div class="welcome__title">Введите API-ключ</div>
      <div class="welcome__body">
        <label>
          <input
            type="text"
            class="welcome__input welcome__input--api"
            placeholder="API-ключ"
            autofocus
            v-model="localApiKey"
            @keypress.enter="setApiKey(localApiKey)"
          />
        </label>
        <button
          class="welcome__submit"
          :class="{ active: localApiKey }"
          @click="setApiKey(localApiKey)"
        >
          Подтвердить
        </button>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card";

export default {
  name: "Welcome",

  components: {
    Card,
  },

  props: {
    update: Function,
  },

  data() {
    return {
      localApiKey: this.apiKey,
    };
  },

  methods: {
    /**
     * Adds API key to the Store
     *
     * @param {string} val
     */
    setApiKey(val) {
      this.$store.commit("setApiKey", val);
      this.update();
    },
  },

  computed: {
    apiKey: {
      get() {
        return this.$store.state.apiKey;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./_Welcome.scss";
</style>
