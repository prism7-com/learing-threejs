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

// [Mesh] torus
let torus = createMesh(new THREE.RingGeometry());
scene.add(torus);

// [Gui]Gui
const controls = new (function () {
  this.innerRadius = 0;
  this.outerRadius = 50;
  this.thetaSegments = 8;
  this.phiSegments = 8;
  this.thetaStart = 0;
  this.thetaLength = Math.PI * 2;

  this.redraw = function () {
    scene.remove(torus);
    torus = createMesh(
      new THREE.RingGeometry(
        controls.innerRadius,
        controls.outerRadius,
        controls.thetaSegments,
        controls.phiSegments,
        controls.thetaStart,
        controls.thetaLength
      )
    );
    scene.add(torus);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "innerRadius", 0, 40).onChange(controls.redraw);
gui.add(controls, "outerRadius", 0, 100).onChange(controls.redraw);
gui.add(controls, "thetaSegments", 1, 40).step(1).onChange(controls.redraw);
gui.add(controls, "phiSegments", 1, 20).step(1).onChange(controls.redraw);
gui.add(controls, "thetaStart", 0, Math.PI * 2).onChange(controls.redraw);
gui.add(controls, "thetaLength", 0, Math.PI * 2).onChange(controls.redraw);

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
  const torus = SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMaterial]);
  return torus;
}

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
  torus.rotation.y = step;

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
