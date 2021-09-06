import * as THREE from "three";
import Stats from "stats.js";
import * as dat from "dat.gui";
import vertexShader from "./shader/vertex-shader.vert";
import fragmentShader1 from "./shader/fragment-shader-1.frag";
import fragmentShader2 from "./shader/fragment-shader-2.frag";
import fragmentShader3 from "./shader/fragment-shader-3.frag";
import fragmentShader4 from "./shader/fragment-shader-4.frag";
import fragmentShader5 from "./shader/fragment-shader-5.frag";
import fragmentShader6 from "./shader/fragment-shader-6.frag";

// 統計情報の追加
const stats = initStats();

// [Scene]シーンの作成
const scene = new THREE.Scene();

// [Camera]カメラの作成
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 30;
camera.position.y = 30;
camera.position.z = 30;
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// [Renderer]レンダラ
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("WebGL-output").appendChild(renderer.domElement);

// [Mesh]床面
// const groundGeometry = new THREE.PlaneGeometry(100, 100, 4, 4);
// const ground = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({ color: 0x555555 }));
// ground.rotation.x = -Math.PI / 2;
// ground.position.y = -20;
// ground.name = "Ground";
// scene.add(ground);

// [Mesh]Sphere/Cube/Plane
const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
const meshMaterial1 = new createMaterial(vertexShader, fragmentShader1);
const meshMaterial2 = new createMaterial(vertexShader, fragmentShader2);
const meshMaterial3 = new createMaterial(vertexShader, fragmentShader3);
const meshMaterial4 = new createMaterial(vertexShader, fragmentShader4);
const meshMaterial5 = new createMaterial(vertexShader, fragmentShader5);
const meshMaterial6 = new createMaterial(vertexShader, fragmentShader6);
const materials = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];
const cube = new THREE.Mesh(cubeGeometry, materials);
scene.add(cube);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// [Light]spot light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);

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
  cube.rotation.x = step;
  cube.rotation.y = step;
  cube.rotation.z = step;
  cube.material.forEach(function (e) {
    e.uniforms.time.value += 0.01;
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

function createMaterial(vertexShader, fragmentShader) {
  const uniforms = {
    time: { type: "f", value: 0.2 },
    scale: { type: "f", value: 0.2 },
    alpha: { type: "f", value: 0.6 },
    resolution: { type: "v2", value: new THREE.Vector2() },
  };

  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;

  const meshMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
  });
  return meshMaterial;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize, false);
