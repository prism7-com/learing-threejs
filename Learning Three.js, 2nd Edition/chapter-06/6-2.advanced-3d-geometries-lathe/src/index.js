import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

// 統計情報の追加
const stats = initStats();

// [Scene]シーンの作成
const scene = new THREE.Scene();

// [Camera]カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 50;
camera.lookAt(new THREE.Vector3(10, 0, 0));
scene.add(camera);

// [Renderer]レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

let spGroup;
let hullMesh;
generatePoints();

// [Gui]Gui
const controls = new (function () {
  this.redraw = function () {
    scene.remove(spGroup);
    scene.remove(hullMesh);
    generatePoints();
  };
})();

const gui = new dat.GUI();
gui.add(controls, "redraw");

let step = 0;

// レンダリング
renderScene();

function generatePoints() {
  const points = [];
  for (let i = 0; i < 20; i++) {
    const randomX = -15 + Math.round(Math.random() * 30);
    const randomY = -15 + Math.round(Math.random() * 30);
    const randomZ = -15 + Math.round(Math.random() * 30);

    points.push(new THREE.Vector3(randomX, randomY, randomZ));
  }

  spGroup = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });
  points.forEach(function (point) {
    const spGeom = new THREE.SphereGeometry(0.2);
    const spMesh = new THREE.Mesh(spGeom, material);
    spMesh.position.copy(point);
    spGroup.add(spMesh);
  });
  scene.add(spGroup);

  const hullGeometry = new ConvexGeometry(points);
  hullMesh = createMesh(hullGeometry);
  scene.add(hullMesh);
}

/**
 * メッシュの作成
 * @param {Geometry} geometry
 */
function createMesh(geometry) {
  const meshMaterial = new THREE.MeshNormalMaterial();
  meshMaterial.side = THREE.DoubleSide;
  const wireFrameMaterial = new THREE.MeshBasicMaterial();
  wireFrameMaterial.wireframe = true;
  const polyhedron = SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMaterial]);
  return polyhedron;
}

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
  spGroup.rotation.y = step;
  hullMesh.rotation.y = step;

  // requestAnimationFrameを利用してレンダリング（レンダリングタイミングをブラウザに任せる）
  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
}

/**
 * 統計情報の初期化
 * @returns 初期化済みの統計情報コンポーネント
 */
function initStats() {
  const stats = new Stats();
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
