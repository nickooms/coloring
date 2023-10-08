export const getContext: (canvas: HTMLCanvasElement) => CanvasRenderingContext2D = (canvas) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2d context');
  return ctx;
};

export const getImageData: (canvas: HTMLCanvasElement) => ImageData = (canvas) => {
  const { width, height } = canvas;
  const ctx = getContext(canvas);
  return ctx.getImageData(0, 0, width, height);
};

export const fromImage: (img: HTMLImageElement) => HTMLCanvasElement = (img) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = getContext(canvas);
  ctx.drawImage(img, 0, 0);
  return canvas;
};
