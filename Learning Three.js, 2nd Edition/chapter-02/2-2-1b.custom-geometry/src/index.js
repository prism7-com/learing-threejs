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
camera.position.x = -20;
camera.position.y = 25;
camera.position.z = 20;
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
// var ambientLight = new THREE.AmbientLight(0x494949);
// scene.add(ambientLight);

// spotlight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-20, 30, 5);
spotLight.castShadow = true;
scene.add(spotLight);

document.getElementById("WebGL-output").appendChild(renderer.domElement);

// Mesh
const vertices = [
  new THREE.Vector3(1, 3, 1),
  new THREE.Vector3(1, 3, -1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(-1, 3, -1),
  new THREE.Vector3(-1, 3, 1),
  new THREE.Vector3(-1, -1, -1),
  new THREE.Vector3(-1, -1, 1),
];

const faces = [
  new Face3(0, 2, 1),
  new Face3(2, 3, 1),
  new Face3(4, 6, 5),
  new Face3(6, 7, 5),
  new Face3(4, 5, 1),
  new Face3(5, 0, 1),
  new Face3(7, 6, 2),
  new Face3(6, 3, 2),
  new Face3(5, 7, 0),
  new Face3(7, 2, 0),
  new Face3(1, 3, 4),
  new Face3(3, 6, 4),
];

const geom = new THREE.BufferGeometry();
geom.vertices = vertices;
geom.faces = faces;
geom.computeFaceNormals();

const materials = [
  new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
  new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
];

const mesh = SceneUtils.createMultiMaterialObject(geom, materials);
mesh.children.forEach(function (e) {
  e.castShadow = true;
});
scene.add(mesh);

// GUI
function addControl(x, y, z) {
  const controls = new (function () {
    this.x = x;
    this.y = y;
    this.z = z;
  })();
  return controls;
}

const controlPoints = [];
controlPoints.push(addControl(3, 5, 3));
controlPoints.push(addControl(3, 5, 0));
controlPoints.push(addControl(3, 0, 3));
controlPoints.push(addControl(3, 0, 0));
controlPoints.push(addControl(0, 5, 0));
controlPoints.push(addControl(0, 5, 3));
controlPoints.push(addControl(0, 0, 0));
controlPoints.push(addControl(0, 0, 3));

var gui = new dat.GUI();
gui.add(
  new (function () {
    this.clone = function () {
      const clonedGeometry = mesh.children[0].geometry.clone();
      const materials = [
        new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0xff44ff, transparent: true }),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
      ];

      const mesh2 = SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
      mesh2.children.forEach(function (e) {
        e.castShadow = true;
      });

      mesh2.translateX(5);
      mesh2.translateZ(5);
      mesh2.name = "clone";
      scene.remove(scene.getObjectByName("clone"));
      scene.add(mesh2);
    };
  })(),
  "clone"
);

for (let i = 0; i < 8; i++) {
  let f1 = gui.addFolder("Vertices " + (i + 1));
  f1.add(controlPoints[i], "x", -10, 10);
  f1.add(controlPoints[i], "y", -10, 10);
  f1.add(controlPoints[i], "z", -10, 10);
}

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  mesh.children.forEach(function (e) {
    for (let i = 0; i < 8; i++) {
      e.geometry.vertices[i].set(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z);
    }
    e.geometry.verticesNeedUpdate = true;
    e.geometry.computeFaceNormals();
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
