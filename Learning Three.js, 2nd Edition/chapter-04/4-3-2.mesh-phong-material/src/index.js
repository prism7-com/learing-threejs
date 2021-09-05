import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";

// 統計情報の追加
const stats = initStats();

// [Scene]シーンの作成
const scene = new THREE.Scene();

// [Camera]カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -20;
camera.position.y = 30;
camera.position.z = 40;
camera.lookAt(new THREE.Vector3(10, 0, 0));
scene.add(camera);

// [Renderer]レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// [Mesh]床面
const groundGeometry = new THREE.PlaneGeometry(100, 100, 4, 4);
const ground = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({ color: 0x555555 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -20;
ground.name = "Ground";
scene.add(ground);

// [Mesh]Sphere/Cube/Plane
const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);
const meshMatelial = new THREE.MeshLambertMaterial({ color: 0x7777ff });

const sphere = new THREE.Mesh(sphereGeometry, meshMatelial);
const cube = new THREE.Mesh(cubeGeometry, meshMatelial);
const plane = new THREE.Mesh(planeGeometry, meshMatelial);

sphere.position.x = 0;
sphere.position.y = 3;
sphere.position.z = 2;
cube.position.x = 0;
cube.position.y = 3;
cube.position.z = 2;
plane.position.x = 0;
plane.position.y = 3;
plane.position.z = 2;
sphere.name = "Sphere";
cube.name = "Cube";
plane.name = "Plane";
scene.add(cube);

// [Light]ambient light
const ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// [Light]spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;
scene.add(spotLight);

// [Gui]GUI
const controls = new (function () {
  this.opacity = meshMatelial.opacity;
  this.transparent = meshMatelial.transparent;
  this.visible = meshMatelial.visible;
  this.emissive = meshMatelial.emissive.getHex();
  this.side = "front";
  this.color = meshMatelial.color.getStyle();
  this.selectionMesh = "cube";
})();

const gui = new dat.GUI();
const spGui = gui.addFolder("Mesh");
spGui.add(controls, "opacity", 0, 1).onChange(function (e) {
  meshMatelial.opacity = e;
});
spGui.add(controls, "transparent", 0, 1).onChange(function (e) {
  meshMatelial.transparent = e;
});
spGui.add(controls, "emissive", 0, 1).onChange(function (e) {
  meshMatelial.emissive = new THREE.Color(e);
});
spGui.add(controls, "visible", 0, 1).onChange(function (e) {
  meshMatelial.visible = e;
});
spGui.add(controls, "side", ["front", "back", "double"]).onChange(function (e) {
  switch (e) {
    case "front":
      meshMatelial.side = THREE.FrontSide;
      break;
    case "back":
      meshMatelial.side = THREE.BackSide;
      break;
    case "double":
      meshMatelial.side = THREE.DoubleSide;
      break;
    default:
      meshMatelial.side = THREE.FrontSide;
      break;
  }
  meshMatelial.needsUpdate = true;
});
spGui.addColor(controls, "color").onChange(function (e) {
  meshMatelial.color.setStyle(e);
});
spGui.add(controls, "selectionMesh", ["cube", "sphere", "plane"]).onChange(function (e) {
  scene.remove(cube);
  scene.remove(sphere);
  scene.remove(plane);

  switch (e) {
    case "cube":
      scene.add(cube);
      break;
    case "sphere":
      scene.add(sphere);
      break;
    case "plane":
      scene.add(plane);
      break;
    default:
      scene.add(cube);
      break;
  }
});

let step = 0;

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
  cube.rotation.y = step;
  plane.rotation.y = step;
  sphere.rotation.y = step;

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
