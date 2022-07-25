// *  better intro and html loader
// lecture 31

// TODO: add a custom html loader(page loading animation)

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';
import gsap from 'gsap';

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

/**
 * ! Overlay
 */

const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2);
const overlayMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uAlpha: {value: 1.0},
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    transparent: true,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);

scene.add(overlay);

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

/**
 * ! Loader
 */

const loadingBar = document.querySelector('.loading-bar');
console.log(loadingBar);

// custom loader
const modelLoadingManager = new THREE.LoadingManager(
    // loaded
    () => {
        gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0});
        console.log('model loaded');
    },

    // progress
    (itemUrl, itemLoaded, totalItem) => {
        console.log('loading model...');
    },
);

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const gltfLoader = new GLTFLoader(modelLoadingManager);

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
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5,
);
directionalLightHelper.visible = false;

const DLHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
DLHelper.visible = false;
scene.add(directionalLight, directionalLightHelper, DLHelper);

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
scene.add(axisHelper);

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
