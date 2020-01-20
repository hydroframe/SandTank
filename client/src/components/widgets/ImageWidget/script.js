export default {
  name: 'ImageWidget',
  props: {
    size: {
      type: Array,
      default() {
        return [10, 10];
      },
    },
    data: {
      type: [Array, Uint8Array, Float32Array],
      default: null,
    },
    toColor: {
      type: Function,
      default: null,
    },
  },
  watch: {
    size() {
      this.draw();
    },
    data() {
      this.draw();
    },
    toColor() {
      this.draw();
    },
  },
  methods: {
    draw() {
      console.log(this.$el);
    },
  },
  mounted() {
    this.draw();
  },
};
