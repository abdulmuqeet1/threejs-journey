// *  Custom model with Blender
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
// import loadingManager from '@app/utils/loader';

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const gui = new dat.GUI();
const scene = new THREE.Scene();

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    1000,
);

camera.position.z = 6;
camera.position.y = 2;

// groups

// imported objects
const objGroup = new THREE.Group();

scene.add(objGroup);

// * Loader
// draco loader
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('../utils/draco/');

const gltfLoader = new GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);

// gltfLoader.load('../../assets/models/hamburger.glb', (gltf) => {
//     scene.add(gltf.scene);
// });

// gltfLoader.load('../../assets/models/lantern.glb', (model) => {
//     objGroup.add(model.scene);
//     objGroup.translateY(2);
// });

gltfLoader.load('../../assets/models/cottage.glb', (model) => {
    model.scene.scale.set(0.1, 0.1, 0.1);
    objGroup.add(model.scene);
    // objGroup.translateY();
});

// * mesh
// material
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xff00ff);

const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial();
floorMaterial.color = new THREE.Color(0xffffff);
floorMaterial.roughness = 0.5;
floorMaterial.metalness = 0.65;
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

/**
 * * Lights
 */
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
gui.add(ambientLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.01)
    .name('AL Intensity');
scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
// const DLHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
directionalLight.position.set(2, 3, -4);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.1)
    .name('DL Intensity');

gui.add(directionalLight.position, 'x', -10, 10);

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

// * axis control
const axisHelper = new THREE.AxesHelper(2);
scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

/**
 * * TGA Loader
 */

// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// import {TGALoader} from 'three/examples/jsm/loaders/TGALoader';
// // import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
// import * as dat from 'dat.gui';

// const canvasElement: HTMLElement | null =
//     document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

// const size = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// };

// const gui = new dat.GUI();
// const scene = new THREE.Scene();

// //* camera
// const camera = new THREE.PerspectiveCamera(
//     75,
//     size.width / size.height,
//     0.1,
//     1000,
// );

// camera.position.z = 6;
// camera.position.y = 2;

// // * Loader

// const tgaLoader = new TGALoader();

// tgaLoader.load('../../assets/models/tgaModel/beltdiffusemap.tga', (model) => {
//     // scene.add(gltf.scene);
//     console.log('model loaded, ', model);
// });

// // * mesh
// // material
// const material = new THREE.MeshStandardMaterial();
// material.color = new THREE.Color(0xff00ff);

// const floorGeometry = new THREE.PlaneGeometry(10, 10);
// const floorMaterial = new THREE.MeshStandardMaterial();
// floorMaterial.color = new THREE.Color(0xffffff);
// floorMaterial.roughness = 0.5;
// floorMaterial.metalness = 0.65;
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2;
// scene.add(floor);

// /**
//  * * Lights
//  */
// // ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// gui.add(ambientLight, 'intensity')
//     .min(0)
//     .max(1)
//     .step(0.01)
//     .name('AL Intensity');
// scene.add(ambientLight);

// // directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
// // const DLHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
// directionalLight.position.set(2, 3, -4);
// scene.add(directionalLight);

// gui.add(directionalLight, 'intensity')
//     .min(0)
//     .max(1)
//     .step(0.1)
//     .name('DL Intensity');

// gui.add(directionalLight.position, 'x', -10, 10);

// // * Controls
// const controls = new OrbitControls(camera, canvasElement);
// controls.enableDamping = true;

// // * axis control
// const axisHelper = new THREE.AxesHelper(2);
// scene.add(axisHelper);

// //* renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvasElement,
// });

// /**
//  * Animate
//  */
// const tick = () => {
//     // Update controls
//     controls.update();

//     // Render
//     renderer.setSize(size.width, size.height);
//     renderer.render(scene, camera);

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick);
// };

// tick();
