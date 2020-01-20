export default {
  state: {
    domainSize: null,
    indicatorArray: null,
    saturationArray: null,
  },
  getters: {
    SANDTANK_INDICATOR(state) {
      return state.indicatorArray;
    },
    SANDTANK_SATURATION(state) {
      return state.saturationArray;
    },
    SANDTANK_SIZE(state) {
      return state.domainSize;
    },
  },
  actions: {
    SANDTANK_INDICATOR_UPDATE({ state, dispatch }) {
      dispatch('PVW_INDICATOR_GET').then((response) => {
        if (response) {
          const { dimensions, array } = response;
          state.domainSize = dimensions;
          array.arrayBuffer().then((arrayBuffer) => {
            state.indicatorArray = new Uint8Array(arrayBuffer);
          });
        } else {
          console.log('need to fetch indicator again');
        }
      });
    },
    SANDTANK_SATURATION_UPDATE({ state }, saturationArray) {
      saturationArray.arrayBuffer().then((arrayBuffer) => {
        state.saturationArray = new Uint8Array(arrayBuffer);
      });
    },
  },
};
