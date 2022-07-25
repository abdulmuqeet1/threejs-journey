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

camera.position.z = 8;
camera.position.y = 3;

// * update all material
const updateAllMaterial = () => {
    scene.traverse((child: any) => {
        if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            // child.material.envMap = environmentMap;
            child.material.envMapIntensity = debugObj.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    return;
};

// groups

// imported objects
// const objGroup = new THREE.Group();

// scene.add(objGroup);

// * Loader

// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/**
 * ! Mesh
 */

// basic material
const basicMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

// GLTF Model

const gltfLoader = new GLTFLoader(loadingManager);

// flight helmet model
gltfLoader.load('../../assets/models/custom-blender-model.glb', (model) => {
    // model.scene.scale.set(3, 3, 3);
    // model.scene.position.set(-2, 0, 0);
    model.scene.rotation.y = -(Math.PI * 0.5);

    model.scene.traverse((child: any) => {
        child.material = basicMaterial;
        return;
    });

    scene.add(model.scene);

    updateAllMaterial();
});

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

// direct light
const directLight = new THREE.DirectionalLight(0xffffff, 1);
directLight.position.set(0, 10, 10);
scene.add(directLight);

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
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 2;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
