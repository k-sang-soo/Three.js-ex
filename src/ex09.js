import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { info } from './info.js';

info.render();

/**
 * Base
 */
const canvas = document.querySelector('.webgl');

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    35,
    info.winW / info.winH,
    0.1,
    1000,
);
camera.position.z = 5;
scene.add(camera);

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    //http://blog.302chanwoo.com/2016/08/shadermaterial1/ 참조
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
    uniforms: {
        uAlpha: {
            value: 1.0,
        },
    },
    transparent: true,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Loaders
 */
const loadingBar = document.querySelector('.loading_bar');
const loadingManager = new THREE.LoadingManager(
    () => {
        setTimeout(() => {
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 3,
                value: 0,
                delay: 1,
            });

            loadingBar.classList.add('ended');
            loadingBar.style.transform = '';
        }, 500);
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        const propgressRatio = itemsLoaded / itemsTotal;
        loadingBar.style.transform = `scaleX(${propgressRatio})`;
    },
    () => {
        console.log('error');
    },
);

/**
 * On Reload
 */
window.onbeforeunload = () => {
    window.scrollTo(0, 0);
};

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionaLight = new THREE.DirectionalLight(0xffffff, 1);
const dlHelper = new THREE.DirectionalLightHelper(
    directionaLight,
    1.5,
    0x0000ff,
);
directionaLight.position.set(1, 2, 0);
scene.add(directionaLight);
scene.add(dlHelper);

/**
 * GLTF Loader
 */
let donut = null;
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load('../static/gltf/donut/scene.gltf', (gltf) => {
    donut = gltf.scene;

    donut.rotation.x = Math.PI * 0.2;
    donut.rotation.z = Math.PI * 0.15;

    meshRender();
});

function meshRender() {
    let radius;
    let positionX;
    if (info.winW > 640) {
        radius = 6.5;
        positionX = 1.5;
    } else {
        radius = 4.5;
        positionX = 0;
    }
    donut.scale.set(radius, radius, radius);
    donut.position.x = positionX;
    scene.add(donut);
}

/**
 * Scroll
 */
const scrollInfo = {
    sec: null,
    position: {
        top: [],
        bottom: [],
    },
    ani: [],
    render() {
        this.sec = document.querySelectorAll('section');
        this.sec.forEach((el) => {
            const top = Math.floor(info.winY + el.getBoundingClientRect().top);
            const bottom = Math.floor(top + el.getBoundingClientRect().height);
            this.position.top.push(top);
            this.position.bottom.push(bottom);
        });
        this.ani = [];
        if (info.winW > 640) {
            console.log('??');
            this.ani.push(
                {
                    rotationZ: 0.45,
                    positionX: 1.5,
                },
                {
                    rotationZ: -0.45,
                    positionX: -1.5,
                },
                {
                    rotationZ: 0.0314,
                    positionX: 0,
                },
            );
        } else {
            this.ani.push(
                {
                    rotationZ: 0.45,
                    positionX: 0,
                },
                {
                    rotationZ: -0.45,
                    positionX: 0,
                },
                {
                    rotationZ: 0.0314,
                    positionX: 0,
                },
            );
        }
    },
};

scrollInfo.render();

window.addEventListener('scroll', () => {
    info.winY = window.pageYOffset;
    scrollAni(info.winY);
});

function scrollAni(winY) {
    scrollInfo.sec.forEach((v, idx) => {
        if (
            winY >= scrollInfo.position.top[idx] &&
            winY < scrollInfo.position.bottom[idx] - info.winH / 2
        ) {
            if (!!donut) {
                gsap.to(donut.rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    z: scrollInfo.ani[idx].rotationZ,
                });

                gsap.to(donut.position, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: scrollInfo.ani[idx].positionX,
                });
            }
        }
    });
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});

renderer.setSize(info.winW, info.winH);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

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
    scrollInfo.render();
    scrollAni(info.winY);
    meshRender();
});

/**
 * Animation
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
    // 디스플레이의 framerate에 구애받지 않고 의도한 대로 애니메이션을 출력해주기 위해서 우리는 '시간'을 기준으로 애니메이션을 실행
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastElapsedTime;
    lastElapsedTime = elapsedTime;

    if (!!donut) {
        donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
