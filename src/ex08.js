import * as THREE from 'three';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { TextGeometry } from 'three/src/geometries/TextGeometry';
import { info } from './info.js';

info.render();

const canvas = document.querySelector('#canvas');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    info.winW / info.winH,
    0.1,
    10000,
);
camera.position.x = 0;
camera.position.z = 500;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#4dd0e1');

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 매쉬
const geometry01 = new THREE.BoxGeometry(120, 120, 120);
const material01 = new THREE.MeshNormalMaterial();
const obj01 = new THREE.Mesh(geometry01, material01);
// 만든 도형 scene 적용
scene.add(obj01);

const loader = new FontLoader();
loader.load('../../static/font/Poppins_Regular.json', (font) => {
    const geometry = new TextGeometry('Spade Company', {
        font: font,
        size: 100,
        height: 20,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 6,
        bevelOffset: 1,
        bevelSegments: 5,
    });

    const material = new THREE.MeshStandardMaterial({
        color: '#eee',
        roughness: 0.3,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0;
    mesh.position.x = -400;
    mesh.position.z = -400;
    scene.add(mesh);
});

const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

let mouseX = 0;
let mouseY = 0;
const windowX = info.winW / 2;
const windowY = info.winH / 2;

document.addEventListener('mousemove', onDocumentMouseMove);
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowX;
    mouseY = event.clientY - windowY;
}

// 반응형 처리
function canvasResize() {
    camera.aspect = info.winW / info.winH; // 종횡비
    camera.updateProjectionMatrix();
    renderer.setSize(info.winW, info.winH);
}

window.addEventListener('resize', () => {
    info.render();
    canvasResize();
});

function render() {
    requestAnimationFrame(render);
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

render();
