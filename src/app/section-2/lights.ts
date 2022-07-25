// lesson # 14
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

const matcapTexture = textureLoader.load('../../assets/textures/matcaps/2.png');

//* mesh

// material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// plane
const planeGeometry = new THREE.PlaneGeometry(15, 15);
const plane = new THREE.Mesh(planeGeometry, material);
plane.material.side = THREE.DoubleSide;
plane.translateOnAxis(new THREE.Vector3(0, 1, 0), -3);
plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

// sphere
const sphereGeometry = new THREE.SphereGeometry(1.25, 32, 32);
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.translateOnAxis(new THREE.Vector3(1, 0, 0), -4);

// box
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const box = new THREE.Mesh(boxGeometry, material);

// torus
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 100);
const torus = new THREE.Mesh(torusGeometry, material);
torus.translateOnAxis(new THREE.Vector3(1, 0, 0), 4);

mainGroup.add(plane, sphere, box, torus);

// * Lights
// ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
// scene.add(ambientLight);

// directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 1, 6);
// scene.add(directionalLight);

// hemisphere light
// const hemiLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.6);
// hemiLight.position.set(1, 0.25, 0);
// scene.add(hemiLight);

// point light
const pointLight = new THREE.PointLight(0xfff000, 1);
pointLight.position.set(10, 0.25, 0.25);
scene.add(pointLight);

// rect area light
// const rectAreaLight = new THREE.RectAreaLight(0xffff00, 2, 15, 10);
// rectAreaLight.position.set(0, 0, 6);
// scene.add(rectAreaLight);

// spot light
// const spotLight = new THREE.SpotLight(0xffffff, 1);
// spotLight.position.set(0, 0, 10);
// spotLight.castShadow = true;
// // spotLight.shadow.mapSize.width = 1024;
// // spotLight.shadow.mapSize.height = 1024;
// // spotLight.shadow.camera.near = 0.5;
// // spotLight.shadow.camera.far = 50;
// // spotLight.shadow.camera.fov = 30;
// scene.add(spotLight);

// spotLight.target.position.x = -0.5;
// scene.add(spotLight.target);

// light optimization //
// light cost alot of cpu power and has limit of around 50 lights

// min cost light -> ambient light and hemisphere light
// moderate cost -> directional light and point light
// max cost -> spot light and rect area light

// Baking
// process to reduce the light cost
// idea is to bake the light in the texture (3D software are used to bake the light)
// drawback is that the cant be moved

// Helpers
// const HemisphereLightHelper = new THREE.HemisphereLightHelper(hemiLight, 4);
// scene.add(HemisphereLightHelper);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//     directionalLight,
//     5,
// );
// scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
scene.add(pointLightHelper);

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
    sphere.rotateOnAxis(new THREE.Vector3(1, -1, 1), 0.006);
    torus.rotateOnAxis(new THREE.Vector3(-1, 1, -1), 0.0039);

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
