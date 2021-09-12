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

// [Mesh] polyhedron
let polyhedron = createMesh(new THREE.IcosahedronGeometry(10, 0));
scene.add(polyhedron);

// [Gui]Gui
const controls = new (function () {
  this.radius = 10;
  this.detail = 0;
  this.type = "Icosahedron";

  this.redraw = function () {
    scene.remove(polyhedron);
    switch (controls.type) {
      case "Icosahedron":
        polyhedron = createMesh(new THREE.IcosahedronGeometry(controls.radius, controls.detail));
        break;
      case "Tetrahedron":
        polyhedron = createMesh(new THREE.TetrahedronGeometry(controls.radius, controls.detail));
        break;
      case "Octahedron":
        polyhedron = createMesh(new THREE.OctahedronGeometry(controls.radius, controls.detail));
        break;
      case "Dodecahedron":
        polyhedron = createMesh(new THREE.DodecahedronGeometry(controls.radius, controls.detail));
        break;
      case "Custom":
        var vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];

        var indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];

        polyhedron = createMesh(new THREE.PolyhedronGeometry(vertices, indices, controls.radius, controls.detail));
        break;
    }
    scene.add(polyhedron);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "radius", 0, 40).step(1).onChange(controls.redraw);
gui.add(controls, "detail", 0, 3).step(1).onChange(controls.redraw);
gui.add(controls, "type", ["Icosahedron", "Tetrahedron", "Octahedron", "Dodecahedron", "Custom"]).onChange(controls.redraw);

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
  polyhedron.rotation.y = step;

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
