// lesson # 20 - Physics

// physics libs -> cannonJS/cannonES, ammoJS, three-react-fiber(for react)
// you can use 3D library as wel as 2D library(e.g. ping pong game )
// 3d --> ammojs cannonjs oimajs
// 2d --> p2.js, matter.js etc

// create a threeJS world and similar Physics world and match the physics world coordinate
// with the threeJS world coordinate

// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import * as dat from 'dat.gui';
// import loadingManager from '@app/utils/loader';
// import * as CANNON from 'cannon-es';

// const canvasElement: HTMLElement | null =
//     document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

// const size = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// };

// const gui = new dat.GUI();
// const scene = new THREE.Scene();

// //* camera
// const camera = new THREE.PerspectiveCamera(
//     75,
//     size.width / size.height,
//     0.1,
//     1000,
// );

// camera.position.z = 12;
// camera.position.y = 2;

// // * texture loader
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// const envMapTexture = cubeTextureLoader.load([
//     '../../assets/textures/physicsEnvMaps/0/px.png',
//     '../../assets/textures/physicsEnvMaps/0/nx.png',
//     '../../assets/textures/physicsEnvMaps/0/py.png',
//     '../../assets/textures/physicsEnvMaps/0/ny.png',
//     '../../assets/textures/physicsEnvMaps/0/pz.png',
//     '../../assets/textures/physicsEnvMaps/0/nz.png',
// ]);

// // * mesh

// // material
// const material = new THREE.MeshStandardMaterial();
// material.color = new THREE.Color(0xff00ff);

// const floorGeometry = new THREE.PlaneGeometry(100, 100);
// const floorMaterial = new THREE.MeshStandardMaterial();
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2;
// scene.add(floor);

// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sphere: THREE.Mesh | any = new THREE.Mesh(sphereGeometry, material);
// sphere.position.y = 4;
// scene.add(sphere);

// /**
//  * * Physics World
//  */

// const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0);

// // floor material
// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic');

// const defaultContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         friction: 0.1,
//         restitution: 0.7,
//         contactEquationStiffness: 1e8,
//         contactEquationRelaxation: 3,
//         frictionEquationStiffness: 1e8,
//         // frictionEquationRegularizationTime: 3,
//     },
// );
// world.addContactMaterial(defaultContactMaterial);
// world.defaultContactMaterial = defaultContactMaterial;

// const floorBody = new CANNON.Body({
//     mass: 0,
//     shape: new CANNON.Plane(),
//     material: concreteMaterial,
// });
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
// world.addBody(floorBody);

// // create a body
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 4, 0),
//     shape: new CANNON.Sphere(1),
//     material: plasticMaterial,
// });

// sphereBody.applyLocalForce(
//     new CANNON.Vec3(205, 0, 0),
//     new CANNON.Vec3(0, 0, 0),
// );

// world.addBody(sphereBody);

// // apply forces
// // four methods to apply forces
// // .applyForce
// // .applyImpulse
// // .applyLocalImpulse
// // .applyLocalForce

// /**
//  * * Lights
//  */
// // ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// gui.add(ambientLight, 'intensity', 0, 1);
// scene.add(ambientLight);

// // * Controls
// const controls = new OrbitControls(camera, canvasElement);
// controls.enableDamping = true;

// // * axis control
// const axisHelper = new THREE.AxesHelper(5);
// scene.add(axisHelper);

// //* renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvasElement,
// });

// /**
//  * Animate
//  */
// const clock = new THREE.Clock();
// let oldElapsedTime = 0;

// const tick = () => {
//     const elapsedTime = clock.getElapsedTime();
//     const deltaTime = elapsedTime - oldElapsedTime;
//     oldElapsedTime = elapsedTime;

//     //  update physics world (adding wind effect)
//     sphereBody.applyForce(
//         new CANNON.Vec3(-0.5, 0, 0),
//         new CANNON.Vec3(0, 0, 0),
//     );

//     // update physics world
//     world.step(1 / 60, deltaTime, 3);

//     // console.log(sphereBody.position);

//     // update threeJS world(using physics world coordinate)
//     // sphere.position.x = sphereBody.position.x;
//     // sphere.position.y = sphereBody.position.y;
//     // sphere.position.z = sphereBody.position.z;

//     sphere.position.copy(sphereBody.position);

//     // Update controls
//     controls.update();

//     // Render
//     renderer.setSize(size.width, size.height);
//     renderer.render(scene, camera);

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick);
// };

// tick();

// // ? Part two
// // starts at 54:40

// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import * as dat from 'dat.gui';
// import loadingManager from '@app/utils/loader';
// import * as CANNON from 'cannon-es';

// const canvasElement: HTMLElement | null =
//     document.querySelector('.webgl') ?? document.createElement('canvas#webgl');

// const size = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// };

// const gui = new dat.GUI();
// const scene = new THREE.Scene();

// //* camera
// const camera = new THREE.PerspectiveCamera(
//     75,
//     size.width / size.height,
//     0.1,
//     1000,
// );

// camera.position.z = 12;
// camera.position.y = 2;

// // * texture loader
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// const envMapTexture = cubeTextureLoader.load([
//     '../../assets/textures/physicsEnvMaps/0/px.png',
//     '../../assets/textures/physicsEnvMaps/0/nx.png',
//     '../../assets/textures/physicsEnvMaps/0/py.png',
//     '../../assets/textures/physicsEnvMaps/0/ny.png',
//     '../../assets/textures/physicsEnvMaps/0/pz.png',
//     '../../assets/textures/physicsEnvMaps/0/nz.png',
// ]);

// // * mesh

// // material
// const material = new THREE.MeshStandardMaterial();
// material.color = new THREE.Color(0xff00ff);

// const floorGeometry = new THREE.PlaneGeometry(100, 100);
// const floorMaterial = new THREE.MeshStandardMaterial();
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2;
// scene.add(floor);

// // const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// // const sphere: THREE.Mesh | any = new THREE.Mesh(sphereGeometry, material);
// // sphere.position.y = 4;
// // scene.add(sphere);

// /**
//  * * Physics World
//  */

// const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0);

// // floor material
// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic');

// const defaultContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         friction: 0.1,
//         restitution: 0.7,
//         contactEquationStiffness: 1e8,
//         contactEquationRelaxation: 3,
//         frictionEquationStiffness: 1e8,
//         // frictionEquationRegularizationTime: 3,
//     },
// );
// world.addContactMaterial(defaultContactMaterial);
// world.defaultContactMaterial = defaultContactMaterial;

// const floorBody = new CANNON.Body({
//     mass: 0,
//     shape: new CANNON.Plane(),
//     material: concreteMaterial,
// });
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
// world.addBody(floorBody);

// /**
//  * * Lights
//  */
// // ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// gui.add(ambientLight, 'intensity', 0, 1);
// scene.add(ambientLight);

// // * Controls
// const controls = new OrbitControls(camera, canvasElement);
// controls.enableDamping = true;

// // * axis control
// const axisHelper = new THREE.AxesHelper(5);
// scene.add(axisHelper);

// //* renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvasElement,
// });

// /**
//  * Utils
//  */

// interface ObjectToUpdateType {
//     mesh: THREE.Mesh | any;
//     body: CANNON.Body | any;
// }

// const objectToUpdate: ObjectToUpdateType[] = [];

// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sphereMaterial = new THREE.MeshStandardMaterial({
//     metalness: 0.5,
//     roughness: 0.5,
//     envMap: envMapTexture,
// });

// const createSphere = (radius: number, position: THREE.Vector3 | any): void => {
//     const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
//     sphereMesh.scale.set(radius, radius, radius);
//     sphereMesh.castShadow = true;
//     sphereMesh.position.copy(position);

//     scene.add(sphereMesh);

//     // cannonJS body
//     const shape = new CANNON.Sphere(radius);
//     const body = new CANNON.Body({
//         mass: 1,
//         position: new CANNON.Vec3(position.x, position.y, position.z),
//         shape,
//         material: plasticMaterial,
//     });

//     body.position.copy(position);
//     world.addBody(body);

//     // save in the object to update
//     objectToUpdate.push({
//         mesh: sphereMesh,
//         body,
//     });
// };

// createSphere(Math.random(), new THREE.Vector3(0, 4, 0));

// /**
//  * Debug
//  */

// interface DebugType {
//     createSphere: () => void;
// }

// const debugObject: DebugType = {
//     createSphere: () => {
//         createSphere(
//             1,
//             new THREE.Vector3(
//                 Math.random() * 12 - 6,
//                 Math.random() * 30 - 15,
//                 0,
//             ),
//         );
//     },
// };

// gui.add(debugObject, 'createSphere').name('Create Sphere');

// /**
//  * Animate
//  */
// const clock = new THREE.Clock();
// let oldElapsedTime = 0;

// const tick = () => {
//     const elapsedTime = clock.getElapsedTime();
//     const deltaTime = elapsedTime - oldElapsedTime;
//     oldElapsedTime = elapsedTime;

