import '@styles/main.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';
import Stats from 'stats.js';

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
// const textureLoader = new THREE.TextureLoader(loadingManager);

/**
 * ! Utils
 */

// axes helper
// const axisHelper = new THREE.AxesHelper(2);
// scene.add(axisHelper);

// stats
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * ! Dat GUI
 */
const gui = new dat.GUI();

const debugObj = {};

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
camera.position.z = 8;

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

const plane = new THREE.PlaneBufferGeometry(12, 10, 64, 32);

const count = plane.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
}

plane.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// material

const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // transparent: true,
    uniforms: {
        uTime: {value: 0},
    },
});

material.side = THREE.DoubleSide;

const mesh = new THREE.Mesh(plane, material);

scene.add(mesh);
/**
 * ! Lights
 */

// // ambient Light
// const ambientLight = new THREE.AmbientLight(0xffffff, 4);
// scene.add(ambientLight);
// gui.add(ambientLight, 'intensity', 0, 15).step(0.1).name('ALight');

/**
 * ! Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

    // update shader time
    material.uniforms.uTime.value = elapsedTime;

    // update controls
    controls.update();

    // stats
    stats.begin();

    stats.end();

    // Render
    renderer.setSize(screenSize.width, screenSize.height);
    renderer.render(scene, camera);
};

animate();
