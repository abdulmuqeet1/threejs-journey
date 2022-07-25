// lesson # 17 - Particles

// particles can be used to create  stars, smoke, rain, dust, fire, etc.

// you can have thousands of them with a reasonable frame rate
// each particle is composed of a plane(twp triangles) alwasys facing the camera

// creating particle is like creating a mesh
// geometry and material are required
// particle = geometry + material

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

camera.position.z = 4;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

const particleTexture = textureLoader.load(
    '../../assets/textures/particles/2.png',
);

//* mesh
const boxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xffffff}),
);

mainObjGroup.add(boxMesh);

// // particles
// const particlesGeometry = new THREE.SphereGeometry(1, 128, 32);
// const particlesMaterial = new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true,
// });

// const particles = new THREE.Points(particlesGeometry, particlesMaterial);

// mainObjGroup.add(particles);

// particles count
const count = 1000;

// * Custom geometry particles
const particlesGeometry = new THREE.BufferGeometry();

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
    positions[i] = Math.random() * 5 - 2.5;
    colors[i] = Math.random();
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
);

particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// points material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    // color: 0x87ceeb,
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001, // to fix the visible edges of particles( which are not even after transparent: true and alphaMap)
    // depthTest: false, // to fix the visible edges of particles (failure: create see through particles)
    depthWrite: false, // to fix the visible edges of particles ( + fix see through particles prob)
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

mainObjGroup.add(particlesMesh);

// * Lights
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
scene.add(ambientLight);

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

    //update particles position
    particlesMesh.rotation.y = elapsedTime * 0.1;

    // create particle wave movement animation
    // for (let i = 0; i < count; i++) {
    //     const i3 = i * 3;
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    // }
    // particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
