export default {
  state: {
    mode: 'visualization',
  },
  getters: {
    UI_MODE_IS_VISUALIZATION(state) {
      return state.mode === 'visualization';
    },
    UI_MODE_IS_MATERIAL_DEFINITION(state) {
      return state.mode === 'material';
    },
  },
  mutations: {},
  actions: {
    UI_TOGGLE_MODE({ state }) {
      state.mode =
        state.mode === 'visualization' ? 'material' : 'visualization';
    },
  },
};
