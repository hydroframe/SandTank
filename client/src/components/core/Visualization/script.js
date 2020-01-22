import { mapGetters, mapMutations } from 'vuex';

import MaterialLayer from 'parflow-web/src/components/widgets/MaterialLayer';
import SaturationLayer from 'parflow-web/src/components/widgets/SaturationLayer';

export default {
  name: 'Visualization',
  components: {
    MaterialLayer,
    SaturationLayer,
  },
  data() {
    return {
      scale: 15,
    };
  },
  computed: {
    ...mapGetters({
      domain: 'SANDTANK_DOMAIN',
      indicatorMask: 'SANDTANK_INDICATOR',
      saturation: 'SANDTANK_SATURATION',
    }),
    size() {
      if (!this.domain) {
        return [10, 10];
      }
      return this.domain.dimensions;
    },
    containerStyle() {
      return {
        height: `${this.domain.dimensions[1] * this.scale}px`,
      };
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
