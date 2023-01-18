import * as THREE from 'three';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { info } from './info.js';
import { TextGeometry } from 'three/src/geometries/TextGeometry';

info.render();

const canvas = document.querySelector('#canvas');

const scene = new THREE.Scene();

const nearDist = 0.1;
const farDist = 10000;
const camera = new THREE.PerspectiveCamera(
    75,
    info.winW / info.winH,
    nearDist,
    farDist,
);
camera.position.x = farDist * -2;
camera.position.z = 500;
scene.add(camera);

console.log('farDist * -2', farDist * -2);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//scene의 background를 설정하지 않았다면 밑의 코드로 배경색을 정할수도 있습니다.
renderer.setClearColor('#4dd0E1');

const cubeSize = 120;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshNormalMaterial();

//scene 가운데를 표시
const axesHelper = new THREE.AxesHelper(5000);
scene.add(axesHelper);

const group = new THREE.Group();
for (let i = 0; i < 350; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    const dist = farDist / 3; // 3,333.333
    const distDouble = dist * 2; // 6,666.666
    const tau = 2 * Math.PI;

    mesh.position.x = Math.random() * distDouble - dist; // -3,333.333 ~ 3,333.333
    mesh.position.y = Math.random() * distDouble - dist;
    mesh.position.z = Math.random() * distDouble - dist;

    mesh.rotation.x = Math.random() * tau;
    mesh.rotation.y = Math.random() * tau;
    mesh.rotation.z = Math.random() * tau;

    // matrixAutoUpdate 링크 참조
    //https://threejs.org/docs/#manual/ko/introduction/Matrix-transformations
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    group.add(mesh);
}
scene.add(group);

const loader = new FontLoader();
const textMesh = new THREE.Mesh();
const createTypo = (font) => {
    const word = 'Spade Company';
    const typoProperties = {
        font: font,
        size: cubeSize, //폰트 사이즈
        height: cubeSize / 2, // 돌출 되는 길이?
        curveSegments: 12, // 각 폰트들의 가장자리 어느정도 둥글게 처리 할 것인지
        bevelEnabled: true,
        bevelThickness: 10, // 각 폰트들의 돌출 되는 길이?
        bevelSize: 6, // 각 폰트들의 윤곽선 크기
        bevelOffset: 1, //letter spacing 라고 생각해야 될 듯?
        bevelSegments: 8, // 폰트들 경사 깍임 정도?
    };

    const text = new TextGeometry(word, typoProperties);
    textMesh.geometry = text;
    textMesh.material = material;
    textMesh.position.x = -cubeSize * 2;
    textMesh.position.z = cubeSize * 2;
    scene.add(textMesh);
};
loader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    createTypo,
);

let mouseX = 0;
let mouseY = 0;
const mouseFX = {
    windowHalfX: info.winW / 2,
    windowHalfY: info.winH / 2,
    coordinates: function (coordX, coordY) {
        // mouseX : -6600 ~ 6600
        mouseX = (coordX - mouseFX.windowHalfX) * 10;
        mouseY = (coordY - mouseFX.windowHalfY) * 10;
    },
    onMouseMove: function (e) {
        mouseFX.coordinates(e.clientX, e.clientY);
    },
    onTouchMove: function (e) {
        mouseFX.coordinates(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY,
        );
    },
};

document.addEventListener('mousemove', mouseFX.onMouseMove, false);
document.addEventListener('touchmove', mouseFX.onTouchMove, false);

// 반응형 처리
function canvasResize() {
    camera.aspect = info.winW / info.winH; // 종횡비
    camera.updateProjectionMatrix();
    renderer.setSize(info.winW, info.winH);
}

function FixedResizeBug(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

window.addEventListener('resize', () => {
    info.render();
    canvasResize();
});

function render() {
    // camera.position.x : -6600 ~ 6600
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    const t = Date.now() * 0.001;
    const rx = Math.sin(t * 0.7) * 0.5;
    const ry = Math.sin(t * 0.3) * 0.5;
    const rz = Math.sin(t * 0.2) * 0.5;

    group.rotation.x = rx;
    group.rotation.y = ry;
    group.rotation.z = rz;

    textMesh.rotation.x = rx;
    textMesh.rotation.y = ry;
    textMesh.rotation.z = rz;

    if (FixedResizeBug(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
