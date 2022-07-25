// Post Processing
// lecture# 29

// post processing is about adding effects on the final image and we usually
// use it for filmmaking, but we can do it in webgl too

// depth of field
// Bloom
// God ray
// Motion blur
// Glitch effect
// outlines
// color variations
// anti aliasing
// reflection and refractions etc

import '@styles/main.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import vertexShader from './shaders/animatedGalaxy/vertex.glsl';
import fragmentShader from './shaders/animatedGalaxy/fragment.glsl';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {RGBShiftShader} from 'three/examples/jsm/shaders/RGBShiftShader.js';
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
scene.castShadow = true;
scene.receiveShadow = true;

/**
 * ! Group(s)
 */

const galaxyObjGroup: THREE.Group = new THREE.Group();

scene.add(galaxyObjGroup);

/**
 * ! Loaders
 */
const textureLoader: THREE.TextureLoader = new THREE.TextureLoader(
    loadingManager,
);
// model loader
const gltfLoader: GLTFLoader = new GLTFLoader(loadingManager);

// env map/ background

const cubeTextureLoader: THREE.CubeTextureLoader = new THREE.CubeTextureLoader(
    loadingManager,
);

// man model
const mapTexture = textureLoader.load(
    '../../assets/models/LeePerrySmith/color.jpg',
);
const normalTexture = textureLoader.load(
    '../../assets/models/LeePerrySmith/normal.jpg',
);

// environment map
const envMap = cubeTextureLoader.load([
    '../../assets/textures/textures-anotherOne/environmentMaps/0/px.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/nx.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/py.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/ny.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/pz.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/nz.jpg',
]);

// environment encoding in threejs
// sRGBEncoding
// LinearEncoding

envMap.encoding = THREE.sRGBEncoding;
scene.background = envMap;
scene.environment = envMap;

/**
 * ! Utils
 */

// update All material
const updateAllMaterial = (): void => {
    scene.traverse((child: object): void => {
        if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            child.material.envMapIntensity = 2;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

// axes helper
const axisHelper: THREE.AxesHelper = new THREE.AxesHelper(6);
scene.add(axisHelper);

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
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    screenSize.width / screenSize.height,
    0.1,
    1000,
);
camera.lookAt(0, 0, 0);
camera.position.z = 0;
camera.position.y = 1;
camera.position.x = 4;

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

const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    map: mapTexture,
    normalMap: normalTexture,
});

gltfLoader.load(
    '../../assets/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (model): void => {
        const mesh = model.scene.children[0] as THREE.Mesh;
        mesh.rotation.z = -(Math.PI / 2);
        mesh.castShadow = true;

        scene.add(mesh);

        updateAllMaterial();
    },
);

/**
 * ! Lights
 */

// ambient Light
const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity', 0, 5).step(0.1).name('ALight');

// directional light
const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
    0xffffff,
    1.5,
);
directionalLight.position.set(3, 22, -30);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);
gui.add(directionalLight, 'intensity', 0, 5).step(0.1).name('DLight');

// directional loght helper
const dLightHelper: THREE.DirectionalLightHelper =
    new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

/**
 * ! Renderer
 */
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.setSize(screenSize.width, screenSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * ! Post Processing
 */

// render target
// ? For anti aliasing
// ? https://www.youtube.com/watch?v=pFKalA-fd34

// let RenderTargetClass: any;

// if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2) {
//     RenderTargetClass = THREE.WebGLMultipleRenderTargets;
// } else {
//     RenderTargetClass = THREE.WebGLRenderTarget;
// }

// const renderTarget = new RenderTargetClass(
//     screenSize.width,
//     screenSize.height,
//     {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat,
//         encoding: THREE.sRGBEncoding,
//     },
// );

const renderTargetNew = new THREE.WebGLMultipleRenderTargets(
    screenSize.width,
    screenSize.height,
    2,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding,
    },
);

const renderTarget = new THREE.WebGLRenderTarget(
    screenSize.width,
    screenSize.height,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding,
    },
);

// effect composer
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setSize(screenSize.width, screenSize.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// passes
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(screenSize.width, screenSize.height),
    0.32,
    1,
    0.5,
);
unrealBloomPass.enabled = false;
effectComposer.addPass(unrealBloomPass);

// for anti aliasing
// also try dif pass like TSA, SSA
// if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
//     const smaaPass = new SMAAPass(screenSize.width, screenSize.height);
//     effectComposer.addPass(smaaPass);
// }

const smaaPass = new SMAAPass(screenSize.width, screenSize.height);
effectComposer.addPass(smaaPass);

// ! important Note
// ==>  if pixel ratio is above 1, we use the webGLRenderTarget and no
//      antialias pass
// ==>  if the pixel ratio is 1 and browser supports webGl2, we use a WebGLMultisampleRenderTarget
// ==>  if the pixel ratio is 1 and browser doesnt supports webGl2,
//      we use a WebGLRenderTarget and enable the SMAAPass(or any other anti aliasing pass)

// console.log('pixel ratio: ', window.devicePixelRatio);
// console.log('pixel ratio: ', renderer.getPixelRatio());
// console.log('capabilities: ', renderer.capabilities);

// * creating our own Pass

// 1st pass: Tint Pass
const tintShader = {
    uniform: {
        tDiffuse: {value: null},
        uTint: {value: new THREE.Vector3(0.1, 0.41, 1)},
    },
    vertexShader: `
    varying vec2 vuv;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vuv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse; 
    uniform vec3 uTint;
    varying vec2 vuv;


    void main() {
        vec4 color = texture2D(tDiffuse, vuv);
        color.rgb += uTint;

        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        gl_FragColor = color;
    }
    `,
};
const tintPass = new ShaderPass(tintShader);
// tintPass.material.uniforms.uTint.value = new THREE.Vector3();
tintPass.enabled = false;
effectComposer.addPass(tintPass);

// gui.add(tintPass.material.uniforms.uTint.value, 'x', -1, 1, 0.01).name('x');
// gui.add(tintPass.material.uniforms.uTint.value, 'y', -1, 1, 0.01).name('y');
// gui.add(tintPass.material.uniforms.uTint.value, 'z', -1, 1, 0.01).name('z');

// 2nd pass => displacement pass
const displacementShader = {
    uniform: {
        tDiffuse: {value: null},
        uTint: {value: new THREE.Vector3(0.1, 0.41, 1)},
    },
    vertexShader: `
    varying vec2 vuv;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vuv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse; 
    uniform vec3 uTint;
    varying vec2 vuv;


    void main() {
        vec2 newUv = vec2(
            vuv.x, 
            vuv.y + sin(vuv.x * 10.0) * 0.1
        );
        // vec4 color = texture2D(tDiffuse, newUv);
        
        vec4 color = texture2D(tDiffuse, vuv);
        gl_FragColor = color;
    }
    `,
};
const displacementPass = new ShaderPass(displacementShader);
// tintPass.material.uniforms.uTint.value = new THREE.Vector3();
tintPass.enabled = false;
effectComposer.addPass(displacementPass);

/**
 * ! Animation
 */
const clock: THREE.Clock = new THREE.Clock();

const animate = () => {
    // callback animate again on the next frame
    requestAnimationFrame(animate);

    // dont use big value for time like Date.now()
    // instead use elapsed time
    const elapsedTime = clock.getElapsedTime();

    // update controls
    controls.update();

    // stats
    stats.begin();

    stats.end();

    // Render
    // renderer.setSize(screenSize.width, screenSize.height);
    // renderer.render(scene, camera);
    effectComposer.render();
};

animate();
