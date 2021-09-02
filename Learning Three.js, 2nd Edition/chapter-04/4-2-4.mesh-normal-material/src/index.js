import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";

// 統計情報の追加
const stats = initStats();

// [Scene]シーンの作成
const scene = new THREE.Scene();

// [Camera]カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 30, 170);
camera.position.x = -50;
camera.position.y = 40;
camera.position.z = 50;
camera.lookAt(scene.position);
scene.add(camera);

// [Renderer]レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.sortObjects = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// [Gui]GUI
const controls = new (function () {
  this.cubeCount = scene.children.length - 1;
  this.cameraNear = camera.near;
  this.cameraFar = camera.far;
  this.rotationSpeed = 0.02;
  this.numberOfObjects = scene.children.length;
  this.color = 0x00ff00;

  this.removeCube = function () {
    const allChildren = scene.children;
    const lastObject = allChildren[allChildren.length - 1];
    if (lastObject instanceof THREE.Group) {
      scene.remove(lastObject);
      this.numberOfObjects = scene.children.length;
      this.cubeCount = scene.children.length - 1;
    }
  };
  this.addCube = function () {
    const cubeSize = Math.ceil(3 + Math.random() * 3);
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshDepthMaterial();
    // const colorMaterial = new THREE.MeshLambertMaterial({
    //   color: controls.color,
    //   transparent: true,
    //   blending: THREE.MultiplyBlending,
    // });
    const colorMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(controls.color),
      transparent: true,
      blending: THREE.MultiplyBlending,
    });
    const cube = SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial]);
    cube.children[1].scale.set(0.99, 0.99, 0.99);
    cube.castShadow = true;
    cube.position.x = -60 + Math.round(Math.random() * 100);
    cube.position.y = Math.round(Math.random() * 10);
    cube.position.z = -100 + Math.round(Math.random() * 150);
    cube.name = "Cube" + scene.children.length;
    scene.add(cube);
    this.numberOfObjects = scene.children.length;
    this.cubeCount = scene.children.length - 1;
  };
  this.outputObjects = function () {
    console.log(scene.children);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "cubeCount").listen();
gui.addColor(controls, "color");
gui.add(controls, "rotationSpeed", 0, 0.5);
gui.add(controls, "addCube");
gui.add(controls, "removeCube");
gui.add(controls, "cameraNear", 0, 50).onChange(function (e) {
  camera.near = e;
  camera.updateProjectionMatrix();
});
gui.add(controls, "cameraFar", 100, 300).onChange(function (e) {
  camera.far = e;
  camera.updateProjectionMatrix();
});
gui.add(controls, "outputObjects");

// キューブ初期配置
let i = 0;
while (i < 10) {
  console.log("Cube", i);
  controls.addCube();
  i++;
}

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  scene.traverse(function (e) {
    if (e instanceof THREE.Mesh) {
      e.rotation.x += controls.rotationSpeed;
      e.rotation.y += controls.rotationSpeed;
      e.rotation.z += controls.rotationSpeed;
    }
  });

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
