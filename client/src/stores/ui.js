export default {
  state: {
    mode: 'visualization',
    parflowBusy: false,
  },
  getters: {
    UI_MODE_IS_VISUALIZATION(state) {
      return state.mode === 'visualization';
    },
    UI_MODE_IS_MATERIAL_DEFINITION(state) {
      return state.mode === 'material';
    },
    UI_BUSY_PARFLOW(state) {
      return state.parflowBusy;
    },
  },
  mutations: {
    UI_BUSY_PARFLOW_SET(state, value) {
      state.parflowBusy = value;
    },
  },
  actions: {
    UI_TOGGLE_MODE({ state }) {
      state.mode =
        state.mode === 'visualization' ? 'material' : 'visualization';
    },
  },
};
