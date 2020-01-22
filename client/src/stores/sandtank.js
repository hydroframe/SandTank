export default {
  state: {
    indicatorArray: null,
    saturationArray: null,
    time: 0,
    domain: {
      dimensions: [100, 50],
      wells: [{ name: 'w1', position: [11, 15] }],
    },
  },
  getters: {
    SANDTANK_DOMAIN(state) {
      return state.domain;
    },
    SANDTANK_INDICATOR(state) {
      return state.indicatorArray;
    },
    SANDTANK_SATURATION(state) {
      return state.saturationArray;
    },
    SANDTANK_TIME(state) {
      return state.time;
    },
  },
  mutations: {
    SANDTANK_DOMAIN_SET(state, value) {
      state.domain = value;
    },
  },
  actions: {
    SANDTANK_INDICATOR_UPDATE({ state }, { array }) {
      array.arrayBuffer().then((arrayBuffer) => {
        state.indicatorArray = new Uint8Array(arrayBuffer);
      });
    },
    SANDTANK_SATURATION_UPDATE({ state }, { array, time }) {
      state.time = time;
      array.arrayBuffer().then((arrayBuffer) => {
        state.saturationArray = new Uint8Array(arrayBuffer);
      });
    },
  },
};
