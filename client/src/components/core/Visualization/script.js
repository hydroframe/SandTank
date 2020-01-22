import { mapGetters, mapMutations } from 'vuex';

import MaterialLayer from 'parflow-web/src/components/widgets/MaterialLayer';
import SaturationLayer from 'parflow-web/src/components/widgets/SaturationLayer';
import WellLayer from 'parflow-web/src/components/widgets/WellLayer';
import VerticalSlider from 'parflow-web/src/components/widgets/VerticalSlider';

import { debounce } from 'vtk.js/Sources/macro';

export default {
  name: 'Visualization',
  components: {
    MaterialLayer,
    SaturationLayer,
    WellLayer,
    VerticalSlider,
  },
  data() {
    return {
      opacitySoil: 1,
      opacityWater: 1,
      opacityWells: 1,
      adjustingWaterOpacity: false,
      maxWidth: 0,
      maxHeight: 0,
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
        width: `${this.domain.dimensions[0] * this.scale}px`,
      };
    },
    maxTankHeightStyle() {
      return {
        maxHeight: `${this.domain.dimensions[1] * this.scale}px`,
      };
    },
    slowWaterOpacity() {
      return this.adjustingWaterOpacity ? 1 : this.opacityWater;
    },
    fastWaterOpacity() {
      return this.adjustingWaterOpacity ? this.opacityWater : 1;
    },
    scale() {
      const wScale = this.maxWidth / this.size[0];
      const hScale = this.maxHeight / this.size[1];
      return Math.floor(Math.max(1, Math.min(wScale, hScale)));
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
  created() {
    this.onResize = debounce(() => {
      this.maxWidth = window.innerWidth - 50;
      this.maxHeight = window.innerHeight - 250;
    }, 200);
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
      this.onResize();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
};
