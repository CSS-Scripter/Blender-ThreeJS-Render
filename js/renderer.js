import { WebGLRenderer, sRGBEncoding, ACESFilmicToneMapping } from 'three';

const renderer = new WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;

document.body.appendChild(renderer.domElement);

export { renderer }