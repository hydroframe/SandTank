import { mapGetters, mapMutations } from 'vuex';

import ImageWidget from 'parflow-web/src/components/widgets/ImageWidget';

export default {
  name: 'Visualization',
  components: { ImageWidget },
  computed: {
    ...mapGetters({
      imageSize: 'SANDTANK_SIZE',
      data: 'SANDTANK_INDICATOR',
    }),
    size() {
      return this.imageSize.filter((a) => a > 1);
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
