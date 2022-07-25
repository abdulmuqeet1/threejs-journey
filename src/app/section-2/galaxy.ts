// TODO: add random stars -  completed
// TODO: add galaxy star material - completed
// lesson # 18 - Galaxy
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/section-2/loader';

// * Types
type Params = {
    count: number;
    size: number;
    radius: number;
    branches: number;
    spinMotion: number;
    randomNess: number;
    randomNessPower: number;
    baseColor: THREE.Color;
    insideColor: THREE.Color;
    outsideColor: THREE.Color;
};

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const gui = new dat.GUI();
const scene = new THREE.Scene();

// group
const galaxyObjGroup = new THREE.Group();
scene.add(galaxyObjGroup);

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100,
);

camera.position.y = 15;
camera.position.z = 8;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

const galaxyStarMaterial = textureLoader.load(
    '../../assets/textures/particles/11.png',
);

const rStarMaterial = textureLoader.load(
    '../../assets/textures/particles/8.png',
);

// galaxy
const params: Params = {
    count: 100000,
    size: 0.02,
    radius: 12,
    branches: 3,
    spinMotion: 0.55,
    randomNess: 5,
    randomNessPower: 2,
    baseColor: new THREE.Color(0xfa8c8c),
    insideColor: new THREE.Color('pink'),
    outsideColor: new THREE.Color(0x0e3755),
};

let geometry: THREE.BufferGeometry;
let particlesMaterial: THREE.PointsMaterial;
let points: THREE.Points;

const generateGalaxy = (): void => {
    //disposing old geometries -> not working
    // if (points) {
    //     // destroy old galaxy
    //     geometry.dispose();
    //     particlesMaterial.dispose();
    //     scene.remove(points);
    // }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);

    const insideColors = new THREE.Color(params.insideColor);
    const outsideColors = new THREE.Color(params.outsideColor);

    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        // position
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spinMotion;
        const branchAngle =
            ((i % params.branches) / params.branches) * Math.PI * 2;

        const randomX =
            Math.pow(Math.random(), params.randomNessPower) *
            (Math.random() < 0.5 ? -1 : 1);
        const randomY =
            Math.pow(Math.random(), params.randomNessPower) *
            (Math.random() < 0.5 ? -1 : 1);
        const randomZ =
            Math.pow(Math.random(), params.randomNessPower) *
            (Math.random() < 0.5 ? -1 : 1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // color
        const mixedColor = insideColors.clone();
        mixedColor.lerp(outsideColors, radius / params.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particlesMaterial = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        transparent: true,
        alphaMap: galaxyStarMaterial,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        // color: params.baseColor,
    });

    // Points
    points = new THREE.Points(geometry, particlesMaterial);

    galaxyObjGroup.add(points);
};

generateGalaxy();

// not working!!!
// gui.add(params, 'count', 10, 2000).onFinishChange((value: number) => {
//     params.count = value;
//     if (points) {
//         // destroy old galaxy
//         geometry && geometry.dispose();
//         particlesMaterial && particlesMaterial.dispose();
//         scene.remove(points);
//     }
//     generateGalaxy();
// });
// gui.add(params, 'size', 0.01, 0.1).onFinishChange((value: number) => {
//     params.size = value;
//     if (points) {
//         // destroy old galaxy
//         geometry && geometry.dispose();
//         particlesMaterial && particlesMaterial.dispose();
//         scene.remove(points);
//     }
//     generateGalaxy();
// });
// // add params.radius in gui

// * random stars/galaxies

// rStarsCount ==> random stars count
const rStarsCount = 10000;
const rStarsGeometry = new THREE.BufferGeometry();

const rStarsPositions = new Float32Array(rStarsCount * 3);
for (let i = 0; i < rStarsCount; i++) {
    rStarsPositions[i] = Math.random() * 250 - 125;
}

rStarsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(rStarsPositions, 3),
);
const rStarsMaterial = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: rStarMaterial,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(0xffffff),
});

const rStars = new THREE.Points(rStarsGeometry, rStarsMaterial);

scene.add(rStars);

// * Lights
// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

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

    // galaxy animation
    galaxyObjGroup.rotation.y += 0.002;

    // Update controls
    controls.update();

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