//     // update physics world
//     world.step(1 / 60, deltaTime, 3);

//     for (const obj of objectToUpdate) {
//         obj.mesh.position.copy(obj.body.position);
//         obj.mesh.quaternion.copy(obj.body.quaternion);
//     }

//     // Update controls
//     controls.update();

//     // Render
//     renderer.setSize(size.width, size.height);
//     renderer.render(scene, camera);

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick);
// };

// tick();

// ? Part three
// starts at 1:13:30

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import loadingManager from '@app/utils/loader';
import * as CANNON from 'cannon-es';

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

camera.position.z = 12;
camera.position.y = 2;

// * Sound
const hitSound = new Audio('../../assets/sounds/hit.mp3');

const playHitSound = (collision: any) => {
    // TODO: set sound vol according to the .getImpactVelocityAlongNormal() value
    // TODO: e.g. at velocity > 10, play the sound at max volume, at  2 < velocity > 5, play volume at 0.5 level,  else play at min volume
    hitSound.currentTime = 0;
    if (collision.contact.getImpactVelocityAlongNormal() > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }
};

// * texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const envMapTexture = cubeTextureLoader.load([
    '../../assets/textures/physicsEnvMaps/0/px.png',
    '../../assets/textures/physicsEnvMaps/0/nx.png',
    '../../assets/textures/physicsEnvMaps/0/py.png',
    '../../assets/textures/physicsEnvMaps/0/ny.png',
    '../../assets/textures/physicsEnvMaps/0/pz.png',
    '../../assets/textures/physicsEnvMaps/0/nz.png',
]);

// * mesh

// material
const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0xff00ff);

const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

/**
 * * Physics World
 */

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// floor material
const concreteMaterial = new CANNON.Material('concrete');
const plasticMaterial = new CANNON.Material('plastic');

const defaultContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.2,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
    },
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

const floorBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: concreteMaterial,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

const boxBody = new CANNON.Body({
    mass: 1,
    // position: new CANNON.Vec3(0, 3, 0),
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    material: plasticMaterial,
});
world.addBody(boxBody);

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
const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});

/**
 * Utils
 */

interface ObjectToUpdateType {
    mesh: THREE.Mesh | any;
    body: CANNON.Body | any;
}

const objectToUpdate: ObjectToUpdateType[] = [];

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.4,
    envMap: envMapTexture,
});

const createBox = (
    width: number,
    height: number,
    depth: number,
    position: THREE.Vector3 | any,
): void => {
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.scale.set(width, height, depth);
    boxMesh.castShadow = true;
    boxMesh.position.copy(position);

    scene.add(boxMesh);

    // cannonJS body
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape,
        material: plasticMaterial,
    });
    body.addEventListener('collide', (event: Event) => {
        playHitSound(event);
    });
    body.position.copy(position);
    world.addBody(body);

    // save in the object to update
    objectToUpdate.push({
        mesh: boxMesh,
        body,
    });
};

createBox(
    Math.random(),
    Math.random(),
    Math.random(),
    new THREE.Vector3(0, 4, 0),
);

/**
 * Debug
 */

interface DebugType {
    createBox: () => void;
    reset: () => void;
}

const debugObject: DebugType = {
    createBox: () => {
        createBox(
            1,
            1,
            Math.random(),
            new THREE.Vector3(
                Math.random() * 12 - 6,
                Math.random() * 30 - 15,
                0,
            ),
        );
    },
    reset: () => {
        for (const obj of objectToUpdate) {
            // remove body eventListener
            obj.body.removeEventListener('collide', (event: Event) => {
                playHitSound(event);
            });

            // remove mesh
            scene.remove(obj.mesh);
        }
        return;
    },
};

gui.add(debugObject, 'createBox').name('Create Box');

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // update physics world
    world.step(1 / 60, deltaTime, 3);

    for (const obj of objectToUpdate) {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    }

    // Update controls
    controls.update();

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

// * Performance
/**
 * when testing the collision, the naive approach is to test the object against all other objects
 * this approach is bad for performance
 * and this phase is called broadphase
 *
 * Types of broadphase
 *
 * 1. Naive Broadphase
 * 2. Grid BroadPhase
 * 3. SAP Broadphase(sweep and Prune)
 *
 * default is naive broadphase
 *
 *
 *
 */

// * Constraints
/**
 * Hinge Constraint -     acts like a door hinge
 * Distance Constraint -
 * Lock Constraint
 * Point to Point Constraint
 *
 */
