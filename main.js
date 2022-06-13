import { Scene, PMREMGenerator, sRGBEncoding, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { renderer } from './js/renderer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createLights } from './js/lights';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

let loaded, total;
let modelLoaded, modelTotal = 0;
let exrLoaded, exrTotal = 0;

const scene = new Scene();
const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);

const loader = new GLTFLoader();
// const webFiles = 'https://lnmn.web-files.co/McyBipB95VGmLrDZq51yY.glb';
const fileCoffee = 'https://file.coffee/u/McyBipB95VGmLrDZq51yY.glb';
loader.load(fileCoffee,
  (gltf) => {
    scene.add(gltf.scene);
  }, ({ loaded, total }) => {
    modelLoaded = loaded
    modelTotal = total
  }, alert)

const pmremGenerator = new PMREMGenerator(renderer);
pmremGenerator.compileCubemapShader();

const borderElement = document.getElementsByClassName('border')[0];
const loadingElement = document.getElementById('loading')    
const exrLoader = new EXRLoader();
exrLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/satara_night_no_lamps_1k.exr', 
  (texture) => {
    texture.encoding = sRGBEncoding;
    const pngCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
    const pngBackground = pngCubeRenderTarget.texture;
    texture.dispose();

    scene.background = pngBackground;
  }, ({ loaded, total }) => {
    exrLoaded = loaded;
    exrTotal = total;
  }, alert)

createLights(scene, {
  markers: false,
  color: 0xFFCC7C,
  ambiance: true,
  strength: 1,
  distance: 2,
  cords: [
    [0.82, 0.45, -1.26],
    [1.32, 1.43, -1.46],
    [1.4, 2.18, -2],
    [-0.07, 1.7, 0.32],
    [0.97, 1.33, 2.18],
    [0.71, 0.3, 1.8],
    [2.3, 1.65, 0.57]
  ],
});

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set(0, 0, -10);
controls.update();

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  loaded = exrLoaded + modelLoaded;
  total = exrTotal + modelTotal;
  const percentage = loaded / total * 100;
  loadingElement.style.width = percentage + '%';
  if (percentage === 100) {
    renderer.render(scene, camera);
    loadingElement.style.display = 'none';
    borderElement.style.display = 'none';  
  }
}

animate();

window.addEventListener( 'resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );
