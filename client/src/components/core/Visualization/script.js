import { mapGetters, mapMutations } from 'vuex';

import MaterialLayer from 'parflow-web/src/components/widgets/MaterialLayer';
import PollutantLayer from 'parflow-web/src/components/widgets/PollutantLayer';
import SaturationLayer from 'parflow-web/src/components/widgets/SaturationLayer';
import StillWater from 'parflow-web/src/components/widgets/StillWater';
import VerticalSlider from 'parflow-web/src/components/widgets/VerticalSlider';
import WellControl from 'parflow-web/src/components/widgets/WellControl';
import WellLayer from 'parflow-web/src/components/widgets/WellLayer';

import { fromPermeabilityToType } from 'parflow-web/src/utils/Permeability';
import { debounce } from 'vtk.js/Sources/macro';

export default {
  name: 'Visualization',
  components: {
    MaterialLayer,
    PollutantLayer,
    SaturationLayer,
    StillWater,
    VerticalSlider,
    WellControl,
    WellLayer,
  },
  props: {
    sliderWidth: {
      type: Number,
      default: 80,
    },
    controlOffset: {
      type: Number,
      default: 150,
    },
    showOpacitySliders: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      opacityPollutant: 0.6,
      opacityStillWater: 1,
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
      mask: 'SANDTANK_MASK',
      pressures: 'SANDTANK_PRESSURES',
      concentrationRange: 'SANDTANK_CONCENTRATION_RANGE',
      concentration: 'SANDTANK_CONCENTRATION_ARRAY',
    }),
    showWueSlider() {
      // If "features" list found in domain and it contains "waterUseEfficiency", display slider
      return this.domain.hasOwnProperty('features') && this.domain.features.includes('waterUseEfficiency');
    },
    showIrrigationSlider() {
      // If "features" list found in domain and it contains "irrigationEfficiency", display slider
      return this.domain.hasOwnProperty('features') && this.domain.features.includes('irrigationEfficiency');
    },
    wellIncrement() {
      return (
        (this.domain && this.domain.setup && this.domain.setup.wellIncrement) ||
        1
      );
    },
    size() {
      if (!this.domain) {
        return [10, 10];
      }
      return this.domain.dimensions.filter((v) => v > 1);
    },
    containerStyle() {
      return {
        height: `${this.size[1] * this.scale}px`,
        width: `${this.size[0] * this.scale}px`,
      };
    },
    maxTankHeightStyle() {
      return {
        minHeight: `${Math.max(
          this.domain.setup.maxHeight * this.scale,
          this.size[1] * this.scale + this.controlOffset
        )}px`,
        maxHeight: `${Math.max(
          this.domain.setup.maxHeight * this.scale,
          this.size[1] * this.scale + this.controlOffset
        )}px`,
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
    minWellSpacing() {
      let distance = 1000;
      for (let i = 1; i < this.domain.wells.length; i++) {
        const d =
          this.domain.wells[i].position[0] -
          this.domain.wells[i - 1].position[0];
        if (d < distance) {
          distance = d;
        }
      }
      return distance - 1;
    },
    autoHideControls() {
      return this.minWellSpacing * this.scale < 20;
    },
  },
  watch: {
    domain() {
      this.$nextTick(this.onResize);
    },
  },
  methods: {
    ...mapMutations({
      resetJob: 'PARFLOW_RESET',
      setJobLength: 'PARFLOW_RUN_LENGTH_SET',
      setLeftPressure: 'PARFLOW_LEFT_PRESSURE_SET',
      setRightPressure: 'PARFLOW_RIGHT_PRESSURE_SET',
      setIrrigationEfficiency: 'PARFLOW_IE_SET',
      setWaterUseEfficiency: 'PARFLOW_WUE_SET',
      setTypeToLake: 'PARFLOW_LAKE_SET',
      updateWell: 'PARFLOW_WELL_SET',
    }),
    getTexture(key) {
      return fromPermeabilityToType(this.permeabilityMap[key]);
    },
    getWellMode(key) {
      return Math.sign(this.wellsMap[key]);
    },
    getWellValue(key) {
      return this.wellsMap[key];
    },
    canPump(well, i, j) {
      if (this.saturation) {
        const saturation = this.saturation[i + j * this.size[0]];
        if (saturation === 255) {
          return true;
        }
      }
      if (this.wellsMap[well] < 0) {
        this.updateWell({ well, value: 0 });
      }

      return false;
    },
  },
  created() {
    this.onResize = debounce(() => {
      const { width, height } = this.$el.getBoundingClientRect();
      this.maxWidth = width - 2 * this.sliderWidth - 20;
      this.maxHeight = Math.max(
        height - this.controlOffset,
        window.innerHeight - 250 - this.controlOffset
      );
    }, 200);
    window.addEventListener('resize', this.onResize);
  },
  mounted() {
    this.$nextTick(this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
};
