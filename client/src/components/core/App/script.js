import { mapGetters, mapMutations, mapActions } from 'vuex';
import ParflowConfigEditor from 'parflow-web/src/components/core/ParflowConfigEditor';
import Visualization from 'parflow-web/src/components/core/Visualization';
import MaterialEditor from 'parflow-web/src/components/core/MaterialEditor';

export default {
  name: 'ParflowWeb',
  components: {
    ParflowConfigEditor,
    Visualization,
    MaterialEditor,
  },
  data() {
    return {
      showJobParams: false,
    };
  },
  computed: {
    ...mapGetters({
      busy: 'PARFLOW_BUSY',
      connected: 'PVW_CONNECTED',
      pvwBusy: 'PVW_BUSY',
      showMaterialEdit: 'UI_MODE_IS_MATERIAL_DEFINITION',
      showVisualization: 'UI_MODE_IS_VISUALIZATION',
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
      setParflowBusy: 'UI_BUSY_PARFLOW_SET',
      setTypeToLake: 'PARFLOW_LAKE_SET',
    }),
    ...mapActions({
      toggleMode: 'UI_TOGGLE_MODE',
      pvwConnect: 'PVW_CONNECT',
      pvwDisconnect: 'PVW_DISCONNECT',
      runParflow: 'PARFLOW_RUN',
    }),
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    toggleJobParameter() {
      this.showJobParams = !this.showJobParams;
    },
  },
  created() {
    this.pvwConnect();
  },
  beforeDestroy() {
    this.pvwDisconnect();
  },
};
