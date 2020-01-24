function blobToArrayBuffer(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsArrayBuffer(blob);
  });
}

export default {
  state: {
    indicatorArray: null,
    saturationArray: null,
    time: 0,
    domain: {
      dimensions: [100, 50],
      wells: [{ name: 'w1', position: [11, 15] }],
      setup: {
        maxHeight: 30,
      },
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
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.indicatorArray = new Uint8Array(arrayBuffer);
      });
    },
    SANDTANK_SATURATION_UPDATE({ state }, { array, time }) {
      state.time = time;
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.saturationArray = new Uint8Array(arrayBuffer);
      });
    },
  },
};
