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
camera.position.x = -35;
camera.position.y = 30;
camera.position.z = 25;
camera.lookAt(new THREE.Vector3(10, 0, 0));
scene.add(camera);

// レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// 床面
const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = -5;
plane.position.z = 0;
scene.add(plane);

// Cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMatelial = new THREE.MeshLambertMaterial({ color: 0xff3333 });
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

// ambient light
let ambiColor = "#1c1c1c";
const ambientLight = new THREE.AmbientLight(ambiColor);
scene.add(ambientLight);

// directional light
let directionalLightColor = "#ff5808";
const directionalLight = new THREE.DirectionalLight(directionalLightColor);
directionalLight.position.set(-40, 60, -10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.distance = 0;
directionalLight.intensity = 0.5;
directionalLight.target = plane;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.mapSize.width = 1024;
scene.add(directionalLight);

// Sphere Light
const sphereLightGeometry = new THREE.SphereGeometry(0.2);
const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 });
const sphereLight = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
sphereLight.castShadow = true;
sphereLight.position.set(new THREE.Vector3(3, 20, 3));
scene.add(sphereLight);

// Camera Helper
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
cameraHelper.visible = false;
scene.add(cameraHelper);

// GUI
const controls = new (function () {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.03;
  this.ambientColor = ambiColor;
  this.directionalLightColor = directionalLightColor;
  this.intensity = 0.5;
  this.distance = 0;
  this.penumbra = 30;
  this.angle = 0.1;
  this.debug = false;
  this.castShadow = true;
  this.target = "Plane";
})();

const gui = new dat.GUI();
gui.addColor(controls, "ambientColor").onChange(function (e) {
  ambientLight.color = new THREE.Color(e);
});
gui.addColor(controls, "directionalLightColor").onChange(function (e) {
  directionalLight.color = new THREE.Color(e);
});
gui.add(controls, "intensity", 0, 5).onChange(function (e) {
  directionalLight.intensity = e;
});
gui.add(controls, "distance", 0, 200).onChange(function (e) {
  directionalLight.distance = e;
});
gui.add(controls, "debug").onChange(function (e) {
  cameraHelper.visible = e;
});
gui.add(controls, "castShadow").onChange(function (e) {
  directionalLight.castShadow = e;
});
gui.add(controls, "target", ["Plane", "Sphere", "Cube"]).onChange(function (e) {
  console.log(e);
  switch (e) {
    case "Plane":
      directionalLight.target = plane;
      break;
    case "Sphere":
      directionalLight.target = sphere;
      break;
    case "Cube":
      directionalLight.target = cube;
      break;
  }
});

// レンダリング
renderScene();

let step = 0;

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
  sphereLight.position.z = -8;
  sphereLight.position.y = 27 * Math.sin(step / 3);
  sphereLight.position.x = 10 + 26 * Math.cos(step / 3);
  directionalLight.position.copy(sphereLight.position);

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
