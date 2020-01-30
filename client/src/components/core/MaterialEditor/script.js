import { mapGetters, mapMutations } from 'vuex';
import { debounce } from 'vtk.js/Sources/macro';

import MaterialLayer from 'parflow-web/src/components/widgets/MaterialLayer';
import MaterialTable from 'parflow-web/src/components/widgets/MaterialTable';
import WellLayer from 'parflow-web/src/components/widgets/WellLayer';
import { fromPermeabilityToType } from 'parflow-web/src/utils/Permeability';

export default {
  name: 'MaterialEditor',
  components: {
    MaterialLayer,
    MaterialTable,
    WellLayer,
  },
  props: {
    palette: {
      type: Array,
      default() {
        return [
          '#FFDB15',
          '#D3B340',
          '#826121',
          '#ECE7CE',
          '#CFC96C',
          '#E98973',
          '#E7D4C0',
          '#35454C',
          '#A4E8E0',
          '#020301',
          '#F3F5F9',
        ];
      },
    },
  },
  data() {
    return {
      maxWidth: 0,
      maxHeight: 0,
      showSoil: false,
    };
  },
  computed: {
    ...mapGetters({
      domain: 'SANDTANK_DOMAIN',
      indicatorMask: 'SANDTANK_INDICATOR',
      jobConfig: 'PARFLOW_JOB',
      permeabilityMap: 'PARFLOW_K',
      mask: 'SANDTANK_MASK',
    }),
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
        maxHeight: `${this.size[1] * this.scale}px`,
      };
    },
    scale() {
      const wScale = this.maxWidth / this.size[0];
      const hScale = this.maxHeight / this.size[1];
      return Math.floor(Math.max(1, Math.min(wScale, hScale)));
    },
    indicators() {
      if (this.domain && this.domain.setup && this.domain.setup.indicators) {
        return this.domain.setup.indicators.map(({ key }, idx) => ({
          key,
          value: this.permeabilityMap[key],
          color: this.palette[idx],
        }));
      }
      return [];
    },
  },
  watch: {
    domain() {
      this.$nextTick(this.onResize);
    },
  },
  methods: {
    ...mapMutations({
      updatePermeabilityMap: 'PARFLOW_K_SET',
    }),
    onPermeabilityChange({ key, value }) {
      this.updatePermeabilityMap({ [key]: value });
    },
    getTexture(key) {
      return fromPermeabilityToType(this.permeabilityMap[key]);
    },
    updateVisibility(v) {
      this.showSoil = v;
    },
  },
  created() {
    this.onResize = debounce(() => {
      const { width, height } = this.$el.getBoundingClientRect();
      this.maxWidth = width;
      this.maxHeight = Math.max(height, window.innerHeight - 250);
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
