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
      advanced: false,
    };
  },
  computed: {
    ...mapGetters({
      help: 'SANDTANK_HELP',
      busy: 'PARFLOW_BUSY',
      connected: 'PVW_CONNECTED',
      pvwBusy: 'PVW_BUSY',
      parflowExecutionCount: 'PARFLOW_EXEC_COUNT',
      flowMap: 'SANDTANK_FLOW_MAP',
      storageMap: 'SANDTANK_STORAGE_MAP',
      domain: 'SANDTANK_DOMAIN',
      //
      time: 'SANDTANK_TIME',
      config: 'PARFLOW_JOB',
    }),
    storageUnits() {
      const units = {};
      if (this.domain && this.domain.storages) {
        this.domain.storages.forEach(({ name, unit }) => {
          units[name] = unit;
        });
      }
      return units;
    },
    flowUnits() {
      const units = {};
      if (this.domain && this.domain.flows) {
        this.domain.flows.forEach(({ name, unit }) => {
          units[name] = unit;
        });
      }
      return units;
    },
    isLake: {
      get() {
        return this.config.isLake;
      },
      set(v) {
        this.setTypeToLake(Number(v));
      },
    },
    informations() {
      if (this.isLake) {
        return `Lake storage ${this.storageMap.lake.toFixed(4)} ${
          this.storageUnits.lake
        }`;
      }
      return `River flow ${this.flowMap.river} ${this.flowUnits.river}`;
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
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    openHelp() {
      window.open(this.help, '_blank');
    },
  },
  created() {
    this.pvwConnect();
  },
  beforeDestroy() {
    this.pvwDisconnect();
  },
};
