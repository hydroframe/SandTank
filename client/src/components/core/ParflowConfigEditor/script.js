import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ParflowConfigEditor',
  computed: {
    ...mapGetters({
      config: 'PARFLOW_JOB',
    }),
    runLength: {
      get() {
        return this.config.runLength;
      },
      set(v) {
        this.setJobLength(Number(v));
      },
    },
    runReset: {
      get() {
        return !!this.config.runReset;
      },
      set(v) {
        if (v) {
          this.resetJob();
        }
      },
    },
    hLeft: {
      get() {
        return this.config.hLeft;
      },
      set(v) {
        this.setLeftPressure(Number(v));
      },
    },
    hRight: {
      get() {
        return this.config.hRight;
      },
      set(v) {
        this.setRightPressure(Number(v));
      },
    },

    isLake: {
      get() {
        return this.config.isLake;
      },
      set(v) {
        this.setTypeToLake(Number(v));
      },
    },
    wellFlux_1: {
      get() {
        return this.config.wellFlux_1;
      },
      set(v) {
        this.setWell({ well: '1', value: Number(v) });
      },
    },

    wellFlux_2: {
      get() {
        return this.config.wellFlux_2;
      },
      set(v) {
        this.setWell({ well: '2', value: Number(v) });
      },
    },
    wellFlux_3: {
      get() {
        return this.config.wellFlux_3;
      },
      set(v) {
        this.setWell({ well: '3', value: Number(v) });
      },
    },
    wellFlux_4: {
      get() {
        return this.config.wellFlux_4;
      },
      set(v) {
        this.setWell({ well: '4', value: Number(v) });
      },
    },
    wellFlux_5: {
      get() {
        return this.config.wellFlux_5;
      },
      set(v) {
        this.setWell({ well: '5', value: Number(v) });
      },
    },
    wellFlux_6: {
      get() {
        return this.config.wellFlux_6;
      },
      set(v) {
        this.setWell({ well: '6', value: Number(v) });
      },
    },
    wellFlux_7: {
      get() {
        return this.config.wellFlux_7;
      },
      set(v) {
        this.setWell({ well: '7', value: Number(v) });
      },
    },
    wellFlux_8: {
      get() {
        return this.config.wellFlux_8;
      },
      set(v) {
        this.setWell({ well: '8', value: Number(v) });
      },
    },
    wellFlux_9: {
      get() {
        return this.config.wellFlux_9;
      },
      set(v) {
        this.setWell({ well: '9', value: Number(v) });
      },
    },
    wellFlux_10: {
      get() {
        return this.config.wellFlux_10;
      },
      set(v) {
        this.setWell({ well: '10', value: Number(v) });
      },
    },
    wellFlux_11: {
      get() {
        return this.config.wellFlux_11;
      },
      set(v) {
        this.setWell({ well: '11', value: Number(v) });
      },
    },
  },
  methods: {
    ...mapMutations({
      setParflowBusy: 'UI_BUSY_PARFLOW_SET',
      resetJob: 'PARFLOW_RESET',
      setJobLength: 'PARFLOW_RUN_LENGTH_SET',
      setLeftPressure: 'PARFLOW_LEFT_PRESSURE_SET',
      setRightPressure: 'PARFLOW_RIGHT_PRESSURE_SET',
      setTypeToLake: 'PARFLOW_LAKE_SET',
      setWell: 'PARFLOW_WELL_SET',
    }),
  },
};
