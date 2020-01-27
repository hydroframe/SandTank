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
        this.setReset(v);
      },
    },
  },
  methods: {
    ...mapMutations({
      setReset: 'PARFLOW_RESET_SET',
      setJobLength: 'PARFLOW_RUN_LENGTH_SET',
    }),
  },
};
