export class BBox {
  left: number;

  top: number;

  w: number;

  h: number;

  constructor(left: number, top: number, w: number, h: number) {
    this.left = left;
    this.top = top;
    this.w = w;
    this.h = h;
  }

  get right() {
    return this.left + this.w;
  }

  get bottom() {
    return this.top - this.h;
  }

  get center() {
    return {
      x: this.left + this.w / 2,
      y: this.top - this.h / 2,
    };
  }
}
