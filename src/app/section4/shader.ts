import '@styles/main.scss';
// * Shaders
// lecture # 24 --> bruno simon course
// https://www.youtube.com/watch?v=9WW5-0N1DsI --> Freya Holmer

// * Freya Holmer

// one of the main component of webGL is shaders
// shaders are small programs that run on the GPU
// they are written in GLSL (OpenGL Shading Language)
// GLSL is a subset of C++/C

// enter data(mesh, colors ) ==> process (Math) ==> spits out color

// shaders are like scripts which you attach to your game objects/ 3D model
// (instance of the script) along with parameters

// mesh + Material(params) = shader
// mesh ==> all the topology of the 3D model
// Material(params) ==> all the parameters of the shader

// Types
// 1. vertex shader
// 2. fragment shader

// vertex shader ==>  the input to the vertex shader is the position of the vertex,
// it gets mesh and precision of each vertex

// vertex loc is in the mesh space(not world space)
// (0, 0) might not be the (0, 0) of the world

// local space vertices/ vertices position ==> convert into (using some helper function) ==> clip space coords (world space)
// ! what is clip space?

// for simple shader, all you need is the vertex shader

// fragment shader ==>  instead of clipping/converting the vertices into clip space
//                      you convert each pixel into clip space

// instead of projecting vertices into pixel, fragment shader converts
//  vertices data into fragment which then corresponds to the pixel

// data into fragment shader ==> (magic) ==> color

// ? start from 1:35:00 --> Normals

// * bruno simon

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

interface ScreenSize {
    width: number;
    height: number;
}

const screenSize: ScreenSize = {
    width: window.innerWidth ?? 720,
    height: window.innerHeight ?? 480,
};

/**
 * ! Scene
 */
const scene: THREE.Scene = new THREE.Scene();

/**
 * ! Group(s)
 */

/**
 * ! Loaders
 */
const textureLoader = new THREE.TextureLoader(loadingManager);
const flagTexture = textureLoader.load(
    '../../assets/textures/pakistan-flag2.jpg',
);

/**
 * ! Utils
 */

// axes helper
const axisHelper = new THREE.AxesHelper(2);
// scene.add(axisHelper);

/**
 * ! Dat GUI
 */
const gui = new dat.GUI();

/**
 * ! Camera
 */

// Perspective Camera
const camera = new THREE.PerspectiveCamera(
    75,
    screenSize.width / screenSize.height,
    0.1,
    1000,
);
camera.lookAt(0, 0, 0);
camera.position.z = 3;
camera.position.y = 1;

/**
 * ! Orbit Controls
 */
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);

/**
 * ! Geometries / Shapes
 */

// geometry
const geometry = new THREE.PlaneBufferGeometry(1.5, 1, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// material

const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    uniforms: {
        uFrequency: {value: new THREE.Vector2(6, 2)},
        uTime: {value: 0},
        uColor: {value: new THREE.Vector3(1, 0, 0.5)},
        uTexture: {value: flagTexture},
    },
});
gui.add(material.uniforms.uFrequency.value, 'x', 0, 100)
    .step(1)
    .name('x frequency');
gui.add(material.uniforms.uFrequency.value, 'y', 0, 100)
    .step(1)
    .name('y frequency');

material.side = THREE.DoubleSide;

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

/**
 * ! Lights
 */

// ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity', 0, 15).step(0.1).name('ALight');

/**
 * ! Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 0.8;
// renderer.setSize(screenSize.width, screenSize.height);
// renderer.render(scene, camera);

/**
 * ! Animation
 */

const clock = new THREE.Clock();

const animate = () => {
    // callback animate again on the next frame
    requestAnimationFrame(animate);

    // dont use big value for time like Date.now()
    // instead use elapsed time
    const elapsedTime = clock.getElapsedTime();

    // update controls
    controls.update();

    // update material/uniforms
    material.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.setSize(screenSize.width, screenSize.height);
    renderer.render(scene, camera);
};

animate();
