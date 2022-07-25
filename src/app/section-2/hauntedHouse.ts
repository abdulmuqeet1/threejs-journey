// lesson # 16

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
const houseGroup = new THREE.Group();
const gravesGroup = new THREE.Group();
const ghosts = new THREE.Group();

scene.add(mainObjGroup, houseGroup, gravesGroup, ghosts);

//* camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100,
);

// camera.position.z = 12;
camera.position.y = 0;
camera.position.z = 12;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

// door textures
const doorColorTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/color.jpg',
);
const doorAlphaTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/alpha.jpg',
);
const doorAmbientTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/ambientOcclusion.jpg',
);
const doorHeightTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/height.jpg',
);
const doorMetalnessTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/metalness.jpg',
);
const doorNormalTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/normal.jpg',
);
const doorRoughnessTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/door/roughness.jpg',
);

// bricks textures
const brickColorTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/bricks/color.jpg',
);
const brickAmbientTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/bricks/ambientOcclusion.jpg',
);
const brickNormalTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/bricks/normal.jpg',
);
const brickRoughnessTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/bricks/roughness.jpg',
);

// grass textures
const grassColorTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/grass/color.jpg',
);
const grassAmbientTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/grass/ambientOcclusion.jpg',
);
const grassNormalTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/grass/normal.jpg',
);
const grassRoughnessTexture = textureLoader.load(
    '../../assets/textures/hauntedHouse/grass/roughness.jpg',
);
grassColorTexture.repeat.set(8, 8);
grassAmbientTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

//* mesh

// material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
material.color = new THREE.Color(0x567d46);

// floor mesh //
const floorGeometry = new THREE.PlaneGeometry(25, 25);
const floorMaterial = new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAmbientTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.material.side = THREE.DoubleSide;
floor.translateOnAxis(new THREE.Vector3(0, 1, 0), -1.25);
floor.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
floor.receiveShadow = true;
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
);

mainObjGroup.add(floor);

// * House mesh //
// house wall ==> box
const wallGeometry = new THREE.BoxGeometry(4, 2.5, 4);
const wallMaterial = new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
});
const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(wallMesh.geometry.attributes.uv.array, 2),
);

// house roof ==> cone geometry
const roofGeometry = new THREE.ConeGeometry(3.25, 1.5, 30);
const roofMesh = new THREE.Mesh(roofGeometry, material);
roofMesh.translateOnAxis(new THREE.Vector3(0, 1, 0), 2);

// 2nd roof
const roof2Geometry = new THREE.ConeGeometry(3.5, 1.25, 4);
const roof2Mesh = new THREE.Mesh(
    roof2Geometry,
    new THREE.MeshBasicMaterial({color: 0x964b00}),
);

roof2Mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), 2);
roof2Mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 0.25);

// door ==> plane geometry
const doorGeometry = new THREE.PlaneGeometry(1.5, 1.5, 100, 100);
const doorMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
});

const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
doorMesh.material.side = THREE.DoubleSide;
doorMesh.translateOnAxis(new THREE.Vector3(0, -0.25, 1), 2.001);
doorMesh.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(doorMesh.geometry.attributes.uv.array, 2),
);

houseGroup.add(wallMesh, roof2Mesh, doorMesh);

// bushes ==> sphere
const bushGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const bushMaterial = new THREE.MeshBasicMaterial({color: 0x84ae51});

// right side bushes
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.7, -1, 2.3);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, -1.1, 2.3);

// left side bushes
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.36, 0.365, 0.36);
bush3.position.set(-1.6, -1.05, 2.3);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.496, 0.49365, 0.4936);
bush4.position.set(-1.2, -1, 2.45);

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
bush5.scale.set(0.6, 0.65, 0.6);
bush5.position.set(-2, -1, 2.3);

mainObjGroup.add(bush1, bush2, bush3, bush4, bush5);

// Graves ==> box
const graveGeometry = new THREE.BoxGeometry(0.8, 1, 0.25);
const graveMaterial = new THREE.MeshBasicMaterial({color: 0x111111});

for (let i = 0; i <= 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 6;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, -1, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.2;
    gravesGroup.add(grave);
}

// * Lights
// ambient light
const ambientLight = new THREE.AmbientLight(0x0d0d6f, 0.21);
gui.add(ambientLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.01)
    .name('ambient light');
scene.add(ambientLight);

// directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 1, 6);
// scene.add(directionalLight);

// point light
const moonLight = new THREE.PointLight(0xd9be8b, 0.75);
moonLight.position.set(
    floor.position.x - 6,
    floor.position.y + 3,
    floor.position.z + 6,
);
scene.add(moonLight);
// moonLight.shadow.mapSize.width = 2 ** 10; // values should be power of 2 i.e., 2**4, 2**8, 2**32, 2**64 etc.
// moonLight.shadow.mapSize.height = 2 ** 10; // values should be power of 2 i.e., 2**4, 2**8, 2**32, 2**64 etc.
gui.add(moonLight.position, 'x').min(-45).max(45).step(1).name('x');
gui.add(moonLight.position, 'y').min(-45).max(45).step(1).name('y');
gui.add(moonLight.position, 'z').min(-45).max(45).step(1).name('z');

const moonLightHelper = new THREE.PointLightHelper(moonLight, 1);
scene.add(moonLightHelper);

// door light
const doorLight = new THREE.PointLight(0xff7d46, 1.2, 7);
doorLight.position.set(0, 1, 2.75);

// const doorLightHelper = new THREE.PointLightHelper(doorLight);
// houseGroup.add(doorLight, doorLightHelper);
houseGroup.add(doorLight);

// Ghost //
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3);
const ghost2 = new THREE.PointLight(0xffff00, 2, 3);
const ghost3 = new THREE.PointLight(0xf11111, 2, 3);

ghosts.add(ghost1, ghost2, ghost3);
// fog
const fog = new THREE.Fog(0x262823, 1, 45);
scene.fog = fog;

// * Controls
const controls = new OrbitControls(camera, canvasElement);
controls.enableDamping = true;

//* axis helper
// const axisHelper = new THREE.AxesHelper(12);
// scene.add(axisHelper);

//* renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});

// shadows
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

wallMesh.castShadow = true;

// bush1.castShadow = true;
// bush2.castShadow = true;
// bush3.castShadow = true;
// bush4.castShadow = true;
// bush5.castShadow = true;

floor.receiveShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 25;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 25;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x262823);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // update ghost position
    const ghostAngle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghostAngle) * 9;
    ghost1.position.z = Math.sin(ghostAngle) * 9;
    ghost1.position.y = Math.sin(ghostAngle * 4);

    const ghost2Angle = elapsedTime * 0.35;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle * 3);

    const ghost3Angle = -elapsedTime * 0.62;
    ghost3.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.y =
        Math.sin(elapsedTime * 5) * Math.sin(elapsedTime * 0.32);

    // Update controls
    controls.update();

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
