import * as THREE from '../node_modules/three/build/three.module.js';
import {info} from './info.js'

info.render();

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000');

// 카메라
const fov = 75; //화각
const aspect = info.winW / info.winH;
const near = 0.1;
const far = 1000; //카메라 앞부분과 끝부분을 어디까지 렌더링 할껀지
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 2);
camera.lookAt(new THREE.Vector3(0, 0, 0)); //카메라가 어디있든 어떤 오브젝트를 바라보도록 해줌

// 캔버스
const canvas = document.querySelector('#canvas');

// 렌더러
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 빛
const pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.set(0, 2, 12);
scene.add(pointLight);

// 텍스처
const textureLoader = new THREE.TextureLoader();
const textureBaseColor = textureLoader.load('./src/img/aerial_rocks_02_diff_4k.jpg');
const textureNormalColor = textureLoader.load('./src/img/aerial_rocks_02_nor_gl_4k.jpg');
const textureDispMap = textureLoader.load('./src/img/aerial_rocks_02_disp_4k.png');
const textureRoughMap = textureLoader.load('./src/img/aerial_rocks_02_rough_4k.jpg');
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

// 매쉬
const geometry = new THREE.SphereGeometry(0.3, 32, 16);
const material01 = new THREE.MeshStandardMaterial({
    map: textureBaseColor
});
// 프로퍼티들은 밖에서도 사용 가능
const obj01 = new THREE.Mesh(geometry, material01);
obj01.position.x = -1.5;
// 만든 도형 scene 적용
scene.add(obj01);

//MeshStandardMaterial 재질은 기본적인 재질
const material02 = new THREE.MeshStandardMaterial({
    map: textureBaseColor,
    normalMap: textureNormalColor,
});
const obj02 = new THREE.Mesh(geometry, material02);
obj02.position.x = -0.5;
// 만든 도형 scene 적용
scene.add(obj02);

const material03 = new THREE.MeshStandardMaterial({
    map: textureBaseColor,
    normalMap: textureNormalColor,
    displacementMap: textureDispMap,
    displacementScale: 0.03,
});
const obj03 = new THREE.Mesh(geometry, material03);
obj03.position.x = 0.5;
// 만든 도형 scene 적용
scene.add(obj03);

//MeshBasicMaterial 빛 관련 된 재질
const material04 = new THREE.MeshStandardMaterial({
    map: textureBaseColor,
    normalMap: textureNormalColor,
    displacementMap: textureDispMap,
    displacementScale: 0.03,
    roughnessMap: textureRoughMap,
    roughness: 0.8,
});
const obj04 = new THREE.Mesh(geometry, material04);
obj04.position.x = 1.5;
// 만든 도형 scene 적용
scene.add(obj04);

renderer.render(scene, camera);

window.addEventListener('DOMContentLoaded', () => {
    renderer.render(scene, camera);
});

function render(time) {
    // time *= 0.0005;
    //
    // obj01.rotation.y = time;
    // obj02.rotation.y = time;
    // obj03.rotation.y = time;
    // obj04.rotation.y = time;
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

// 반응형 처리
function canvasResize() {
    camera.aspect = info.winW / info.winH; // 종횡비
    camera.updateProjectionMatrix();
    renderer.setSize(info.winW, info.winH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    info.render();
    canvasResize();
});