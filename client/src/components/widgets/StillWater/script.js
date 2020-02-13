export default {
  name: 'StillWater',
  props: {
    size: {
      type: Array,
      default() {
        return [10, 10];
      },
    },
    scale: {
      type: Number,
      default: 600,
    },
    pressures: {
      type: Array,
      default() {
        return [];
      },
    },
    opacity: {
      type: Number,
      default: 1,
    },
    water: {
      type: String,
      default: '#03A9F4',
    },
    offset: {
      type: Number,
      default: 20,
    },
  },
  computed: {
    width() {
      return this.size[0];
    },
    height() {
      return this.size[1];
    },
  },
};
