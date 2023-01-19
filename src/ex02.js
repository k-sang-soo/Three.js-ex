import * as THREE from 'three';
import { info } from './info.js';

info.render();

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFF');

// 카메라
const camera = new THREE.PerspectiveCamera(
    75,
    info.winW / info.winH,
    0.1,
    1000,
);
camera.position.z = 3;

// 캔버스
const canvas = document.querySelector('#canvas');

// 렌더러
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 빛
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 12);
scene.add(pointLight);

// 매쉬
const geometry = new THREE.TorusGeometry(0.3, 0.15, 16, 40);
const material01 = new THREE.MeshBasicMaterial({
    color: 0xff7f00,
});
// 프로퍼티들은 밖에서도 사용 가능
material01.wireframe = true;
const obj01 = new THREE.Mesh(geometry, material01);
obj01.position.x = -2;
// 만든 도형 scene 적용
scene.add(obj01);

//MeshStandardMaterial 재질은 기본적인 재질
const material02 = new THREE.MeshStandardMaterial({
    color: 0xff7f00,
    metalness: 0.2, //돌이나 나무는 0, 메탈릭한 부분들은 1 로 표현
    roughness: 0.1, // 거칠기
    // transparent: true, // true로 해야 모든 색에서 opacity 0 이 됐을 때 보이지 않는다.
    // opacity: 0.3,
});
const obj02 = new THREE.Mesh(geometry, material02);
obj02.position.x = -1;
// 만든 도형 scene 적용
scene.add(obj02);

const material03 = new THREE.MeshLambertMaterial({
    color: 0xff7f00,
});
const obj03 = new THREE.Mesh(geometry, material03);
obj03.position.x = 0;
// 만든 도형 scene 적용
scene.add(obj03);

//MeshBasicMaterial 빛 관련 된 재질
const material04 = new THREE.MeshPhongMaterial({
    color: 0xff7f00,
    shininess: 20, // 빛이 반사되는 세기
    specular: 0x004fff, // 빛이 번사되는 주변 광 색상
});
const obj04 = new THREE.Mesh(geometry, material04);
obj04.position.x = 1;
// 만든 도형 scene 적용
scene.add(obj04);

//MeshPhysicalMaterial 는 MeshStandardMaterial에서 좀 더 많은 기능들이 존재하는 재질
const material05 = new THREE.MeshPhysicalMaterial({
    color: 0xff7f00,
    clearcoat: 1, //자동차 코팅과 비슷한 기능
    clearcoatRoughness: 0.3, // clearcoat 세기
});
const obj05 = new THREE.Mesh(geometry, material05);
obj05.position.x = 2;
// 만든 도형 scene 적용
scene.add(obj05);

function render(time) {
    time *= 0.0005;

    obj01.rotation.y = time;
    obj02.rotation.y = time;
    obj03.rotation.y = time;
    obj04.rotation.y = time;
    obj05.rotation.y = time;

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
