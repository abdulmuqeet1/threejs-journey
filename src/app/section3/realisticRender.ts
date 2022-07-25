// *  Custom model with Blender
// lecture 23

// default threejs values are based on arbitraty scale unit and dont reflect real-world scale/unit system
// its better to base our scene on realistic and standard values

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const gui = new dat.GUI();
const debugObj = {
    envMapIntensity: 1.5,
};

const scene = new THREE.Scene();

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    1000,
);

camera.position.z = 4;
camera.position.y = 1;

// * update all material
const updateAllMaterial = () => {
    scene.traverse((child: any) => {
        if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            child.material.envMap = environmentMap;
            child.material.envMapIntensity = debugObj.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    return;
};

gui.add(debugObj, 'envMapIntensity', 0, 10, 0.1)
    .name('envMap intensity')
    .onChange(updateAllMaterial);

// groups

// imported objects
const objGroup = new THREE.Group();

scene.add(objGroup);

// * Loader

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const gltfLoader = new GLTFLoader(loadingManager);

// flight helmet model
gltfLoader.load(
    '../../assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (model) => {
        model.scene.scale.set(3, 3, 3);
        // model.scene.position.set(-2, 0, 0);
        // model.scene.rotation.y = Math.PI * 0.5;

        gui.add(model.scene.rotation, 'y')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.01)
            .name('helmet rotation');

        objGroup.add(model.scene);

        updateAllMaterial();
    },
);

// Environment map
// follow the loading pattern of env map
// 1. positive x (px)
// 2. negative x (nx)
// 3. positive y (py)
// 4. negative y (ny)
// 5. positive z (pz)
// 6. negative z (nz)
const environmentMap = cubeTextureLoader.load([
    '../../assets/textures/textures-anotherOne/environmentMaps/0/px.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/nx.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/py.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/ny.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/pz.jpg',
    '../../assets/textures/textures-anotherOne/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;

// * mesh
// material
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xffffff);

// sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.7,
    roughness: 0.3,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 1, 0);
// scene.add(sphere);

/**
 * * Lights
 */
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.01)
    .name('AL Intensity');
scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.81);
directionalLight.position.set(1, 7, -10);
directionalLight.target = sphere;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5,
);

const DLHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLight, directionalLightHelper, DLHelper);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.1)
    .name('DL Intensity');

gui.add(directionalLight.position, 'x', -10, 10, 1).name('DL X');
gui.add(directionalLight.position, 'y', -10, 10, 1).name('DL Y');
gui.add(directionalLight.position, 'z', -10, 10, 1).name('DL Z');

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

// * axis control
const axisHelper = new THREE.AxesHelper(2);
// scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true, // antialiasing doesn't work after we initialized the renderer
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})
    .name('Gamma')
    .onFinishChange(() => {
        renderer.toneMapping = Number(renderer.toneMapping);
        updateAllMaterial();
    });
// gui.add(renderer, 'gammaFactor').min(0).max(3).step(0.01).name('Gamma');

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

// ? topics to study for better understanding of lecture(Realistic models)
// encoding (on mesh, envMap, etc)
// THREE.sRGBEncoding / THREE.LinearEncoding / THREE.GammaEncoding / THREE.RGBEEncoding / THREE.LogLuvEncoding / THREE.RGBM7Encoding / THREE.RGBM16Encoding etc

// tone mapping (converting HDR to LDR)

///
// stair like effect
///
// solution#1: super sampling(SSAA) or fullscreen sampling
// it's easy to implement but it's not good for performance

// SOLUTION#2: multi sampling(MSAA)

// Problem: some model creates strange surface due to precision error(casting shadow onto itself)
// Solution: use bias and normalBias
