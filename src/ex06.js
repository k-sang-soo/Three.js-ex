import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { info } from './info.js';

info.render();

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('#canvas');

// Scene
const scene = new THREE.Scene();

// texture
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('./static/img/NormalMap.png');

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 64, 64);

// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
// sphere.position.set(0, 0, 0);
scene.add(sphere);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
// scene.add(pointLightHelper);

// Lights 2

const pointLight2 = new THREE.PointLight(0xff0000, 0.2);
pointLight2.position.set(-1.86, 1, -1.65);
pointLight2.intensity = 10; // 빛의 강도
scene.add(pointLight2);

const pointLight2Helper = new THREE.PointLightHelper(pointLight2, 0.5);
// scene.add(pointLight2Helper);

//gui controls
const light2 = gui.addFolder('Light 2');
const light2Color = {
    color: 0xff0000,
};
light2.addColor(light2Color, 'color').onChange(() => {
    pointLight2.color.set(light2Color.color);
});

light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01);
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01);

// Lights 3

const pointLight3 = new THREE.PointLight(0xe1ff, 0.2);
pointLight3.position.set(3.13, -3, -1.98);
pointLight3.intensity = 6.8; // 빛의 강도
scene.add(pointLight3);

const pointLight3Helper = new THREE.PointLightHelper(pointLight3, 0.5);
// scene.add(pointLight3Helper);

//gui controls
const light3 = gui.addFolder('Light 3');
const light3Color = {
    color: 0xe1ff,
};
light3.addColor(light3Color, 'color').onChange(() => {
    pointLight3.color.set(light3Color.color);
});

light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01);
light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01);
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01);
light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, info.winW / info.winH, 0.1, 100);
camera.position.set(0, 0, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // 아무것도 없는 공간은 투명하게 보이도록 설정
    antialias: true, // 끝 처리를 더 부드럽게 해줌
});
renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('scroll', onScrollMoveSphere);
window.addEventListener('resize', () => {
    info.render();
    FixedResizeBug(renderer);
});
let beforeWinW = window.innerWidth;
let beforeWinH = window.innerHeight;

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = info.winW / 2;
const windowY = info.winH / 2;

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowX;
    mouseY = event.clientY - windowY;
}

function onScrollMoveSphere(event) {
    sphere.position.y = window.pageYOffset * 0.002;
}

// 반응형 처리
function FixedResizeBug(renderer) {
    const needResize =
        info.winW !== beforeWinW ||
        (info.winW !== beforeWinW && info.winH !== beforeWinH);
    if (needResize) {
        camera.aspect = info.winW / info.winH; // 종횡비
        camera.updateProjectionMatrix();
        renderer.setSize(info.winW, info.winH);
    }
    beforeWinW = info.winW;
    beforeWinH = info.winH;
    return needResize;
}

const tick = () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime;

    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
    sphere.rotation.z += -0.05 * (targetY - sphere.rotation.x);

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
