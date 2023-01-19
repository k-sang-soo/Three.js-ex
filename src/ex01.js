import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { info } from './info.js';

info.render();

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// 카메라
const camera = new THREE.PerspectiveCamera(
    75,
    info.winW / info.winH,
    0.1,
    1000,
);
camera.position.set(0, 1, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 캔버스
const canvas = document.querySelector('#canvas');

// 렌더러
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true, // 끝 처리를 더 부드럽게 해줌
});
renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
// 컨트롤 줌 인, 줌 아웃 최소,최댓 값 설정
controls.minDistance = 2;
controls.maxDistance = 5;
// 컨트롤 각도 최소, 최댓 값 설정
controls.maxPolarAngle = Math.PI / 2; // 아래로 내렸을 때  * Math.PI / 2 를 사용하면 절반 정도에서 멈춘다.
// controls.minPolarAngle = 2; // 위로 올릴 때

controls.update();

// 그림자 추가
// 그림자는 3가지 단계가 필요함
// castShadow : 그람자를 표현할 해당 도형 / 빛에도 동일하게 넣으면 됨 * 빛의 유형에 따라 그림자가 안 생길수도 있음
// receiveShadow: 그림자를 받아줄 도형
renderer.shadowMap.enabled = true;

// 매쉬
const geometry01 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material01 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
});
const obj01 = new THREE.Mesh(geometry01, material01);
obj01.position.x = -1;
// 만든 도형 scene 적용
scene.add(obj01);

const geometry02 = new THREE.ConeGeometry(0.4, 0.7, 6);
const material02 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
});
const obj02 = new THREE.Mesh(geometry02, material02);
// 만든 도형 scene 적용
scene.add(obj02);
obj02.castShadow = true;

const geometry03 = new THREE.IcosahedronGeometry(0.4, 0);
const material03 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
});
const obj03 = new THREE.Mesh(geometry03, material03);
obj03.position.x = 1;
// 만든 도형 scene 적용
scene.add(obj03);

//바닥 추가
const planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -0.5;
scene.add(plane);
plane.receiveShadow = true;

// 빛

//AmbientLight 은 전역에 빛을 밝힌다. 그림자 x
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

//directionalLight 은 특정 위치에 빛을 밝혀준다. 그림자 o
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//dlHelper 빛의 방향이 어디에 있는 지 알려준다.
const dlHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.5,
    0x0000ff,
);
// scene.add(dlHelper);
// scene.add(directionalLight);

// 위 아래에서 빛이 나오게 한다.
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 1);
// scene.add(hemisphereLight);

// 전구처럼 특정 공간에 빛을 밝혀준다. 그림자 o
const pointLight = new THREE.PointLight(0xffffff, 1);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);
// scene.add(pointLight);
pointLight.position.set(-3, 0.5, 0);

const pointLight2 = new THREE.PointLight(0xffffff, 1);
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 0.2);
// scene.add(pointLightHelper2);
// scene.add(pointLight2);
pointLight2.position.set(3, 0.5, 0);

//원뿔형 모양으로 빛을 밝혀준다. 그림자 x
const rectLight = new THREE.RectAreaLight(0xffffff, 3, 1, 1);
// const rectLightHelper = new THREE.RectAreaLightHelper(rectLight); //RectAreaLightHelper 은 따로 작성해야된다 검색 ㄱㄱ
// rectLight.add(rectLightHelper);
// scene.add(rectLight);
rectLight.position.set(0.5, 0.5, 1);
rectLight.lookAt(0, 0, 0);

// 명확하게 그 위치를 밝혀줌 , 그림자 o
const spotLight = new THREE.SpotLight(0xffffff, 0.5);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048; // 그림자의 선명도를 높이는 방법, 숫자를 높이면 높일 수록 선명해진다. 대신 리소스를 많이 잡아 먹음
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.radius = 8; // 그림자의 번짐 조정

function render(time) {
    time *= 0.001;

    obj01.rotation.y = time;
    obj02.rotation.y = time;
    obj03.rotation.y = time;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

// 반응형 처리
function canvasResize() {
    camera.aspect = info.winW / info.winH; // 종횡비
    camera.updateProjectionMatrix(); //카메라에 어떤 파라미터라도 변경되면 이 함수를 써야함
    renderer.setSize(info.winW, info.winH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', () => {
    info.render();
    canvasResize();
});
