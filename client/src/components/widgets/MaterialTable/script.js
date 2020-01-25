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
  },
  watch: {
    dark(v) {
      document.documentElement.style.setProperty(
        '--text-shadow-bg-color',
        v ? '#000' : '#fff'
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
  },
};
