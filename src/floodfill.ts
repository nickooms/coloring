/* eslint-disable no-param-reassign, consistent-return */
import { Point } from './GeoCanvas';
import { getContext } from './Canvas';

const DX = [0, -1, 1, 0];
const DY = [-1, 0, 0, 1];

export function floodFill2(img: ImageData, { x, y }: Point, color: number) {
  const { width: w, height: h } = img;
  // const ctx = getContext(canvas);
  // const img = ctx.getImageData(0, 0, w, h);
  const { data } = img;
  const data32 = new Uint32Array(data.buffer);
  const oldColor = data32[x + y * w];
  if (oldColor === color) return;
  const fillCanvas = document.createElement('canvas');
  fillCanvas.width = w;
  fillCanvas.height = h;
  const fillCtx = getContext(fillCanvas);
  const fill = fillCtx.getImageData(0, 0, w, h);
  const fillData = new Uint32Array(fill.data.buffer);
  let minX = x;
  let maxX = x;
  let minY = y;
  let maxY = y;
  const stack = [x, y];
  while (stack.length > 0) {
    const curY = stack.pop() ?? 0;
    const curX = stack.pop() ?? 0;
    for (let i = 0; i < 4; i++) {
      const nextX = curX + DX[i];
      const nextY = curY + DY[i];
      if (nextX < 0 || nextY < 0 || nextX >= w || nextY >= h) continue;
      const offset = nextY * w + nextX;
      if (data32[offset] === oldColor) {
        data32[offset] = color;
        fillData[offset] = color;
        minX = Math.min(minX, nextX);
        maxX = Math.max(maxX, nextX);
        minY = Math.min(minY, nextY);
        maxY = Math.max(maxY, nextY);
        stack.push(nextX, nextY);
      }
    }
  }
  // ctx.putImageData(img, 0, 0);
  return {
    img,
    image: fill,
    fillCanvas,
    x: minX,
    y: minY,
    w: 1 + (maxX - minX),
    h: 1 + (maxY - minY),
  };
}

export function floodFill(canvas: HTMLCanvasElement, { x, y }: Point, color: number, pixelIndex?: number) {
  const { width: w, height: h } = canvas;
  const ctx = getContext(canvas);
  const img = ctx.getImageData(0, 0, w, h);
  const { data } = img;
  const data32 = new Uint32Array(data.buffer);
  if (pixelIndex) {
    const findFirstWhitePixel = () => {
      for (let i = pixelIndex!; i < data32.length; i++) {
        if (data32[i] === 0x00000000) {
          const x = i % w;
          const y = Math.floor(i / w);
          // console.log({ x, y });
          pixelIndex = i + 1;
          return { x, y, pixelIndex };
        }
      }
      return null;
    };
    const whitePixel = findFirstWhitePixel();
    if (whitePixel) {
      x = whitePixel.x;
      y = whitePixel.y;
      pixelIndex = whitePixel.pixelIndex;
    } else {
      return null;
    }
  }
  const oldColor = data32[x + y * w];
  if (oldColor === color) return;
  const fillCanvas = document.createElement('canvas');
  fillCanvas.width = w;
  fillCanvas.height = h;
  const fillCtx = getContext(fillCanvas);
  const fill = fillCtx.getImageData(0, 0, w, h);
  const fillData = new Uint32Array(fill.data.buffer);
  let minX = x;
  let maxX = x;
  let minY = y;
  let maxY = y;
  const stack = [x, y];
  while (stack.length > 0) {
    const curY = stack.pop() ?? 0;
    const curX = stack.pop() ?? 0;
    for (let i = 0; i < 4; i++) {
      const nextX = curX + DX[i];
      const nextY = curY + DY[i];
      if (nextX < 0 || nextY < 0 || nextX >= w || nextY >= h) continue;
      const offset = nextY * w + nextX;
      if (data32[offset] === oldColor) {
        data32[offset] = color;
        fillData[offset] = color;
        minX = Math.min(minX, nextX);
        maxX = Math.max(maxX, nextX);
        minY = Math.min(minY, nextY);
        maxY = Math.max(maxY, nextY);
        stack.push(nextX, nextY);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return {
    image: fill,
    fillCanvas,
    x: minX,
    y: minY,
    w: 1 + (maxX - minX),
    h: 1 + (maxY - minY),
    pixelIndex,
  };
}
