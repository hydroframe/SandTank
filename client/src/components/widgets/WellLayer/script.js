export default {
  name: 'WellLayer',
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
    wells: {
      type: Array,
      default() {
        return [];
      },
    },
    opacity: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      default: '#333',
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
