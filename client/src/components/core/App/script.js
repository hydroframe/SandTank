import { mapGetters, mapMutations, mapActions } from 'vuex';

import About from 'parflow-web/src/components/core/About';
import MaterialEditor from 'parflow-web/src/components/core/MaterialEditor';
import ParflowConfigEditor from 'parflow-web/src/components/core/ParflowConfigEditor';
import Visualization from 'parflow-web/src/components/core/Visualization';

export default {
  name: 'ParflowWeb',
  components: {
    About,
    MaterialEditor,
    ParflowConfigEditor,
    Visualization,
  },
  data() {
    return {
      aboutDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      busy: 'PARFLOW_BUSY',
      connected: 'PVW_CONNECTED',
      pvwBusy: 'PVW_BUSY',
      parflowExecutionCount: 'PARFLOW_EXEC_COUNT',
      //
      time: 'SANDTANK_TIME',
      config: 'PARFLOW_JOB',
    }),
    isLake: {
      get() {
        return this.config.isLake;
      },
      set(v) {
        this.setTypeToLake(Number(v));
      },
    },
  },
  methods: {
    ...mapMutations({
      setTypeToLake: 'PARFLOW_LAKE_SET',
    }),
    ...mapActions({
      pvwConnect: 'PVW_CONNECT',
      pvwDisconnect: 'PVW_DISCONNECT',
      runParflow: 'PARFLOW_RUN',
      resetSimulation: 'SANDTANK_RESET',
    }),
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
  created() {
    this.pvwConnect();
  },
  beforeDestroy() {
    this.pvwDisconnect();
  },
};
