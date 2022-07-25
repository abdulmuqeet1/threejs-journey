import '@styles/main.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import vertexShader from './shaders/vertex.glsl';
import waterFragShader from './shaders/waterFrag.glsl';
// import fogShader from './shaders/waterFrag.glsl';
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

// fog
const fog = new THREE.Fog(0x000030, 0.1, 100);
scene.fog = fog;

/**
 * ! Group(s)
 */

/**
 * ! Loaders
 */
// const textureLoader = new THREE.TextureLoader(loadingManager);
// const flagTexture = textureLoader.load(
//     '../../assets/textures/pakistan-flag2.jpg',
// );

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

const debugObj = {
    depthColor: '#000030',
    surfaceColor: '#2148dd',
    seaColorOffset: 0.0,
    seaColorMultiplier: 1.0,
};

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
camera.position.z = 2.5;
camera.position.y = 1.5;

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
const waterGeometry = new THREE.PlaneBufferGeometry(20, 20, 1280, 1280);

// * material
const waterMaterial = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['fog'],
        {
            uTime: {value: 0.0},
            uWaveFrequency: {value: new THREE.Vector2(1.0, 3.0)},
            uWaveElevation: {value: 0.2},
            uDepthColor: {value: new THREE.Color(debugObj.depthColor)},
            uSurfaceColor: {value: new THREE.Color(debugObj.surfaceColor)},
            uSeaColorOffset: {value: debugObj.seaColorOffset},
            uSeaColorMultiplier: {value: debugObj.seaColorMultiplier},
        },
    ]),
    // uniforms: {
    //     uTime: {value: 0.0},
    //     uWaveFrequency: {value: new THREE.Vector2(1.0, 3.0)},
    //     uWaveElevation: {value: 0.2},
    //     uDepthColor: {value: new THREE.Color(debugObj.depthColor)},
    //     uSurfaceColor: {value: new THREE.Color(debugObj.surfaceColor)},
    //     uSeaColorOffset: {value: debugObj.seaColorOffset},
    //     uSeaColorMultiplier: {value: debugObj.seaColorMultiplier},
    // },
    vertexShader: vertexShader,
    fragmentShader: waterFragShader,
});

gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'x', 0.0, 10.0)
    .step(1.0)
    .name('x wave frequency');
gui.add(waterMaterial.uniforms.uWaveFrequency.value, 'y', 0.0, 10.0)
    .step(1.0)
    .name('z wave frequency');
gui.add(waterMaterial.uniforms.uWaveElevation, 'value', 0.0, 2.0)
    .step(0.01)
    .name('wave elevation');
gui.addColor(debugObj, 'depthColor')
    .name('depth color')
    .onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObj.depthColor);
    });
gui.addColor(debugObj, 'surfaceColor')
    .name('surface color')
    .onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor);
    });
// gui.add(waterMaterial.uniforms.uSeaColorOffset, 'value', 0.0, 1.0)
//     .step(0.01)
//     .name('sea color offset');
// gui.add(waterMaterial.uniforms.uSeaColorMultiplier, 'value', 0.0, 2.0)
//     .step(0.01)
//     .name('sea color multiplier');

waterMaterial.side = THREE.DoubleSide;

const water = new THREE.Mesh(waterGeometry, waterMaterial);

water.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

scene.add(water);

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

    waterMaterial.uniforms.uTime.value = elapsedTime;

    // update controls
    controls.update();

    // update material/uniforms
    // material.uniforms.uTime.value = elapsedTime;

    // stats
    stats.begin();

    stats.end();

    // Render
    renderer.setSize(screenSize.width, screenSize.height);
    renderer.render(scene, camera);
};

animate();
