import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';

const canvasElement: HTMLElement | null =
    document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

interface ScreenSize {
    width: number;
    height: number;
}

const screenSize: ScreenSize = {
    width: window.innerWidth ?? 720,
    height: window.innerHeight ?? 480,
};

/**
 * ! Scene
 */
const scene: THREE.Scene = new THREE.Scene();

/**
 * ! Loaders
 */
// texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);
// const waterTexture = textureLoader.load('../../assets/textures/water.jpg');

/**
 * ! Utils
 */
// random color generator
const randomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
};

// get mouse coordinate
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event: MouseEvent): void => {
    event.preventDefault();
    mouse.x = (event.clientX / screenSize.width) * 2 - 1; // -1 to 1
    mouse.y = -(event.clientY / screenSize.height) * 2 + 1; // -1 to 1
});

// axes helper
const axisHelper = new THREE.AxesHelper(2);
scene.add(axisHelper);

/**
 * ! Group(s)
 */
const objGroup = new THREE.Group();
objGroup.position.set(0, 0, 0);
objGroup.translateOnAxis(new THREE.Vector3(-1, -1, 1), 1);
scene.add(objGroup);

/**
 * ! Dat GUI
 */
const gui = new dat.GUI();

const debugObj = {
    sphereCount: 100,
    ALLight: 1.2,
    metalness: 0.5,
    roughness: 0.5,
};

gui.add(debugObj, 'metalness', 0, 1).step(0.01).name('Metalness');
// .onChange(() => {
//     // update all spheres
//     objGroup.children.forEach((sphere: THREE.Mesh) => {
//         sphere.material.needsUpdate = true;
//     });
// });

/**
 * ! Camera
 */

// Perspective Camera
const camera = new THREE.PerspectiveCamera(
    75,
    screenSize.width / screenSize.height,
    0.1,
    1000,
);
camera.lookAt(0, 0, 0);
camera.position.z = 4;
camera.position.y = 1;

/**
 * ! Orbit Controls
 */
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);

/**
 * ! Loaders
 */

/**
 * ! Geometries / Shapes
 */

// circle function
type Material = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
const createSphere = (
    radius: number,
    widthSegments: number,
    heightSegments: number,
    material?: Material,
) => {
    const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments,
    );
    if (material) {
        return new THREE.Mesh(geometry, material);
    }
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.75,
        roughness: 0.45,
    });
    return new THREE.Mesh(geometry, sphereMaterial);
};

// add spheres
let distance = 0;
let lineCount = 0;
let planeCount = 0;

for (let i = 0; i < debugObj.sphereCount; i++) {
    const material = new THREE.MeshStandardMaterial({
        // color: randomColor(),
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.5,
    });

    if (i % 100 === 0) {
        planeCount -= 0.2;
        lineCount = 0;
        distance = 0;
    } else if (i % 10 === 0) {
        lineCount += 0.2;
        distance = 0;
    }

    const sphere = createSphere(0.1, 16, 15, material);
    sphere.position.set(distance, lineCount, planeCount);
    scene.add(sphere);

    distance += 0.1 * 2;
}

// * Ragging Sea

// const seaGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
// const seaMaterial = new THREE.MeshStandardMaterial({
//     color: 0xaaccff,
//     side: THREE.DoubleSide,
// });
// seaMaterial.map = waterTexture;

// const sea = new THREE.Mesh(seaGeometry, seaMaterial);

// sea.rotateX(-Math.PI / 2);

// const seaPosition: any = seaGeometry.attributes.position;

// seaPosition.usage = THREE.DynamicDrawUsage;

// for (let i = 0; i < seaPosition.count; i++) {
//     const y = 35 * Math.sin(1 / 2);
//     seaPosition.setY(i, y);
// }

// scene.add(sea);

// Fog
// scene.background = new THREE.Color(0xabaeb0);
// scene.fog = new THREE.FogExp2(0xabaeb0, 0.025);

/**
 * ! Lights
 */

// ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity', 0, 2).step(0.1).name('ALight');

// point lights

// * fairy 1
const fairy1Light = new THREE.PointLight(0xff0000, 1, 3, 2);
// const fairy1LightHelper = new THREE.PointLightHelper(fairy1Light, 1);

const fairyBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 12, 12),
    new THREE.MeshBasicMaterial({color: 0xff0000}),
);

const fairy = new THREE.Group();
fairy.add(fairy1Light, fairyBody);

fairy.position.set(1, 0.5, 0);

scene.add(fairy);

// * fairy 2
const fairy2Light = new THREE.PointLight(0x00ff00, 1, 3, 2);
// fairy2Light.position.set(3, 0, 4);
// const fairy2LightHelper = new THREE.PointLightHelper(fairy2Light, 1);

const fairy2Body = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 12, 12),
    new THREE.MeshBasicMaterial({color: 0x00ff00}),
);
// fairy2Body.position.set(3, 0, 4);

const fairy2 = new THREE.Group();
fairy2.add(fairy2Light, fairy2Body);

fairy2.position.set(3, 0, 4);

scene.add(fairy2);

// * fairy 3
const fairy3Light = new THREE.PointLight(0x0000ff, 1, 3, 2);
// fairy3Light.position.set(2, 0, -5);
// const fairy3LightHelper = new THREE.PointLightHelper(fairy3Light, 1);

const fairy3Body = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 12, 12),
    new THREE.MeshBasicMaterial({color: 0x0000ff}),
);

const fairy3 = new THREE.Group();
fairy3.add(fairy3Light, fairy3Body);

fairy3Body.position.set(0, 0, 0);

scene.add(fairy3);

/**
 * ! Ray Casting
 */
const raycaster = new THREE.Raycaster();

// const intersection = raycaster.intersectObjects(objGroup.children, false);

/**
 * ! Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * ! Animation
 */

const clock = new THREE.Clock();

const animate = () => {
    // callback animate again on the next frame
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // update controls
    controls.update();

    // raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    // if (intersects.length) {
    //     for (const intersection of intersects) {
    //         // intersection.object?.material.color.set(new THREE.Color(0x0f0fff));
    //         console.log('intersection object: ', intersection.object);
    //     }
    // }
    // for (let i = 0; i < intersects.length; i++) {
    //     intersects[i].object.material.color.set(0xff0000);
    // }

    // fairies movement
    fairy.position.x = Math.cos(elapsedTime * 0.5) * 2;
    fairy.position.z = Math.sin(elapsedTime * 0.5) * 2;

    fairy2.position.x = Math.cos(elapsedTime * 0.25) * 2;
    fairy2.position.y = Math.sin(elapsedTime * 0.375) * 2;
    fairy2.position.z = Math.sin(elapsedTime * 0.366) * 2;

    fairy3.position.x = Math.cos(elapsedTime * 0.1) * 2;
    fairy3.position.y = Math.sin(elapsedTime * 0.15) * 2;
    fairy3.position.z = Math.sin(elapsedTime * 0.08) * 2;

    // // ragging sea
    // const time = elapsedTime * 10;

    // const position = seaGeometry.attributes.position;
    // for (let i = 0; i < position.count; i++) {
    //     const y = 2 * Math.sin(i / 5 + (time + i) / 7);
    //     position.setY(i, y);
    // }
    // position.needsUpdate = true;

    // Render
    renderer.setSize(screenSize.width, screenSize.height);
    renderer.render(scene, camera);
};

animate();

// console.log('group child: ', objGroup.children[0]?.material);
// if (objGroup.children[0].material) {
//     console.log('material exists');
// }
