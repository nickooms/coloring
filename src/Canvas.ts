const CONTEXT_ID_éD = '2d' as const;

const GET_CONTEXT_OPTIONS: CanvasRenderingContext2DSettings = {
  alpha: true,
  willReadFrequently: true,
};

export const getContext: (
  canvas: HTMLCanvasElement,
  options?: CanvasRenderingContext2DSettings
) => CanvasRenderingContext2D = (canvas, options = GET_CONTEXT_OPTIONS) => {
  const context = canvas.getContext(CONTEXT_ID_éD, options);

  if (!context) {
    throw new Error('Could not get 2d context');
  }

  return context;
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
