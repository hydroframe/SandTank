import { mapGetters, mapMutations, mapActions } from 'vuex';
import ParflowConfigEditor from 'parflow-web/src/components/core/ParflowConfigEditor';
import Visualization from 'parflow-web/src/components/core/Visualization';

export default {
  name: 'ParflowWeb',
  components: {
    ParflowConfigEditor,
    Visualization,
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
      indicatorContent: 'SANDTANK_INDICATOR',
      indicatorSize: 'SANDTANK_SIZE',
    }),
  },
  watch: {
    parflowExecutionCount(count) {
      if (count === 1) {
        this.fetchIndicator();
      }
    },
    indicatorContent(c) {
      console.log(c);
    },
    indicatorSize(c) {
      console.log(c);
    },
  },
  methods: {
    ...mapMutations({
      setParflowBusy: 'UI_BUSY_PARFLOW_SET',
    }),
    ...mapActions({
      toggleMode: 'UI_TOGGLE_MODE',
      pvwConnect: 'PVW_CONNECT',
      pvwDisconnect: 'PVW_DISCONNECT',
      runParflow: 'PARFLOW_RUN',
      fetchIndicator: 'SANDTANK_INDICATOR_UPDATE',
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
