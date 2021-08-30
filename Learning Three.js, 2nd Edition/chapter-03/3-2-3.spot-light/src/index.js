import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { Sphere } from "three";

// 統計情報の追加
const stats = initStats();

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -25;
camera.position.y = 30;
camera.position.z = 25;
camera.lookAt(new THREE.Vector3(10, 0, 0));
scene.add(camera);

// レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// ambient light
let ambiColor = "#0c0c0c";
const ambientLight = new THREE.AmbientLight(ambiColor);
scene.add(ambientLight);

// spot light
// const spotLight = new THREE.SpotLight(0xffffff);
// spotLight.position.set(-40, 60, -10);
// spotLight.castShadow = true;
// scene.add(spotLight);

// point light
let pointColor = "#ccffcc";
const pointLight = new THREE.PointLight(pointColor);
pointLight.distance = 100;
scene.add(pointLight);

// 床面
const planeGeometry = new THREE.PlaneGeometry(60, 20, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = 0;
plane.position.z = 0;
scene.add(plane);

// Cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMatelial = new THREE.MeshLambertMaterial({ color: 0xff7777 });
const cube = new THREE.Mesh(cubeGeometry, cubeMatelial);
cube.castShadow = true;
cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;
scene.add(cube);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.x = 20;
sphere.position.y = 0;
sphere.position.z = 2;
scene.add(sphere);

// Sphere Light
const sphereLightGeometry = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
const sphereLight = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
sphereLight.castShadow = true;
sphereLight.position.set(new THREE.Vector3(3, 0, 3));
scene.add(sphereLight);

// GUI
const controls = new (function () {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.03;
  this.ambientColor = ambiColor;
  this.pointColor = pointColor;
  this.intensity = 1;
  this.distance = 100;
  this.decay = 1;
})();

const gui = new dat.GUI();
gui.addColor(controls, "ambientColor").onChange(function (e) {
  ambientLight.color = new THREE.Color(e);
});
gui.addColor(controls, "pointColor").onChange(function (e) {
  pointLight.color = new THREE.Color(e);
});
gui.add(controls, "intensity", 0, 3).onChange(function (e) {
  pointLight.intensity = e;
});
gui.add(controls, "distance", 0, 100).onChange(function (e) {
  pointLight.distance = e;
});
gui.add(controls, "decay", 1, 100).onChange(function (e) {
  pointLight.decay = e;
});

// レンダリング
renderScene();

let step = 0;
let invert = 1;
let phase = 0;

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // cube animation
  cube.rotation.x += controls.rotationSpeed;
  cube.rotation.y += controls.rotationSpeed;
  cube.rotation.z += controls.rotationSpeed;

  // sphere animation
  step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * Math.cos(step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

  // light animation(simulation)
  if (phase > 2 * Math.PI) {
    invert = invert * -1;
    phase -= 2 * Math.PI;
  } else {
    phase += controls.rotationSpeed;
  }
  sphereLight.position.z = 7 * Math.sin(phase);
  sphereLight.position.x = 14 * Math.cos(phase);
  sphereLight.position.y = 5;

  if (invert < 0) {
    const pivot = 14;
    sphereLight.position.x = invert * (sphereLight.position.x - pivot) + pivot;
  }

  pointLight.position.copy(sphereLight.position);

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
