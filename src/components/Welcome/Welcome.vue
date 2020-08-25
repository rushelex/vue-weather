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
    Card
  },

  props: {
    update: Function
  },

  data() {
    return {
      localApiKey: this.apiKey
    };
  },

  methods: {
    setApiKey(val) {
      this.$store.commit("setApiKey", val);
      this.update();
    }
  },

  computed: {
    apiKey: {
      get() {
        return this.$store.state.apiKey;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/scss";

.welcome {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);

  &__title {
    font-size: 24px;
    font-weight: 500;
    line-height: 100%;
    user-select: none;
  }

  &__body {
    margin-top: 30px;
    height: 40px;
    display: flex;
  }

  &__input {
    @include placeholder() {
      font: inherit;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
    }
    height: 100%;
    padding: 10px 15px;
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    outline: none;
    font: inherit;
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    user-select: none;
    transition: 0.3s;

    &:hover {
      border-color: rgba(0, 0, 0, 0.7);
    }

    &:focus {
      border-color: rgba(0, 0, 0, 1);
    }
  }

  &__submit {
    @include buttonReset();
    height: 100%;
    margin-left: 20px;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    font-weight: 500;
    letter-spacing: 0.0625em;
    color: #ffffff;
    pointer-events: none;
    transition: 0.3s;
    user-select: none;

    &.active {
      background-color: rgba(0, 0, 0, 1);
      pointer-events: all;
    }
  }

  > .card {
    max-width: 500px;
  }
}

@media screen and (max-width: 600px) {
  .welcome {
    padding: 0 15px;

    &__body {
      height: initial;
      flex-direction: column;
    }

    &__submit {
      margin-top: 15px;
      margin-left: initial;
    }
  }
}
</style>
