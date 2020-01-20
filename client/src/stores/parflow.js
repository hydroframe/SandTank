import Vue from 'vue';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();

export default {
  state: {
    busyCount: 0,
    execCount: 0,
    runLength: 10,
    runReset: 1,
    hLeft: 30,
    hRight: 30,
    isLake: 0,
    wellFlux_1: 0,
    wellFlux_2: 0,
    wellFlux_3: 0,
    wellFlux_4: 0,
    wellFlux_5: 0,
    wellFlux_6: 0,
    wellFlux_7: 0,
    wellFlux_8: 0,
    wellFlux_9: 0,
    wellFlux_10: 0,
    wellFlux_11: 0,
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
        application: 'parflow',
        runId,
        runLength: state.runLength,
        runReset: state.runReset,
        hLeft: state.hLeft,
        hRight: state.hRight,
        isLake: state.isLake,
        wellFlux_1: state.wellFlux_1,
        wellFlux_2: state.wellFlux_2,
        wellFlux_3: state.wellFlux_3,
        wellFlux_4: state.wellFlux_4,
        wellFlux_5: state.wellFlux_5,
        wellFlux_6: state.wellFlux_6,
        wellFlux_7: state.wellFlux_7,
        wellFlux_8: state.wellFlux_8,
        wellFlux_9: state.wellFlux_9,
        wellFlux_10: state.wellFlux_10,
        wellFlux_11: state.wellFlux_11,
      };
    },
  },
  mutations: {
    PARFLOW_RESET(state) {
      state.runReset = 1;
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
    },
    PARFLOW_WELL_SET(state, { well, value }) {
      Vue.set(state, `wellFlux_${well}`, value);
    },
  },
  actions: {
    PARFLOW_RUN({ state, getters }) {
      state.busyCount += 1;

      const job = getters.PARFLOW_JOB;
      const task = JSON.stringify(job);
      console.log(task);
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = (e) => {
          if (xhr.readyState === 4) {
            state.busyCount -= 1;
            if (job.runReset) {
              state.execCount = 1;
            } else {
              state.execCount += 1;
            }
            if (xhr.status === 200 || xhr.status === 0) {
              state.runReset = 0;
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject({ xhr, e });
            }
          }
        };

        // Make request
        if (userParams.dev) {
          xhr.open('POST', 'http://localhost:9000/paraview/', true);
        } else {
          xhr.open('POST', '/paraview/', true);
        }

        xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhr.responseType = 'text';
        xhr.send(task);
      });
    },
  },
};
