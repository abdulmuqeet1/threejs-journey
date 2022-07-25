// particles exercise ==> create a custom shape/geometry and apply particles geometry to it
// ! failed

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
const mainObjGroup = new THREE.Group();
scene.add(mainObjGroup);

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100,
);

camera.position.z = 8;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

//* mesh
const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
    -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0, 2.5, 1.0,

    -1.0, 1.0, 1.0, -2.5, 1.0, 1.0, -1.0, 0, 1.0,

    -1.0, 0, 1.0, -2.5, -1.0, 1.0, -1.0, -1.0, 1.0,

    -1.0, -1.0, 1.0, 0.0, -2.5, 1.0, 1.0, -1.0, 1.0,

    1, -1.0, 1.0, 2.5, -1.0, 1.0, 1.0, 0.0, 1.0,

    1.0, 0.0, 1.0, 2.5, 1.0, 1.0, 1.0, 1.0, 1.0,
]);

const vertices2 = new Float32Array([
    -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0, 2.5, 1.0,
]);

const x = 0,
    y = 0;

const heartShape = new THREE.Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

const heartGeometry = new THREE.ShapeGeometry(heartShape);

const PointsMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: false,
});

const heartMesh = new THREE.Mesh(heartGeometry, PointsMaterial);
heartMesh.material.side = THREE.DoubleSide;

mainObjGroup.add(heartMesh);

// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// const material = new THREE.MeshBasicMaterial({
//     color: 0xffff00,
//     wireframe: true,
// });

// const PointsMaterial = new THREE.PointsMaterial({
//     size: 0.2,
//     sizeAttenuation: false,
// });

// const mesh = new THREE.Mesh(geometry, PointsMaterial);
// mesh.material.side = THREE.DoubleSide;
// mainObjGroup.add(mesh);

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
