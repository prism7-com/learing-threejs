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
let tubeMesh;

// [Gui]Gui
const controls = new (function () {
  this.numberOfPoints = 5;
  this.segments = 64;
  this.radius = 1;
  this.radiusSegments = 8;
  this.closed = false;
  this.taper = "no taper";
  this.points = [];

  this.newPoints = function () {
    const points = [];
    for (let i = 0; i < controls.numberOfPoints; i++) {
      const randomX = -20 + Math.round(Math.random() * 50);
      const randomY = -15 + Math.round(Math.random() * 40);
      const randomZ = -20 + Math.round(Math.random() * 40);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
    controls.points = points;
    controls.redraw();
  };

  this.redraw = function () {
    const taper = controls.taper === "sinusoidal" ? THREE.TubeGeometry.SinusoidalTaper : THREE.TubeGeometry.NoTaper;
    scene.remove(spGroup);
    scene.remove(tubeMesh);
    generatePoints(controls.points, controls.segments, controls.radius, controls.radiusSegments, controls.closed, taper);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "newPoints");
gui.add(controls, "numberOfPoints", 2, 15).step(1).onChange(controls.newPoints);
gui.add(controls, "segments", 1, 200).step(1).onChange(controls.redraw);
gui.add(controls, "radius", 0, 10).onChange(controls.redraw);
gui.add(controls, "radiusSegments", 1, 100).step(1).onChange(controls.redraw);
gui.add(controls, "closed").onChange(controls.redraw);
gui.add(controls, "taper", ["no taper", "sinusoidal"]).onChange(controls.redraw);

let step = 0;

controls.newPoints();
// レンダリング
renderScene();

function generatePoints(points, segments, radius, radiusSegments, closed, taper) {
  spGroup = new THREE.Object3D();
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false });
  points.forEach(function (point) {
    const spGeom = new THREE.SphereGeometry(0.2);
    const spMesh = new THREE.Mesh(spGeom, material);
    spMesh.position.copy(point);
    spGroup.add(spMesh);
  });
  scene.add(spGroup);

  const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments, closed, taper);
  tubeMesh = createMesh(tubeGeometry);
  scene.add(tubeMesh);
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
  tubeMesh.rotation.y = step;

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
