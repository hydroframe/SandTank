import { hex2float } from 'vtk.js/Sources/Common/Core/Math';

function normalize(bins) {
  let maxCount = 0;
  for (let i = 0; i < bins.length; i++) {
    if (bins[i] > maxCount) {
      maxCount = bins[i];
    }
  }
  const scale = 255 / maxCount;
  return bins.map((v) => scale * v);
}

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
      type: Uint8Array,
      default: null,
    },
    toColor: {
      type: Function,
      default: null,
    },
    scale: {
      type: Number,
      default: 14,
    },
    water: {
      type: Uint8Array,
      default: null,
    },
    waterOpacity: {
      type: Number,
      default: 0.25,
    },
  },
  watch: {
    size() {
      this.draw();
    },
    data() {
      this.draw();
    },
    water() {
      this.draw();
    },
    waterOpacity() {
      this.draw();
    },
  },
  methods: {
    draw() {
      if (!this.data && !this.water) {
        return;
      }
      const [width, height] = this.size;
      const ctx = this.$el.getContext('2d');
      const bgImage = ctx.createImageData(
        width * this.scale,
        height * this.scale
      );
      const data = bgImage.data;

      if (this.data) {
        const normalizedInput = normalize(this.data);
        data.fill(255);
        for (let j = 0; j < height; j++) {
          for (let i = 0; i < width; i++) {
            const value = normalizedInput[i + j * width];
            const offset =
              4 * (i * this.scale + j * this.scale * width * this.scale);
            for (let dy = 0; dy < this.scale; dy++) {
              for (let dx = 0; dx < this.scale; dx++) {
                const dOffset = 4 * (dx + dy * width * this.scale);
                data[offset + dOffset] = value;
                data[offset + dOffset + 1] = value;
                data[offset + dOffset + 2] = value;
              }
            }
          }
        }
        ctx.putImageData(bgImage, 0, 0);
      }

      if (this.water) {
        data.fill(0);
        const blue = hex2float('#2196F3').map((v) => Math.round(v * 255));
        for (let j = 0; j < height; j++) {
          for (let i = 0; i < width; i++) {
            const value = this.waterOpacity * this.water[i + j * width];
            const offset =
              4 * (i * this.scale + j * this.scale * width * this.scale);
            for (let dy = 0; dy < this.scale; dy++) {
              for (let dx = 0; dx < this.scale; dx++) {
                const dOffset = 4 * (dx + dy * width * this.scale);
                data[offset + dOffset] = blue[0];
                data[offset + dOffset + 1] = blue[1];
                data[offset + dOffset + 2] = blue[2];
                data[offset + dOffset + 3] = value;
              }
            }
          }
        }
        ctx.putImageData(bgImage, 0, 0);
      }
    },
  },
  mounted() {
    this.draw();
  },
};
