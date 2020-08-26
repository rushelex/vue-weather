import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiKey: null,
    activeDay: null,
    coords: [],
    loading: false,
  },
  mutations: {
    setApiKey(state, payload) {
      state.apiKey = payload;
      localStorage.apiKey = payload;
    },
    setActiveDay(state, payload) {
      state.activeDay = payload;
    },
    setCoords(state, payload) {
      state.coords = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {},
  modules: {},
});
