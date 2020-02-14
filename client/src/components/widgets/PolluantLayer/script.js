export default {
  name: 'PolluantLayer',
  props: {
    scale: {
      type: Number,
      default: 14,
    },
    size: {
      type: Array,
      default() {
        return [10, 10];
      },
    },
    concentration: {
      type: Float32Array,
      default: null,
    },
    maxConcentration: {
      type: Number,
      default: 1,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      default: '#1DE9B6',
    },
  },
  watch: {
    scale() {
      this.$nextTick(this.draw);
    },
    size() {
      this.$nextTick(this.draw);
    },
    concentration() {
      this.$nextTick(this.draw);
    },
    maxConcentration() {
      this.$nextTick(this.draw);
    },
    opacity() {
      this.$nextTick(this.draw);
    },
  },
  methods: {
    draw() {
      const [width, height] = this.size;
      const ctx = this.$el.getContext('2d');

      if (!this.concentration) {
        ctx.clearRect(0, 0, width * this.scale, height * this.scale);
        return;
      }

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, width * this.scale, height * this.scale);

      // Extract canvas to apply water saturation
      const bgImage = ctx.getImageData(
        0,
        0,
        width * this.scale,
        height * this.scale
      );

      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          const alpha =
            (255 * this.concentration[i + j * width]) / this.maxConcentration;
          const offset =
            4 * (i * this.scale + j * this.scale * width * this.scale);
          for (let dy = 0; dy < this.scale; dy++) {
            for (let dx = 0; dx < this.scale; dx++) {
              const dOffset = 4 * (dx + dy * width * this.scale);
              bgImage.data[offset + dOffset + 3] = alpha * this.opacity;
            }
          }
        }
      }
      ctx.putImageData(bgImage, 0, 0);
    },
  },
  mounted() {
    this.draw();
  },
};
