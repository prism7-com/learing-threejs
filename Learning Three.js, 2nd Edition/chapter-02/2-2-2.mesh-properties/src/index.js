import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";
import { Face3 } from "three/examples/jsm/deprecated/Geometry";

// 統計情報の追加
const stats = initStats();

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(new THREE.Vector3(5, 0, 0));
scene.add(camera);

// レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 床面
const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;
scene.add(plane);

// ambient light
var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// spotlight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-20, 30, 10);
spotLight.castShadow = true;
scene.add(spotLight);

document.getElementById("WebGL-output").appendChild(renderer.domElement);

// Cube
const controls = new (function () {
  this.scaleX = 1;
  this.scaleY = 1;
  this.scaleZ = 1;

  this.positionX = 0;
  this.positionY = 0;
  this.positionZ = 0;

  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;

  this.scale = 1;

  this.translateX = 0;
  this.translateY = 0;
  this.translateZ = 0;

  this.visible = true;

  this.translate = function () {
    cube.translateX(controls.translateX);
    cube.translateY(controls.translateY);
    cube.translateZ(controls.translateZ);

    this.positionX = cube.position.x;
    this.positionY = cube.position.y;
    this.positionZ = cube.position.z;
  };
})();

const matelial = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
const geom = new THREE.BoxGeometry(5, 8, 3);
const cube = new THREE.Mesh(geom, matelial);
cube.position.y = 4;
cube.castShadow = true;
scene.add(cube);

// GUI
const gui = new dat.GUI();

const guiScale = gui.addFolder("scale");
guiScale.add(controls, "scaleX", 0, 5);
guiScale.add(controls, "scaleY", 0, 5);
guiScale.add(controls, "scaleZ", 0, 5);

const guiPosition = gui.addFolder("potision");
const contX = guiPosition.add(controls, "positionX", -10, 10);
const contY = guiPosition.add(controls, "positionY", -4, 20);
const contZ = guiPosition.add(controls, "positionZ", -10, 10);

contX.listen();
contX.onChange(function () {
  cube.position.x = controls.positionX;
});
contY.listen();
contY.onChange(function () {
  cube.position.y = controls.positionY;
});
contZ.listen();
contZ.onChange(function () {
  cube.position.z = controls.positionZ;
});

const guiRotation = gui.addFolder("rotation");
guiRotation.add(controls, "rotationX", -4, 4);
guiRotation.add(controls, "rotationY", -4, 4);
guiRotation.add(controls, "rotationZ", -4, 4);

const guiTranslate = gui.addFolder("translate");
guiTranslate.add(controls, "translateX", -10, 10);
guiTranslate.add(controls, "translateY", -10, 10);
guiTranslate.add(controls, "translateZ", -10, 10);
guiTranslate.add(controls, "translate");

gui.add(controls, "visible");

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  cube.visible = controls.visible;
  cube.rotation.x = controls.rotationX;
  cube.rotation.y = controls.rotationY;
  cube.rotation.z = controls.rotationZ;

  cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

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
