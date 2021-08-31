import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import image from "../../../assets/textures/ground/grasslight-big.jpg";

// 統計情報の追加
const stats = initStats();

// シーンの作成
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200);

// カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -20;
camera.position.y = 15;
camera.position.z = 45;
camera.lookAt(new THREE.Vector3(10, 0, 0));
scene.add(camera);

// レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// 床面のテクスチャ
const textureLoader = new THREE.TextureLoader();
const textureGrass = textureLoader.load(image);
textureGrass.wrapS = THREE.RepeatWrapping;
textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set(4, 4);

// 床面
const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = 0;
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
const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.x = 10;
sphere.position.y = 5;
sphere.position.z = 10;
scene.add(sphere);

// ambient light
let ambiColor = "#1c1c1c";
const ambientLight = new THREE.AmbientLight(ambiColor);
scene.add(ambientLight);

// spot light
const spotLight = new THREE.SpotLight(0xcccccc);
spotLight.position.set(-40, 60, -10);
spotLight.lookAt(plane);
scene.add(spotLight);

// hemi light
const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

// directional light
let directionalLightColor = "#ffffff";
const directionalLight = new THREE.DirectionalLight(directionalLightColor);
directionalLight.position.set(30, 10, -50);
directionalLight.castShadow = true;
directionalLight.target = plane;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.mapSize.width = 1024;
scene.add(directionalLight);

// GUI
const controls = new (function () {
  this.rotationSpeed = 0.02;
  this.bouncingSpeed = 0.03;
  this.hemisphere = true;
  this.color = 0x00ff00;
  this.skyColor = 0x0000ff;
  this.intensity = 0.5;
})();

const gui = new dat.GUI();
gui.add(controls, "hemisphere").onChange(function (e) {
  if (!e) {
    hemiLight.intensity = 0;
  } else {
    hemiLight.intensity = controls.intensity;
  }
});
gui.addColor(controls, "color").onChange(function (e) {
  hemiLight.groundColor = new THREE.Color(e);
});
gui.addColor(controls, "skyColor").onChange(function (e) {
  hemiLight.color = new THREE.Color(e);
});
gui.add(controls, "intensity", 0, 5).onChange(function (e) {
  directionalLight.intensity = e;
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
