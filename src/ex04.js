import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { info } from './info.js';

info.render();

const FogColor = '#eaeaea';
const ObjColor = 0xffffff;
const FloorColor = 0x555555;

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(FogColor);
// 안개
// scene.fog = new THREE.Fog(FogColor, 1, 8); // 파라미터 (색상, 거리 가까운, 거리 멀음) ;
scene.fog = new THREE.FogExp2(FogColor, 0.3); // scene에 전체적으로 적용

// 카메라
const camera = new THREE.PerspectiveCamera(
    75,
    info.winW / info.winH,
    0.1,
    1000,
);
camera.position.set(0, 2, 3);
camera.lookAt(new THREE.Vector3(0, 0.5, 0));

// 캔버스
const canvas = document.querySelector('#canvas');

// 렌더러
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 5;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

//그림자
renderer.shadowMap.enabled = true;

// 빛
const pointLight = new THREE.PointLight(0xffffff, 0.8);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2, '#000');
pointLight.position.set(0, 2, 1);
scene.add(pointLightHelper);
scene.add(pointLight);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.radius = 4;

//바닥
const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: ObjColor,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -0.5;
scene.add(plane);
plane.receiveShadow = true;

// 매쉬
const geometry = new THREE.TorusGeometry(0.3, 0.15, 16, 40);

//MeshStandardMaterial 재질은 기본적인 재질
const material = new THREE.MeshStandardMaterial({
    color: 0xff7f00,
    metalness: 0.2, //돌이나 나무는 0, 메탈릭한 부분들은 1 로 표현
    roughness: 0.1, // 거칠기
    // transparent: true, // true로 해야 모든 색에서 opacity 0 이 됐을 때 보이지 않는다.
    // opacity: 0.3,
});
const obj = new THREE.Mesh(geometry, material);
obj.position.x = 0;
obj.position.y = 0.3;
// 만든 도형 scene 적용
scene.add(obj);
obj.castShadow = true;

function render(time) {
    time *= 0.0005;

    obj.rotation.y = time;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

// 반응형 처리
function canvasResize() {
    camera.aspect = info.winW / info.winH; // 종횡비
    camera.updateProjectionMatrix();
    renderer.setSize(info.winW, info.winH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', () => {
    info.render();
    canvasResize();
});
