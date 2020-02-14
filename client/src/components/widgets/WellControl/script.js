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
    autoHide: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    autoHide(v) {
      if (!v && !this.isInside) {
        this.isInside = true;
      }
      if (v) {
        this.isInside = false;
      }
    },
  },
  data() {
    return {
      isInside: !this.autoHide,
    };
  },
  computed: {
    containerStyle() {
      return {
        zIndex: this.isInside ? 10 : 0,
      };
    },
    buttonStyle() {
      return {
        opacity: this.isInside ? 1 : 0,
      };
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
      if (mode < 0 && !canPump && value <= 0) {
        return;
      }
      this.$emit('change', {
        well: id,
        value: mode ? value + delta * mode : 0,
      });
    },
    onEnter() {
      this.isInside = true;
    },
    onLeave() {
      this.isInside = !this.autoHide;
    },
  },
};
