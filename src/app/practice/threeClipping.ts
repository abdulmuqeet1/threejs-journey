// lesson # 19 - Raycaster
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/section-2/loader';

interface Size {
    width: number;
    height: number;
}

interface Params {
    clipIntersection: boolean;
    planeConstant: number;
    showHelper: boolean;
}

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

const size: Size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const params: Params = {
    clipIntersection: true,
    planeConstant: 0.14,
    showHelper: false,
};

const gui = new dat.GUI();
const scene = new THREE.Scene();

// group
const mainGroup = new THREE.Group();
const sphereGroup = new THREE.Group();

scene.add(mainGroup, sphereGroup);

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100,
);

camera.position.z = 2;
camera.position.y = 2;
camera.position.x = -1.75;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

// clipping Planes
const clipPlanes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
];

// * mesh

// generate x amount of sphere
for (let i = 0; i <= 30; i += 2) {
    const geometry = new THREE.SphereGeometry(i / 30, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
        side: THREE.DoubleSide,
        clippingPlanes: clipPlanes,
        clipIntersection: params.clipIntersection,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphereGroup.add(sphere);
}

// Helpers
const helpers = new THREE.Group();

helpers.add(new THREE.PlaneHelper(clipPlanes[0], 10, 0xffff00));
helpers.add(new THREE.PlaneHelper(clipPlanes[1], 10, 0x00ff00));
helpers.add(new THREE.PlaneHelper(clipPlanes[2], 10, 0x0000ff));
helpers.visible = false;
scene.add(helpers);

gui.add(params, 'showHelper')
    .name('show Helpers')
    .onChange((val): void => {
        helpers.visible = val;
    });

gui.add(params, 'planeConstant', -1, 1)
    .step(0.01)
    .name('plane constant')
    .onChange(function (value) {
        for (let j = 0; j < clipPlanes.length; j++) {
            clipPlanes[j].constant = value;
        }
    });

// gui.add(params, 'clipIntersection')
//     .name('clip intersection')
//     .onChange((val): void => {
//         const children = sphereGroup.children;
//         for (let i = 0; i < children.length; i++) {
//             children[i].material.clipIntersection = val;
//         }
//         return;
//     });

// * Lights
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
gui.add(ambientLight, 'intensity', 0, 1);
scene.add(ambientLight);

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

// * axis control
const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(size.width, size.height);
renderer.localClippingEnabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
