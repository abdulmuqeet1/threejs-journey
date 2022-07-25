import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import * as dat from 'dat.gui';
// import typeface from '@assets/fonts/helvetiker_regular.typeface.json';
import loadingManager from '@app/section-2/loader';

type numStr = string | number;

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
    100,
);

camera.position.z = 5;

// * texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

const matcapTexture = textureLoader.load('../../assets/textures/matcaps/3.png');
const donutTexture = textureLoader.load('../../assets/textures/matcaps/1.png');

// * font loader
const fontLoader = new FontLoader();

const font = fontLoader.load(
    '../../assets/fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log('Font loaded!');
        const textGeometry = new TextGeometry('Hello ThreeJS!', {
            font: font,
            size: 2,
            height: 0.1,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.031,
            bevelSize: 0.031,
            bevelOffset: 0,
            bevelSegments: 5,
        });

        textGeometry.computeBoundingBox();

        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        // move the geometry half of its length to -ve x-axis
        // if (textGeometry.boundingBox) {
        //     textGeometry.translate(
        //         -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //         -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //         -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
        //     );
        // }
        // easy method => .center() method
        textGeometry.center();

        camera.position.z += 4;
        scene.add(textMesh);

        // console.time('donut');
        const donutGeometry = new THREE.TorusGeometry(1, 0.4, 16, 50);
        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: donutTexture,
        });

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const boxMaterial = new THREE.MeshMatcapMaterial({
            matcap: donutTexture,
        });

        for (let i = 0; i <= 100; i++) {
            const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);
            const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

            donutMesh.position.x = (Math.random() - 0.5) * 80;
            donutMesh.position.y = (Math.random() - 0.5) * 80;
            donutMesh.position.z = (Math.random() - 0.5) * 80;

            boxMesh.position.x = (Math.random() - 0.5) * 80;
            boxMesh.position.y = (Math.random() - 0.5) * 80;
            boxMesh.position.z = (Math.random() - 0.5) * 80;

            donutMesh.rotation.x = Math.random() * Math.PI;
            donutMesh.rotation.y = Math.random() * Math.PI;
            boxMesh.rotation.x = Math.random() * Math.PI;
            boxMesh.rotation.y = Math.random() * Math.PI;

            const scale = Math.random() * 1.25;
            donutMesh.scale.set(scale, scale, scale);
            boxMesh.scale.set(scale, scale, scale);

            scene.add(donutMesh, boxMesh);
        }
        // console.timeEnd('donut');
    },
);

//* mesh

// Controls
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

    // Render
    renderer.setSize(size.width, size.height);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
