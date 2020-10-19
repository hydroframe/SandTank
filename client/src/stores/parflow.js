export default {
  state: {
    busyCount: 0,
    execCount: 0,
    runLength: 10,
    runReset: 1,
    hLeft: 30,
    hRight: 30,
    isLake: 0,
    k: {},
    wells: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
  },
  getters: {
    PARFLOW_BUSY(state) {
      return !!state.busyCount;
    },
    PARFLOW_EXEC_COUNT(state) {
      return state.execCount;
    },
    PARFLOW_JOB(state, getters) {
      const runId = getters.PVW_RUN_ID;
      return {
        runId,
        runLength: state.runLength,
        runReset: state.runReset,
        hLeft: state.hLeft,
        hRight: state.hRight,
        isLake: state.isLake,
        k: state.k,
        wells: state.wells,
      };
    },
    PARFLOW_K(state) {
      return state.k;
    },
    PARFLOW_WELLS(state) {
      return state.wells;
    },
  },
  mutations: {
    PARFLOW_RESET_SET(state, value) {
      state.runReset = value ? 1 : 0;
    },
    PARFLOW_RUN_LENGTH_SET(state, value) {
      state.runLength = value;
    },
    PARFLOW_LEFT_PRESSURE_SET(state, value) {
      state.hLeft = value;
    },
    PARFLOW_RIGHT_PRESSURE_SET(state, value) {
      state.hRight = value;
    },
    PARFLOW_LAKE_SET(state, value) {
      state.isLake = value ? 1 : 0;
      // Do not auto-reset
      // state.runReset = 1;
    },
    PARFLOW_WELL_SET(state, { well, value }) {
      state.wells = Object.assign({}, state.wells, { [well]: value });
    },
    PARFLOW_K_SET(state, value) {
      state.k = Object.assign({}, state.k, value);
      // Do not auto-reset
      // state.runReset = 1;
    },
  },
  actions: {
    async PARFLOW_RUN({ state, getters, dispatch }) {
      if (state.busyCount) {
        return;
      }
      state.busyCount += 1;

      const job = getters.PARFLOW_JOB;

      if (job.runReset) {
        await dispatch('PVW_RESET');
      }

      // Push configuration
      await dispatch('PVW_CONFIG_UPDATE', job);
    },
    PARFLOW_RUN_COMPLETE({ state, getters, dispatch }, { returncode }) {
      state.busyCount -= 1;

      const job = getters.PARFLOW_JOB;
      if (job.runReset) {
        state.execCount = 1;
      } else {
        state.execCount += 1;
      }

      if (returncode === 0) {
        state.runReset = 0;
        dispatch('PARFLOW_RESET_WELLS');
      } else {
        console.error('Parflow run failed');
      }
    },
    PARFLOW_RESET_WELLS({ state }) {
      const { wells } = state;
      const resetWells = {};
      Object.keys(wells).forEach((key) => {
        resetWells[key] = 0;
      });
      state.wells = resetWells;
    },
  },
};
