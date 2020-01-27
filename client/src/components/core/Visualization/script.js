import { mapGetters, mapMutations } from 'vuex';

import MaterialLayer from 'parflow-web/src/components/widgets/MaterialLayer';
import SaturationLayer from 'parflow-web/src/components/widgets/SaturationLayer';
import VerticalSlider from 'parflow-web/src/components/widgets/VerticalSlider';
import WellControl from 'parflow-web/src/components/widgets/WellControl';
import WellLayer from 'parflow-web/src/components/widgets/WellLayer';
import { fromPermeabilityToType } from 'parflow-web/src/utils/Permeability';

import { debounce } from 'vtk.js/Sources/macro';

export default {
  name: 'Visualization',
  components: {
    MaterialLayer,
    SaturationLayer,
    VerticalSlider,
    WellControl,
    WellLayer,
  },
  props: {
    sliderWidth: {
      type: Number,
      default: 80,
    },
  },
  data() {
    return {
      opacitySoil: 1,
      opacityWater: 0.5,
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
      jobConfig: 'PARFLOW_JOB',
      permeabilityMap: 'PARFLOW_K',
      wellsMap: 'PARFLOW_WELLS',
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
        maxHeight: `${Math.max(
          this.domain.setup.maxHeight,
          this.domain.dimensions[1]
        ) * this.scale}px`,
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
      updateWell: 'PARFLOW_WELL_SET',
    }),
    getTexture(key) {
      return fromPermeabilityToType(this.permeabilityMap[key]);
    },
    getWellMode(key) {
      return Math.sign(this.wellsMap[key]);
    },
    canPump(well, i, j) {
      if (this.saturation) {
        const saturation = this.saturation[i + j * this.domain.dimensions[0]];
        if (saturation === 255) {
          return true;
        }
      }
      if (this.wellsMap[well] > 0) {
        this.updateWell({ well, value: 0 });
      }

      return false;
    },
  },
  created() {
    this.onResize = debounce(() => {
      this.maxWidth = window.innerWidth - 2 * this.sliderWidth - 20;
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
