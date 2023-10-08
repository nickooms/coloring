import Color from 'color';
import { getContext } from './Canvas';
// import { MarchingSquares } from './MarchingSquares';
import { floodFill /* floodFill2 */ } from './floodfill';
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
const randomColor = () => 0xff000000 | (Math.random() * 0xffffff);
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
const selectImage = () => {
  const selectImage = document.createElement('select');
  selectImage.id = 'selectImage';
  DEFAULT_IMAGES.forEach((image) => {
    const optionElement: HTMLOptionElement = document.createElement('option') as HTMLOptionElement;
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

navigator.mediaDevices
  .getUserMedia({
    video: { facingMode: front ? 'user' : 'environment' },
  })
  .then((mediaStream) => {
    const video = document.createElement('video');
    document.body.appendChild(video);
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => {
      video.play();
    };
  })
  .catch((err) => {
    // always check for errors at the end.
    console.error(`${err.name}: ${err.message}`);
  });
app.appendChild(selectImage());
const flipButton = document.createElement('button');
flipButton.textContent = 'Flip';
flipButton.id = 'flip-button';
flipButton.onclick = () => {
  front = !front;
  (document.getElementById('selectImage')! as HTMLSelectElement).value = (
    document.getElementById('selectImage')! as HTMLSelectElement
  ).value;
  load();
};
app.appendChild(flipButton);
img.setAttribute('alt', DEFAULT_IMAGE_URL);
img.setAttribute('src', DEFAULT_IMAGE_URL);
const canvas = document.createElement('canvas');
const ctx = getContext(canvas);
const load = () => {
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
  const pixels = data.map((color: number) => (Color(color).lightness() > 50 ? TRANSPARENT : BLACK));
  ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels.buffer), width, height), 0, 0);
  false &&
    pixels.forEach((pixel, i) => {
      if (pixel === BLACK) {
        const x = i % width;
        const y = Math.floor(i / width);
        ctx.fillStyle = 'black';
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
