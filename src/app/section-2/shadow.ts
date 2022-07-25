// lesson # 15

// only three types of light supports shadows
// 1. point lights  2. spot lights  3. directional lights

// shadow techniques
// 1. enable shadow casting and receiving objects (+ enable shadow map)
// 2. baking
// 3. using object/plane(along with simple shadow image) as shadow

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/section-2/loader';

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const gui = new dat.GUI();
const scene = new THREE.Scene();
// group
const mainGroup = new THREE.Group();
scene.add(mainGroup);

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100,
);

camera.position.z = 12;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

const bakingTexture = textureLoader.load(
    '../../assets/textures/baking/bakedShadow.jpg',
);
const simpleShadow = textureLoader.load(
    '../../assets/textures/baking/simpleShadow.jpg',
);

//* mesh

// material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// plane
const planeGeometry = new THREE.PlaneGeometry(15, 15);
// const plane = new THREE.Mesh(
//     planeGeometry,
//     new THREE.MeshBasicMaterial({
//         map: bakingTexture,
//     }),
// );
const plane = new THREE.Mesh(planeGeometry, material);
plane.material.side = THREE.DoubleSide;
plane.translateOnAxis(new THREE.Vector3(0, 1, 0), -2);
plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
plane.receiveShadow = true;

// sphere
const sphereGeometry = new THREE.SphereGeometry(1.25, 32, 32);
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.translateOnAxis(new THREE.Vector3(1, 0, 0), -4);
sphere.castShadow = true;

// box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const box = new THREE.Mesh(boxGeometry, material);
box.castShadow = true;

// creating an mesh object to mimic a shadow effect
const boxShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.25, 3.25),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
    }),
);
boxShadow.material.side = THREE.DoubleSide;
boxShadow.rotation.x = Math.PI / 2;
boxShadow.position.y = plane.position.y + 0.25;

scene.add(boxShadow);

// torus
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 100);
const torus = new THREE.Mesh(torusGeometry, material);
torus.translateOnAxis(new THREE.Vector3(1, 0, 0), 4);
torus.castShadow = true;

mainGroup.add(plane, sphere, box, torus);

// * Lights
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
scene.add(ambientLight);

// directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 1, 6);
// scene.add(directionalLight);

// point light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(1, 6.25, -2);
scene.add(pointLight);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2 ** 10; // values should be power of 2 i.e., 2**4, 2**8, 2**32, 2**64 etc.
pointLight.shadow.mapSize.height = 2 ** 10; // values should be power of 2 i.e., 2**4, 2**8, 2**32, 2**64 etc.
// higher value means -> higher cpu cost

// for orthographic camera only /
// pointLight.shadow.camera.top = 2;
// pointLight.shadow.camera.right = 2;
// pointLight.shadow.camera.bottom = -2;
// pointLight.shadow.camera.left = -2;
// for orthographic camera only /

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 16;

const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
scene.add(pointLightHelper);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

// * Shadow Map Algorithm //
// types
// 1. BasicShadowMap
// 2. PCFShadowMap
// 3. PCFSoftShadowMap
// 4. VSMShadowMap

// * Basking
// first deactivate all shadows

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

//* axis helper
const axisHelper = new THREE.AxesHelper(2);
scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});

renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // rotate mesh objects
    box.rotateOnAxis(new THREE.Vector3(1, 1, 1), 0.0051);
    // box.position.x = Math.cos(elapsedTime);
    box.position.z = Math.sin(elapsedTime) * 1.5;
    // boxShadow.position.x = Math.cos(elapsedTime);
    boxShadow.position.z = Math.sin(elapsedTime) * 1.5;

    sphere.rotateOnAxis(new THREE.Vector3(1, -1, 1), 0.006);
    torus.rotateOnAxis(new THREE.Vector3(-1, 1, -1), 0.0039);

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
