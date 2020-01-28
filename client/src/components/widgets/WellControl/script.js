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
    delta: {
      type: Number,
      default: 5,
    },
    value: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: null,
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
      const { id, delta, value, canPump } = this;
      if (mode > 0 && !canPump) {
        return;
      }
      this.$emit('change', {
        well: id,
        value: mode ? value + delta * mode : 0,
      });
    },
  },
};
