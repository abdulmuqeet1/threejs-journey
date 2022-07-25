import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';

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
// model object
const Dagger = new THREE.Group();
Dagger.position.set(0, 0, 0);
scene.add(Dagger);

/**
 * ! Loaders
 */
// texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

// gltf loader
const gltfLoader = new GLTFLoader(loadingManager);

gltfLoader.load(
    '../../assets/models/kama-dagger-3d-model/scene.gltf',
    (model) => {
        // console.log('dagger model loaded', model);
        model.scene.scale.set(0.01, 0.01, 0.01);
        Dagger.add(model.scene);
    },
);

// cube texture/ Env Map
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const background = cubeTextureLoader.load([
    '../../assets/textures/textures-anotherOne/environmentMaps/3/px.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/3/nx.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/3/py.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/3/ny.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/3/pz.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/3/nz.jpg',
]);
// const background = cubeTextureLoader.load([
//     '../../assets/textures/physicsEnvMaps/3/px.png',
//     '../../assets/textures/physicsEnvMaps/3/nx.png',
//     '../../assets/textures/physicsEnvMaps/3/py.png',
//     '../../assets/textures/physicsEnvMaps/3/ny.png',
//     '../../assets/textures/physicsEnvMaps/3/pz.png',
//     '../../assets/textures/physicsEnvMaps/3/nz.png',
// ]);

background.encoding = THREE.sRGBEncoding;
scene.background = background;

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

const debugObj = {
    DLX: 2,
    DLY: 2,
    DLZ: 3,
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

// circle function
type Material = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
const createSphere = (
    radius: number,
    widthSegments: number,
    heightSegments: number,
    material?: Material,
) => {
    const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments,
    );
    if (material) {
        return new THREE.Mesh(geometry, material);
    }
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.75,
        roughness: 0.45,
    });
    return new THREE.Mesh(geometry, sphereMaterial);
};

/**
 * ! Lights
 */

// ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity', 0, 15).step(0.1).name('ALight');

// directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.target = Dagger;
directionalLight.position.set(debugObj.DLX, debugObj.DLY, debugObj.DLZ);

// directional Light Helper
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//     directionalLight,
//     1,
// );
scene.add(directionalLight);

// gui.add(debugObj, 'DLX', -10, 10)
//     .step(0.1)
//     .name('DLX')
//     .onChange((value) => {
//         directionalLight.position.x = value;
//     });
// gui.add(debugObj, 'DLY', -10, 10)
//     .step(0.1)
//     .name('DLY')
//     .onChange((value) => {
//         directionalLight.position.y = value;
//     });
// gui.add(debugObj, 'DLZ', -10, 10)
//     .step(0.1)
//     .name('DLZ')
//     .onChange((value) => {
//         directionalLight.position.z = value;
//     });

/**
 * ! Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

gui.add(renderer, 'toneMappingExposure', 0, 2)
    .step(0.01)
    .name('ToneMappingExposure');

gui.add(renderer, 'toneMapping', {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})
    .name('ToneMapping')
    .onChange(() => {
        renderer.toneMapping = Number(renderer.toneMapping);
        console.log(Number(renderer.toneMapping));
    });

/**
 * ! Animation
 */

// const clock = new THREE.Clock();

const animate = () => {
    // callback animate again on the next frame
    requestAnimationFrame(animate);

    // update controls
    controls.update();

    // Render
    renderer.setSize(screenSize.width, screenSize.height);
    renderer.render(scene, camera);
};

animate();
