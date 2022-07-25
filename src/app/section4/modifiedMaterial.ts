// modified material
// lecture# 28

// ! working except for the shadow

// modifying a material
// two ways to do it
// 1. with threejs hooks ==> that let us play with the shaders  and inject our code
// 2. by recreating the material, but following what is done in threejs code

// second option is acceptable but the material can be really complex with includes, extensions, defines
// extensions, defines, uniform etc

import '@styles/main.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import vertexShader from './shaders/animatedGalaxy/vertex.glsl';
import fragmentShader from './shaders/animatedGalaxy/fragment.glsl';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
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
camera.position.x = 15;

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

// depth material
const depthMaterial: THREE.MeshDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
});

interface CustomUniform {
    uTime: {value: number};
}

const customUniform: CustomUniform = {
    uTime: {value: 0},
};

material.onBeforeCompile = (shader: THREE.Shader): void => {
    shader.uniforms.uTime = customUniform.uTime;
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float uTime;

        mat2 rotate2d(float _angle){
            return mat2(cos(_angle),-sin(_angle),
                        sin(_angle),cos(_angle));
        }
        `,
    );
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
                    
        // float angle = (position.y + uTime) * 0.6;
        float angle = (uTime) * 0.6;
        mat2 rotation = rotate2d(angle);
        objectNormal.xz = rotation * objectNormal.xz;
        `,
    );
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            
            // float angle = (position.y + uTime) * 0.6;
            // float angle = (uTime) * 0.6;
            // mat2 rotation = rotate2d(angle);
            transformed.xz = rotation * transformed.xz;
            // vec2 rotatedPosition = rotation * position.xy;
        `,
    );
};

depthMaterial.onBeforeCompile = (shader: THREE.Shader): void => {
    shader.uniforms.uTime = customUniform.uTime;
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float uTime;

        mat2 rotate2d(float _angle){
            return mat2(cos(_angle),-sin(_angle),
                        sin(_angle),cos(_angle));
        }
        `,
    );
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            
            // float angle = (position.y + uTime) * 0.6;
            float angle = (uTime) * 0.6;
            mat2 rotation = rotate2d(angle);
            transformed.xz = rotation * position.xz;
            // vec2 rotatedPosition = rotation * position.xy;
        `,
    );
};

gltfLoader.load(
    '../../assets/models/LeePerrySmith/LeePerrySmith.glb',
    (model): void => {
        const mesh = model.scene.children[0] as THREE.Mesh;
        // rotate model by 90 deg along y-axis
        mesh.rotation.y = Math.PI / 2;

        mesh.material = material;
        mesh.castShadow = true;
        mesh.customDepthMaterial = depthMaterial;

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

// Shadows

// ? Problem
// to handle shadows, threeJS do renders from the lights point of view
// called shadow maps
// when those renders occurs, all the materials are replaced by another set of material( called depth material)
// that kind of material(depth material) doesn't twist

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
renderer.toneMappingExposure = 0.75;
renderer.setSize(screenSize.width, screenSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

    // update shader uTime
    customUniform.uTime.value = elapsedTime;

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
