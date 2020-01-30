export default {
  name: 'VerticalSlider',
  props: {
    position: {
      type: String,
      default: 'left',
    },
    scale: {
      type: Number,
      default: 14,
    },
    domainSize: {
      type: Array,
      default() {
        return [10, 10];
      },
    },
    maxHeight: {
      type: Number,
      default: 14,
    },
    value: {
      type: Number,
      default: 30,
    },
    width: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      height: this.value,
      containerBounds: null,
      dragging: false,
    };
  },
  watch: {
    value(v) {
      this.height = Number(v);
    },
  },
  computed: {
    containerStyle() {
      const height = `${this.maxHeight * this.scale}px`;
      return {
        width: `${this.width}px`,
        height,
        minHeight: height,
        maxHeight: height,
      };
    },
    waterStyle() {
      const height = `${this.height * this.scale}px`;
      return {
        height,
      };
    },
  },
  methods: {
    onMouseDown(e) {
      this.dragging = true;
      this.onMouseMove(e);
    },
    onMouseUp() {
      this.dragging = false;
      this.$emit('input', this.height);
    },
    onMouseMove(e) {
      if (this.dragging) {
        const { top, height } = this.containerBounds;
        const eY = e.clientY;
        this.height = (height - (eY - top)) / this.scale;
      }
    },
    onMouseEnter() {
      this.containerBounds = this.$el.getBoundingClientRect();
    },
  },
  mounted() {
    this.containerBounds = this.$el.getBoundingClientRect();
  },
};
