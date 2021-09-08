import * as THREE from "three";
import Stats from "stats.js";
import gosper from "./gosper";

// 統計情報の追加
const stats = initStats();

// [Scene]シーンの作成
const scene = new THREE.Scene();

// [Camera]カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);
scene.add(camera);

// [Renderer]レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// [Light] ambient light
var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// [Light]spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

// [Line] mesh
const points = gosper(4, 60);
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineDashedMaterial({
  vertexColors: true,
  color: 0xffffff,
  dashSize: 2,
  gapSize: 2,
  scale: 0.1,
});

const colors = [];
let i = 0;
points.forEach(function (e) {
  const color = new THREE.Color(0xffffff);
  color.setHSL(e.x / 100 + 0.5, (e.y * 20) / 300, 0.8);
  colors.push(color.r, color.g, color.b);
  i++;
});
lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const line = new THREE.Line(lineGeometry, lineMaterial);
line.computeLineDistances();
line.position.set(40, -70, -30);
scene.add(line);

let step = 0;

// レンダリング
renderScene();

/**
 * シーンのレンダリング（アニメーション）
 */
function renderScene() {
  stats.update();

  // mesh animation
  step += 0.01;
  line.rotation.y = step;

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
