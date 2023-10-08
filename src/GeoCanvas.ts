import { BBox } from './BBox';

export type Point = { x: number; y: number };
export type Points = Point[];

export class GeoCanvas {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  bbox: BBox;

  ctx: CanvasRenderingContext2D;

  #imageData: ImageData | null = null;

  #data: Uint32Array | null = null;

  constructor(width: number, height: number, bbox: BBox, img?: HTMLImageElement) {
    this.canvas = document.createElement('canvas');
    this.width = width;
    this.height = height;
    this.bbox = bbox;
    if (!this.canvas.getContext('2d')) throw new Error('Could not get 2d context');
    this.ctx = this.canvas.getContext('2d')!;
    if (img) this.drawImage(img);
  }

  pixel({ x, y }: Point) {
    const {
      bbox: { left, top, w, h },
      width,
      height,
    } = this;
    return {
      x: Math.floor((x - left) * (width / w)),
      y: Math.floor((top - y) * (height / h)),
    };
  }

  coordinate({ x, y }: Point): Point {
    const {
      bbox: { left, top, w, h },
      width,
      height,
    } = this;
    return {
      x: left + x * (w / width),
      y: top - y * (h / height),
    };
  }

  get imagedata() {
    if (!this.#imageData) {
      const { ctx, width, height } = this;
      this.#imageData = ctx.getImageData(0, 0, width, height);
    }
    return this.#imageData;
  }

  get data() {
    if (!this.#data) {
      this.#data = new Uint32Array(this.imagedata.data.buffer);
    }
    return this.#data;
  }

  set imageData(imageData: ImageData) {
    this.ctx.putImageData(imageData, 0, 0);
  }

  drawImage(imageData: CanvasImageSource) {
    const { ctx, width, height } = this;
    ctx.drawImage(imageData, 0, 0, width, height);
  }

  color = ({ x, y }: { x: number; y: number }) => {
    const { width } = this;
    const data = this.#data;
    if (!data) throw new Error('No data');
    return data[width * y + x];
  };

  points(pixels: Points) {
    const { ctx } = this;
    pixels.forEach(({ x, y }: Point) => ctx.fillRect(x - 5, y - 5, 10, 10));
    return this;
  }

  polygon(corners: Points) {
    const { ctx } = this;
    ctx.beginPath();
    Object.assign(ctx, {
      lineWidth: 5,
      strokeStyle: 'rgba(0, 0, 0, 0.5)',
    });
    corners.forEach(({ x, y }: Point, index: number) => ctx[index === 0 ? 'moveTo' : 'lineTo'](x, y));
    ctx.stroke();
    return this;
  }

  line(points: Points) {
    const { ctx } = this;
    ctx.beginPath();
    Object.assign(ctx, {
      lineWidth: 5,
      strokeStyle: 'rgba(0, 0, 0, 0.5)',
    });
    points.forEach(({ x, y }, i) => ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y));
    ctx.stroke();
    return this;
  }
}
