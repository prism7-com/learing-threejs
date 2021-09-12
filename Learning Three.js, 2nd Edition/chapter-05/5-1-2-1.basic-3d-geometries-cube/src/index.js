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
camera.position.y = 70;
camera.position.z = 70;
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

// [Mesh] shape
let shape = createMesh(new THREE.ShapeGeometry(drawShape()));
scene.add(shape);

// [Gui]Gui
const controls = new (function () {
  this.asGeom = function () {
    // remove the old plane
    scene.remove(shape);
    // create a new one
    shape = createMesh(new THREE.ShapeGeometry(drawShape()));
    // add it to the scene.
    scene.add(shape);
  };

  this.asPoints = function () {
    // remove the old plane
    scene.remove(shape);
    // create a new one
    shape = createLine(drawShape(), false);
    // add it to the scene.
    scene.add(shape);
  };

  this.asSpacedPoints = function () {
    // remove the old plane
    scene.remove(shape);
    // create a new one
    shape = createLine(drawShape(), true);
    // add it to the scene.
    scene.add(shape);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "asGeom");
gui.add(controls, "asPoints");
gui.add(controls, "asSpacedPoints");

let step = 0;

// レンダリング
renderScene();

/**
 * シェイプの描画
 */
function drawShape() {
  const shape = new THREE.Shape();
  shape.moveTo(10, 10);
  shape.lineTo(10, 40);
  shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
  shape.splineThru([new THREE.Vector2(32, 30), new THREE.Vector2(28, 20), new THREE.Vector2(30, 10)]);
  shape.quadraticCurveTo(20, 15, 10, 10);

  var hole1 = new THREE.Path();
  hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
  shape.holes.push(hole1);
  const hole2 = new THREE.Path();
  hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
  shape.holes.push(hole2);

  const hole3 = new THREE.Path();
  hole3.absarc(20, 16, 2, 0, Math.PI, true);
  shape.holes.push(hole3);

  return shape;
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
  const shape = SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMaterial]);
  return shape;
}

/**
 * 線の作成
 * @param {Shape} shape
 * @param {*} spaced
 * @returns
 */
function createLine(shape, spaced) {
  if (!spaced) {
    const points = shape.getPoints(10);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const mesh = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0xff3333,
        linewidth: 2,
      })
    );
    return mesh;
  } else {
    const points = shape.getSpacedPoints(5);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const mesh = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0xff3333,
        linewidth: 2,
      })
    );
    return mesh;
  }
}

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
  shape.rotation.y = step;

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
