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
    solidArray: null,
    solidScaling: 1,
    time: 0,
    flows: {},
    storages: {},
    pressures: {},
    concentrationArray: null,
    concentrationDataRange: [0, 1],
    domain: {
      dimensions: [100, 1, 50],
      wells: [{ name: 'w1', position: [11, 15] }],
      setup: {
        maxHeight: 30,
      },
    },
  },
  getters: {
    SANDTANK_HELP(state) {
      return state.domain && state.domain.help;
    },
    SANDTANK_DOMAIN(state) {
      return state.domain;
    },
    SANDTANK_INDICATOR(state) {
      return state.indicatorArray;
    },
    SANDTANK_SATURATION(state) {
      return state.saturationArray;
    },
    SANDTANK_CONCENTRATION_RANGE(state) {
      return state.concentrationDataRange;
    },
    SANDTANK_CONCENTRATION_ARRAY(state) {
      return state.concentrationArray;
    },
    SANDTANK_TIME(state) {
      return state.time;
    },
    SANDTANK_MASK(state) {
      if (!state.solidArray) {
        return null;
      }

      return {
        scale: state.solidScaling,
        array: state.solidArray,
      };
    },
    SANDTANK_PRESSURES(state) {
      if (!state.domain.pressures) {
        return [];
      }

      const pressureMap = {};
      state.domain.pressures.forEach(({ name, iRange, pressureCell }) => {
        pressureMap[name] = {
          x: iRange[0],
          width: iRange[1] - iRange[0],
          y: pressureCell[2],
        };
      });
      const newFormat = Object.keys(state.pressures).map((k) =>
        Object.assign({}, pressureMap[k], { height: state.pressures[k] })
      );

      return newFormat.filter(({ height }) => height > 0);
    },
    SANDTANK_FLOW_MAP(state) {
      return state.flows;
    },
    SANDTANK_STORAGE_MAP(state) {
      return state.storages;
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
    SANDTANK_CONCENTRATION_UPDATE({ state }, { array, range }) {
      state.concentrationDataRange = range;
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.concentrationArray = new Float32Array(arrayBuffer);
      });
    },
    SANDTANK_PRESSURES_UPDATE({ state }, pressures) {
      state.pressures = pressures;
    },
    SANDTANK_FLOWS_UPDATE({ state }, flows) {
      state.flows = flows;
    },
    SANDTANK_STORAGES_UPDATE({ state }, storages) {
      state.storages = storages;
    },
    SANDTANK_MASK_UPDATE({ state }, { scale, array }) {
      state.solidScaling = scale;
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.solidArray = new Uint8Array(arrayBuffer);
      });
    },
    async SANDTANK_RESET({ state, commit, dispatch }) {
      state.time = 0;
      dispatch('PARFLOW_RESET_WELLS');
      commit('PARFLOW_LEFT_PRESSURE_SET', state.domain.setup.hLeft);
      commit('PARFLOW_RIGHT_PRESSURE_SET', state.domain.setup.hRight);
      commit('PARFLOW_RESET_SET', true);
      return dispatch('PVW_RESET');
    },
  },
};
