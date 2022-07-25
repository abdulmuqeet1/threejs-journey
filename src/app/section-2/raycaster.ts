// lesson # 19 - Raycaster
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

let currentIntersect: any = null;
const colored = {
    obj1: false,
    obj2: false,
    obj3: false,
};

window.addEventListener('click', (): void => {
    if (currentIntersect) {
        if (currentIntersect.object === obj1) {
            console.log('clicked on sphere 1!');
            colored.obj1
                ? obj1.material.color.set(0xffffff)
                : obj1.material.color.set(0xff0000);

            colored.obj1 = !colored.obj1;
        } else if (currentIntersect.object === obj2) {
            console.log('clicked on sphere 2!');
            colored.obj2
                ? obj2.material.color.set(0xffffff)
                : obj2.material.color.set(0x00ff00);

            colored.obj2 = !colored.obj2;
        } else if (currentIntersect.object === obj3) {
            console.log('clicked on sphere 3!');
            colored.obj3
                ? obj3.material.color.set(0xffffff)
                : obj3.material.color.set(0xf000ff);

            colored.obj3 = !colored.obj3;
        }
    }
});

// get mouse coordinates
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event: MouseEvent): void => {
    mouse.x = (event.clientX / size.width) * 2 - 1;
    mouse.y = -(event.clientY / size.height) * 2 + 1;
});

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

camera.position.z = 5;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

const sphereTexture = textureLoader.load('../../assets/textures/matcaps/8.png');

// * mesh

// material
const material = new THREE.MeshStandardMaterial();

const obj1Geometry = new THREE.SphereGeometry(1, 32, 32);
const obj1 = new THREE.Mesh(obj1Geometry, new THREE.MeshStandardMaterial());
// obj1.translateOnAxis(new THREE.Vector3(3, 0, 0), 1);
obj1.position.x = 3;
scene.add(obj1);

const obj2Geometry = new THREE.SphereGeometry(1, 32, 32);
const obj2 = new THREE.Mesh(obj2Geometry, new THREE.MeshStandardMaterial());
scene.add(obj2);

const obj3Geometry = new THREE.SphereGeometry(1, 32, 32);
const obj3 = new THREE.Mesh(obj3Geometry, new THREE.MeshStandardMaterial());
obj3.position.x = -3;
// obj3.translateOnAxis(new THREE.Vector3(3, 0, 0), -1);
scene.add(obj3);

// mainGroup.add(obj1, obj2, obj3);

// * Raycaster
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-4, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0); // provide normalized value
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(obj2);

// const intersects = raycaster.intersectObjects([obj1, obj2, obj3]);

// * Lights
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
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // animating objects
    obj1.position.y = Math.sin(elapsedTime * 0.35) * 2;
    obj2.position.y = Math.sin(elapsedTime * 0.5) * 2;
    obj3.position.y = Math.sin(elapsedTime * 0.65) * 2;

    // cast a ray
    // const rayOrigin = new THREE.Vector3(-4, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // rayDirection.normalize();

    // raycaster.set(rayOrigin, rayDirection);

    // const objectsTTest = [obj1, obj2, obj3];

    // const intersects = raycaster.intersectObjects(objectsTTest);

    // for (const object of objectsTTest) {
    //     object.material.color.set(0xffffff);
    // }
    // for (const intersect of intersects) {
    //     // console.log('intersect: ', intersect.object?.material);
    //     intersect.object?.material.color.set(0xff0000);
    // }

    // ray caster => easy solution
    raycaster.setFromCamera(mouse, camera);

    const objectsTest = [obj1, obj2, obj3];
    const intersects = raycaster.intersectObjects(objectsTest);

    // for (const object of objectsTest) {
    //     object.material.color.set(0xffffff);
    // }

    // for (const intersect of intersects) {
    //     intersect.object?.material.color.set(0xff0000);
    // }

    // mouse enter and mouse leave Events using ray caster
    // if (intersects.length) {
    //     if (currentIntersect === null) {
    //         console.log('mouse enter!');
    //     }
    //     currentIntersect = intersects[0];
    // } else {
    //     if (currentIntersect !== null) {
    //         console.log('mouse leave!');
    //     }
    //     currentIntersect = null;
    // }

    // click event
    if (intersects.length) {
        currentIntersect = intersects[0];
    } else {
        currentIntersect = null;
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
