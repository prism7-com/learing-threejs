import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";

// 統計情報の追加
const stats = initStats();

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 120;
camera.position.y = 60;
camera.position.z = 180;
camera.lookAt(scene.position);
scene.add(camera);

// レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 床面
const planeGeometry = new THREE.PlaneGeometry(180, 180);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;
scene.add(plane);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-20, 40, 60);
scene.add(directionalLight);

// ambient light
var ambientLight = new THREE.AmbientLight(0x292929);
scene.add(ambientLight);

document.getElementById("WebGL-output").appendChild(renderer.domElement);

// Cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
for (let j = 0; j < planeGeometry.parameters.height / 5; j++) {
  for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
    const rnd = Math.random() * 0.75 + 0.25;
    const cubeMatelial = new THREE.MeshLambertMaterial({ color: new THREE.Color(rnd, 0, 0) });
    const cube = new THREE.Mesh(cubeGeometry, cubeMatelial);
    cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + j * 5;
    cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + i * 5;
    cube.position.y = 2;
    scene.add(cube);
  }
}

// GUI
const controls = new (function () {
  this.perspective = "Perspective";
  this.switchCamera = function () {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
      camera.position.x = 120;
      camera.position.y = 60;
      camera.position.z = 180;
      camera.lookAt(scene.position);
      this.perspective = "Orthographic";
    } else {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.x = 120;
      camera.position.y = 60;
      camera.position.z = 180;
      camera.lookAt(scene.position);
      this.perspective = "Perspective";
    }
  };
})();

const gui = new dat.GUI();
gui.add(controls, "switchCamera");
gui.add(controls, "perspective").listen();

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // requestAnimationFrameを利用してレンダリング（レンダリングタイミングをブラウザに任せる）
  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

/**
 * 統計情報の初期化
 * @returns 初期化済みの統計情報コンポーネント
 */
function initStats() {
  var stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";

  document.getElementById("Stats-output").appendChild(stats.domElement);

  return stats;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize, false);
