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

// [Mesh]TorusKnot
const meshGeometry = new THREE.TorusKnotGeometry(10, 2, 200, 20);
const meshMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
mesh.position.set(0, 3, 2);
mesh.name = "TorusKnot";
scene.add(mesh);

// [Light]spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 30, 60);
spotLight.castShadow = true;
spotLight.intensity = 0.6;
scene.add(spotLight);

// [Gui]GUI
const controls = new (function () {
  this.opacity = meshMaterial.opacity;
  this.transparent = meshMaterial.transparent;
  this.visible = meshMaterial.visible;
  this.roughness = meshMaterial.roughness;
  this.metalness = meshMaterial.metalness;
  this.side = "front";
  this.flatShading = "smooth";
  this.color = meshMaterial.color.getStyle();
})();

const gui = new dat.GUI();
const spGui = gui.addFolder("Mesh");
spGui.add(controls, "opacity", 0, 1).onChange(function (e) {
  meshMaterial.opacity = e;
});
spGui.add(controls, "transparent").onChange(function (e) {
  meshMaterial.transparent = e;
});
spGui.add(controls, "visible", 0, 1).onChange(function (e) {
  meshMaterial.visible = e;
});
spGui.add(controls, "roughness", 0, 1.0).onChange(function (e) {
  meshMaterial.roughness = e;
});
spGui.add(controls, "metalness", 0, 1.0).onChange(function (e) {
  meshMaterial.metalness = e;
});
spGui.add(controls, "side", ["front", "back", "double"]).onChange(function (e) {
  switch (e) {
    case "front":
      meshMaterial.side = THREE.FrontSide;
      break;
    case "back":
      meshMaterial.side = THREE.BackSide;
      break;
    case "double":
      meshMaterial.side = THREE.DoubleSide;
      break;
    default:
      meshMaterial.side = THREE.FrontSide;
      break;
  }
  meshMaterial.needsUpdate = true;
});
spGui.add(controls, "flatShading", ["flat", "smooth"]).onChange(function (e) {
  console.log(e);
  switch (e) {
    case "flat":
      meshMaterial.flatShading = true;
      break;
    case "smooth":
      meshMaterial.flatShading = false;
      break;
  }
  meshMaterial.needsUpdate = true;
});
spGui.addColor(controls, "color").onChange(function (e) {
  meshMaterial.color.setStyle(e);
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
  mesh.rotation.y = step;

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
