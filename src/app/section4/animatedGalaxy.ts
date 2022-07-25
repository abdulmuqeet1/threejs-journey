import '@styles/main.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import vertexShader from './shaders/animatedGalaxy/vertex.glsl';
import fragmentShader from './shaders/animatedGalaxy/fragment.glsl';
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

const galaxyObjGroup = new THREE.Group();

scene.add(galaxyObjGroup);

/**
 * ! Loaders
 */
const textureLoader = new THREE.TextureLoader(loadingManager);

const galaxyStarMaterial = textureLoader.load(
    '../../assets/textures/particles/11.png',
);

const rStarMaterial = textureLoader.load(
    '../../assets/textures/particles/8.png',
);
/**
 * ! Utils
 */

// axes helper
const axisHelper = new THREE.AxesHelper(2);
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
camera.position.z = 12;
camera.position.y = 12;

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

// galaxy generator
interface Params {
    count: number;
    size: number;
    radius: number;
    branches: number;
    spinMotion: number;
    randomNess: number;
    randomNessPower: number;
    baseColor: THREE.Color;
    insideColor: THREE.Color;
    outsideColor: THREE.Color;
}

const params: Params = {
    count: 100000,
    size: 20,
    radius: 12,
    branches: 3,
    spinMotion: 0.55,
    randomNess: 5,
    randomNessPower: 2,
    baseColor: new THREE.Color(0xfa8c8c),
    insideColor: new THREE.Color('pink'),
    outsideColor: new THREE.Color(0x0e3755),
};

let galaxyGeometry: THREE.BufferGeometry;
let particlesMaterial: THREE.ShaderMaterial;
let points: THREE.Points;

const generateGalaxy = (): void => {
    galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);
    const randomScales = new Float32Array(params.count * 1);
    // const randomness = new Float32Array(params.count * 3);

    const insideColors = new THREE.Color(params.insideColor);
    const outsideColors = new THREE.Color(params.outsideColor);

    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        // position
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spinMotion;
        const branchAngle =
            ((i % params.branches) / params.branches) * Math.PI * 2;

        const randomX =
            Math.pow(Math.random(), params.randomNessPower) *
            (Math.random() < 0.5 ? -1 : 1);
        const randomY =
            Math.pow(Math.random(), params.randomNessPower) *
            (Math.random() < 0.5 ? -1 : 1);
        const randomZ =
            Math.pow(Math.random(), params.randomNessPower) *
            (Math.random() < 0.5 ? -1 : 1);

        // positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        // positions[i3 + 1] = randomY;
        // positions[i3 + 2] =
        //     Math.sin(branchAngle + spinAngle) * radius + randomZ;
        positions[i3] = Math.cos(branchAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;

        // particles randomness
        // randomness[i3] = randomX;
        // randomness[i3 + 1] = randomY;
        // randomness[i3 + 2] = randomZ;

        // color
        const mixedColor = insideColors.clone();
        mixedColor.lerp(outsideColors, radius / params.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        randomScales[i] = Math.random();
    }

    galaxyGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
    );
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute(
        'aScale',
        new THREE.BufferAttribute(randomScales, 1),
    );
    // galaxyGeometry.setAttribute(
    //     'randomness',
    //     new THREE.BufferAttribute(randomness, 1),
    // );

    particlesMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: {value: 0},
            uSize: {value: params.size * renderer.getPixelRatio()},
            // uBaseColor: {value: params.baseColor},
            // uInsideColor: {value: params.insideColor},
            // uOutsideColor: {value: params.outsideColor},
        },
    });

    // Points
    points = new THREE.Points(galaxyGeometry, particlesMaterial);

    galaxyObjGroup.add(points);
};

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

// generate Galaxy
generateGalaxy();

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
    particlesMaterial.uniforms.uTime.value = elapsedTime;

    // stats
    stats.begin();

    stats.end();

    // Render
    renderer.setSize(screenSize.width, screenSize.height);
    renderer.render(scene, camera);
};

animate();
