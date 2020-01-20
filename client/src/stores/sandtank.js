export default {
  state: {
    domainSize: [1, 1, 1],
    indicatorArray: null,
  },
  getters: {
    SANDTANK_INDICATOR(state) {
      return state.indicatorArray;
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
  },
};
