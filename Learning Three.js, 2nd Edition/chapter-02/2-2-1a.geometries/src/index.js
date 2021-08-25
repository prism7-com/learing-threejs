import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";

// 統計情報の追加
const stats = initStats();

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -50;
camera.position.y = 30;
camera.position.z = 20;
camera.lookAt(new THREE.Vector3(-10, 0, 0));
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
var ambientLight = new THREE.AmbientLight(0x090909);
scene.add(ambientLight);

// spotlight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-25, 25, 32);
spotLight.castShadow = true;
scene.add(spotLight);

// Geometry Settings
addGeometries(scene);

document.getElementById("WebGL-output").appendChild(renderer.domElement);

function addGeometries(scene) {
  const geoms = [];

  // 円柱/シリンダー
  geoms.push(new THREE.CylinderGeometry(1, 4, 4));

  // 直方体
  geoms.push(new THREE.BoxGeometry(2, 2, 2));

  // 球/スフィア
  geoms.push(new THREE.SphereGeometry(2));

  // 正二十面体
  geoms.push(new THREE.IcosahedronGeometry(4));

  // 凸面体
  const points = [
    new THREE.Vector3(2, 2, 2),
    new THREE.Vector3(2, 2, -2),
    new THREE.Vector3(-2, 2, -2),
    new THREE.Vector3(-2, 2, 2),
    new THREE.Vector3(2, -2, 2),
    new THREE.Vector3(2, -2, -2),
    new THREE.Vector3(-2, -2, -2),
    new THREE.Vector3(-2, -2, 2),
  ];
  geoms.push(new ConvexGeometry(points));

  // 旋盤/回転体
  let pts = [];
  let detail = 0.1;
  let radius = 3;
  for (let angle = 0.0; angle < Math.PI; angle += detail) {
    pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  geoms.push(new THREE.LatheGeometry(pts, 12));

  // 正八面体
  geoms.push(new THREE.OctahedronGeometry(3));

  // パラメトリック（メビウスの輪）
  geoms.push(new THREE.ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));

  // 正四面体
  geoms.push(new THREE.TetrahedronGeometry(4));

  //　トーラス（ドーナッツ）
  geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

  //　トーラス結び目
  geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

  // ジオメトリへのマテリアルの設定と配置
  let j = 0;
  for (let i = 0; i < geoms.length; i++) {
    let materials = [
      new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, flatShading: true }),
      new THREE.MeshBasicMaterial({ color: Math.random() * 0x000000, wireframe: true }),
    ];
    let mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials);
    mesh.traverse(function (e) {
      e.castShadow = true;
    });

    mesh.position.x = -24 + (i % 4) * 12;
    mesh.position.y = 4;
    mesh.position.z = -8 + j * 12;

    if ((i + 1) % 4 === 0) {
      j++;
    }
    scene.add(mesh);
  }
}

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

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
