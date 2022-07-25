// *  imported models

// Formats
// many 3D model formats, each one responding to a problem
// Popular formats
// 1. OBJ
// 2. FBX
// 3. STL
// 4. PLY
// 5. Collada
// 6. 3DS
// 7. GLTF

// one format is standard and cover our most of need
// GLTF (GL Transition Format)

// supports dif sets of geometries, material, cameras, lights scene graph, animations, skeletons, morphing etc

// you dont need to use gltf in all cases
// questions the data you need, the weight of the file, how much time to
// decompress it etc

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const gui = new dat.GUI();
const scene = new THREE.Scene();

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    1000,
);

camera.position.z = 2;
camera.position.y = 1;

// * Loader

// loading draco loader also take resources to load so use draco loader where it make sense to use it
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('@app/utils/draco/');

// const gltfLoader = new GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);

// * Models
// gltfLoader.load(
//     // '../../assets/models/duck/glTF-Binary/Duck.glb',
//     '../../assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => {
//         // scene.add(gltf.scene.children[0]);

//         // for (const child of gltf.scene.children) {
//         //     scene.add(child);
//         // }

//         // scene.add(...gltf.scene.children);
//         // or
//         scene.add(gltf.scene);
//     },
// );

const gltfLoader = new GLTFLoader();

let mixer: THREE.AnimationMixer;
gltfLoader.load('../../assets/models/Fox/glTF/Fox.gltf', (gltf) => {
    // create a mixer to create animations
    mixer = new THREE.AnimationMixer(gltf.scene);
    // mixer.clipAction(gltf.animations[0]).play();
    const action = mixer.clipAction(gltf.animations[1]);
    action.play();

    gltf.scene.scale.set(0.0151, 0.0151, 0.0151);
    scene.add(gltf.scene);
});

// * mesh

// material
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xff00ff);

const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

/**
 * * Lights
 */
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
gui.add(ambientLight, 'intensity', 0, 1);
scene.add(ambientLight);

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

// * axis control
const axisHelper = new THREE.AxesHelper(2);
scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});

/**
 * Utils
 */

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update controls
    controls.update();

    // update mixer
    mixer && mixer.update(deltaTime);

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
