export default {
  name: 'WellControl',
  props: {
    id: {
      type: String,
      default: '',
    },
    mode: {
      type: Number,
      default: 0,
    },
    canPump: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Number,
      default: 5,
    },
    activeColor: {
      type: String,
      default: '#03A9F4',
    },
  },
  methods: {
    color(currentMode) {
      if (currentMode === this.mode) {
        return this.activeColor;
      }
      return null;
    },
    trigger(mode) {
      const { id, value, canPump } = this;
      if (mode > 0 && !canPump) {
        return;
      }
      this.$emit('change', {
        well: id,
        value: value * mode,
      });
    },
  },
};
