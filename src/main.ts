import Color from 'color';
import { getContext } from './Canvas';
import { floodFill } from './floodfill';
import './styles.css';

const DEFAULT_IMAGES = [
  'too-fab-for-your-bullshit2.jpg',
  'pngtree-adult-unicorn-coloring-pages-picture-image_2903149.jpg',
  'images/FB_IMG_1680813929399.jpg',
  'images/istockphoto-833241952-1024x1024.jpg',
  'images/Get-colouring-page-Hypnotic.webp',
  'images/Get-colouring-page-Checkers.webp',
  'images/Patterns.webp',
  'images/Get-colouring-page-Paisley.gif',
  'images/Get-colouring-page-Cubes.webp',
  'images/Get-colouring-page-Jewels.webp',
];

let pixelIndex = 0;

const randomColor = (): number => 0xff000000 | (Math.random() * 0xffffff);

const DEFAULT_IMAGE_URL = DEFAULT_IMAGES[3];
const BLACK = 0xff000000;
const TRANSPARENT = 0x00000000;
const NUMBER_OF_COLORS = 256;
const COLORS = new Array(NUMBER_OF_COLORS).fill(0).map((_) => randomColor());
let colorIndex = 0;

const getColor = () => {
  colorIndex = (colorIndex + 1) % NUMBER_OF_COLORS;
  return COLORS[colorIndex];
};

const app: HTMLDivElement = document.querySelector<HTMLDivElement>('#app')!;
const img: HTMLImageElement = document.createElement('img');
const menu: HTMLDivElement = document.createElement('div');
menu.id = 'menu';
app.appendChild(menu);

const createSelectImage = () => {
  const selectImage: HTMLSelectElement = document.createElement('select');
  selectImage.id = 'selectImage';

  DEFAULT_IMAGES.forEach((image) => {
    const optionElement: HTMLOptionElement = document.createElement('option');
    optionElement.text = image;
    optionElement.value = image;
    selectImage.options.add(optionElement, null);
  });

  selectImage.addEventListener('change', () => {
    img.src = selectImage.value;
    load();
  });

  return selectImage;
};

let front = false;
let lightnessThreshold = 50;
let video: HTMLVideoElement;

navigator.mediaDevices
  .getUserMedia({
    video: { facingMode: front ? 'user' : 'environment' },
  })
  .then((mediaStream) => {
    video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);
    video.srcObject = mediaStream;

    video.onloadedmetadata = () => {
      video.play();
    };
  })
  .catch((err) => {
    console.error(`${err.name}: ${err.message}`);
  });

menu.appendChild(createSelectImage());
const selectImage = document.getElementById('selectImage')! as HTMLSelectElement;
const switchCameraButton = document.createElement('button');
switchCameraButton.textContent = 'Switch Camera';
switchCameraButton.id = 'flip-button';

switchCameraButton.addEventListener('click', () => {
  front = !front;
  selectImage.value = selectImage.value;
  load();
});

menu.appendChild(switchCameraButton);
const cameraButton = document.createElement('button');
cameraButton.textContent = 'Camera';
cameraButton.id = 'camera';

cameraButton.onclick = () => {
  video.style.display = 'block';

  video.onclick = () => {
    ctx.drawImage(video, 0, 0);
    img.src = canvas.toDataURL('image/png');
    lightnessThreshold = 20;
    video.style.display = 'none';
    load();
  };
};

menu.appendChild(cameraButton);
img.setAttribute('alt', DEFAULT_IMAGE_URL);
img.setAttribute('src', DEFAULT_IMAGE_URL);
const canvas = document.createElement('canvas');
const ctx = getContext(canvas);

const load = () => {
  pixelIndex = 0;
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;

  canvas.addEventListener('click', (e) => {
    const position = { x: e.clientX, y: e.clientY };
    // const filled = floodFill2(imageData, position, randomColor());
    // if (!filled) return;
    // ctx.putImageData(filled.image, 0, 0);
    const filled = floodFill(canvas, position, getColor());
    console.log(filled);
  });

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = new Uint32Array(imageData.data.buffer);

  const pixels = data.map((color: number) =>
    Color(color).lightness() > lightnessThreshold ? TRANSPARENT : BLACK
  );
  ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels.buffer), width, height), 0, 0);

  // false &&
  ctx.fillStyle = 'black';
  pixels.forEach((pixel, i) => {
    if (pixel === BLACK) {
      const x = i % width;
      const y = Math.floor(i / width);
      ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
    }
  });
  app.appendChild(canvas);

  const findFirstWhitePixel = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    const ctx = getContext(canvas);
    const img = ctx.getImageData(0, 0, width, height);
    const data = new Uint32Array(img.data.buffer);
    for (let i = pixelIndex; i < data.length; i++) {
      if (data[i] === TRANSPARENT) {
        pixelIndex = i + 1;
        return { x: i % width, y: Math.floor(i / width) };
      }
    }
    return null;
  };

  const fillArea = () => {
    let whitePixel = findFirstWhitePixel(canvas);
    if (whitePixel) {
      floodFill(canvas, whitePixel, getColor());
      // console.log(filled);
      // if (!filled) return;
      // const outline = MarchingSquares.getBlobOutlinePoints(filled.image.data, width, height);
      // console.log(outline);
      setTimeout(fillArea, 0);
    }
  };

  fillArea();
  img.style.display = 'none';
};

img.addEventListener('load', load);
app.appendChild(img);
