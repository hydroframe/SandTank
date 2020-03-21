import clay from 'parflow-web/src/assets/clay.jpg';
import gravel from 'parflow-web/src/assets/gravel.jpg';
import loam from 'parflow-web/src/assets/loam.jpg';
import sand from 'parflow-web/src/assets/sand.jpg';

const TEXTURES = {
  clay: new Image(),
  gravel: new Image(),
  loam: new Image(),
  sand: new Image(),
};

TEXTURES.clay.src = clay;
TEXTURES.gravel.src = gravel;
TEXTURES.loam.src = loam;
TEXTURES.sand.src = sand;

export default {
  name: 'MaterialLayer',
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
    indicatorMask: {
      type: Uint8Array,
      default: null,
    },
    texture: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: '#ccc',
    },
    indicatorValue: {
      type: Number,
      default: 1,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    mask: {
      type: Object,
      default: null,
    },
  },
  watch: {
    scale() {
      this.$nextTick(this.draw);
    },
    size() {
      this.$nextTick(this.draw);
    },
    indicatorMask() {
      this.$nextTick(this.draw);
    },
    texture() {
      this.$nextTick(this.draw);
    },
    color() {
      this.$nextTick(this.draw);
    },
    indicatorValue() {
      this.$nextTick(this.draw);
    },
    mask() {
      this.$nextTick(this.draw);
    },
  },
  methods: {
    draw() {
      if (!this.$el) {
        return;
      }
      const [width, height] = this.size;
      const ctx = this.$el.getContext('2d');

      // Fill canvas with color
      if (this.color) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, width * this.scale, height * this.scale);
      }

      // Fill canvas with texture
      if (this.texture) {
        const texture = TEXTURES[this.texture];
        const textureWidth = texture.width;
        const textureHeight = texture.height;

        const nx = Math.ceil((width * this.scale) / textureWidth);
        const ny = Math.ceil((height * this.scale) / textureHeight);
        for (let x = 0; x < nx; x++) {
          for (let y = 0; y < ny; y++) {
            ctx.drawImage(texture, x * textureWidth, y * textureHeight);
          }
        }
      }

      // Extract canvas to apply mask
      const bgImage = ctx.getImageData(
        0,
        0,
        width * this.scale,
        height * this.scale
      );

      if (this.indicatorMask) {
        for (let j = 0; j < height; j++) {
          for (let i = 0; i < width; i++) {
            const alpha =
              this.indicatorMask[i + j * width] === this.indicatorValue
                ? 255
                : 0;
            const offset =
              4 * (i * this.scale + j * this.scale * width * this.scale);
            for (let dy = 0; dy < this.scale; dy++) {
              for (let dx = 0; dx < this.scale; dx++) {
                const dOffset = 4 * (dx + dy * width * this.scale);
                bgImage.data[offset + dOffset + 3] = alpha;
              }
            }
          }
        }
        ctx.putImageData(bgImage, 0, 0);
      }

      // Solid mask cutoff
      if (this.mask) {
        const { scale, array } = this.mask;
        const fullWidth = width * this.scale;
        const fullHeight = height * this.scale;
        for (let j = 0; j < fullHeight; j++) {
          const jSrc = Math.floor((j / fullHeight) * height * scale);
          for (let i = 0; i < fullWidth; i++) {
            const iSrc = Math.floor((i / fullWidth) * width * scale);
            const idxSrc = iSrc + jSrc * width * scale;
            if (array[idxSrc] === 0) {
              bgImage.data[4 * (i + j * fullWidth) + 3] = 0;
            }
          }
        }
        ctx.putImageData(bgImage, 0, 0);
      }
    },
  },
  mounted() {
    this.draw();
    const drawClosure = () => this.draw();
    Object.values(TEXTURES).forEach((img) => {
      img.onload = drawClosure;
    });
  },
};
