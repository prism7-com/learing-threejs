import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";
import { Shape, Sphere } from "three";

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

// [Light]spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

// [Mesh] knot
let knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3, 1));
scene.add(knot);

// [Gui]Gui
const controls = new (function () {
  this.radius = knot.children[0].geometry.parameters.radius;
  this.tube = 0.3;
  this.radialSegments = 100;
  this.tubularSegments = 20;
  this.p = knot.children[0].geometry.parameters.p;
  this.q = knot.children[0].geometry.parameters.q;

  this.redraw = function () {
    scene.remove(knot);
    knot = createMesh(
      new THREE.TorusKnotGeometry(
        controls.radius,
        controls.tube,
        Math.round(controls.radialSegments),
        Math.round(controls.tubularSegments),
        Math.round(controls.p),
        Math.round(controls.q)
      )
    );
    scene.add(knot);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "radius", 0, 40).onChange(controls.redraw);
gui.add(controls, "tube", 0, 40).onChange(controls.redraw);
gui.add(controls, "radialSegments", 0, 400).step(1).onChange(controls.redraw);
gui.add(controls, "tubularSegments", 1, 20).step(1).onChange(controls.redraw);
gui.add(controls, "p", 1, 10).step(1).onChange(controls.redraw);
gui.add(controls, "q", 1, 15).step(1).onChange(controls.redraw);
let step = 0;

// レンダリング
renderScene();

/**
 * メッシュの作成
 * @param {Geometry} geometry
 */
function createMesh(geometry) {
  const meshMaterial = new THREE.MeshNormalMaterial();
  meshMaterial.side = THREE.DoubleSide;
  const wireFrameMaterial = new THREE.MeshBasicMaterial();
  wireFrameMaterial.wireframe = true;
  const knot = SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMaterial]);
  return knot;
}

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
  knot.rotation.y = step;

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
