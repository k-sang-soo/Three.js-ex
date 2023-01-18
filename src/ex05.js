import * as THREE from '../node_modules/three/build/three.module.js';
import {info} from './info.js'
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js"

info.render();

const FogColor = '#eaeaea';
const ObjColor = 0xffffff;
const FloorColor = 0xeeeeee;

// 장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(FloorColor);
// 안개
// scene.fog = new THREE.Fog(FogColor, 1, 8); // 파라미터 (색상, 거리 가까운, 거리 멀음) ;
// scene.fog = new THREE.FogExp2(FogColor, 0.3); // scene에 전체적으로 적용

//scene 가운데를 표시
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

// 카메라
const camera = new THREE.PerspectiveCamera(75, info.winW / info.winH, 0.1, 4000);
camera.position.set(0, 20, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));


// 캔버스
const canvas = document.querySelector('#canvas');

// 렌더러
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(info.winW, info.winH);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabledDamping = true;
controls.minDistance = 40;
controls.maxDistance = 800;
controls.update();

const skyMaterialArray = [];
const texture_ft = new THREE.TextureLoader().load('../src/img/bay_ft.jpg');
const texture_bk = new THREE.TextureLoader().load('../src/img/bay_bk.jpg');
const texture_up = new THREE.TextureLoader().load('../src/img/bay_up.jpg');
const texture_dn = new THREE.TextureLoader().load('../src/img/bay_dn.jpg');
const texture_rt = new THREE.TextureLoader().load('../src/img/bay_rt.jpg');
const texture_lf = new THREE.TextureLoader().load('../src/img/bay_lf.jpg');
skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
        map: texture_ft,
    })
)
skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
        map: texture_bk,
    })
)
skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
        map: texture_up,
    })
)
skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
        map: texture_dn,
    })
)
skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
        map: texture_rt,
    })
)
skyMaterialArray.push(
    new THREE.MeshStandardMaterial({
        map: texture_lf,
    })
)

for(let i = 0; i < 6; i++) {
    skyMaterialArray[i].side = THREE.BackSide;
}

// 빛
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
scene.add(ambientLight);

//바닥
const skyGeometry = new THREE.BoxGeometry(2400, 2400, 2400);
// const skyMaterial = new THREE.MeshStandardMaterial({
//     // color: 0x333333,
//     map: texture,
// });
const sky = new THREE.Mesh(skyGeometry, skyMaterialArray);
scene.add(sky);

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

render();

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