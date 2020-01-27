export default {
  name: 'MaterialTable',
  components: {},
  props: {
    indicators: {
      type: Array,
      default() {
        return [{ key: 1, color: 'red', value: 0.5 }];
      },
    },
    soilVisibility: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    dark(v) {
      document.documentElement.style.setProperty(
        '--text-shadow-bg-color',
        v ? '#000' : '#fff'
      );
      document.documentElement.style.setProperty(
        '--text-transparent-bg-color',
        v ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'
      );
    },
  },
  computed: {
    dark() {
      return this.$vuetify.theme.dark;
    },
  },
  methods: {
    updateIndicator(key, value) {
      this.$emit('change', { key, value });
    },
    updateSoilVisibility(value) {
      this.$emit('visibility', value);
    },
  },
};
