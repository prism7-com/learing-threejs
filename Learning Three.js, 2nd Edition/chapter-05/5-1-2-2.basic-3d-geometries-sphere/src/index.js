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

// [Light]spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

// [Mesh] sphere
let sphere = createMesh(new THREE.SphereGeometry(4, 10, 10));
scene.add(sphere);

// [Gui]Gui
const controls = new (function () {
  this.radius = sphere.children[0].geometry.parameters.radius;
  this.widthSegments = sphere.children[0].geometry.parameters.widthSegments;
  this.heightSegments = sphere.children[0].geometry.parameters.heightSegments;
  this.phiStart = 0;
  this.phiLength = Math.PI * 2;
  this.thetaStart = 0;
  this.thetaLength = Math.PI;

  this.redraw = function () {
    // remove the old plane
    scene.remove(sphere);
    // create a new one
    sphere = createMesh(
      new THREE.SphereGeometry(
        controls.radius,
        controls.widthSegments,
        controls.heightSegments,
        controls.phiStart,
        controls.phiLength,
        controls.thetaStart,
        controls.thetaLength
      )
    );
    // add it to the scene.
    scene.add(sphere);
  };
})();

const gui = new dat.GUI();
gui.add(controls, "radius", 0, 40).onChange(controls.redraw);
gui.add(controls, "widthSegments", 0, 20).onChange(controls.redraw);
gui.add(controls, "heightSegments", 0, 20).onChange(controls.redraw);
gui.add(controls, "phiStart", 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, "phiLength", 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, "thetaStart", 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, "thetaLength", 0, 2 * Math.PI).onChange(controls.redraw);

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
  const sphere = SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMaterial]);
  return sphere;
}

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
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
