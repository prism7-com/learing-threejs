import * as THREE from "three";
import { ShapeGeometry, Sphere } from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xeeeeee));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 座標軸
const axes = new THREE.AxesHelper(20);
scene.add(axes);

// plane
const planeGeometry = new THREE.PlaneGeometry(60, 20);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 15;
plane.position.y = 0;
plane.position.z = 0;
scene.add(plane);

// cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;
scene.add(cube);

// sphere
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x7777ff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.position.x = 20;
sphere.position.y = 4;
sphere.position.z = 2;
scene.add(sphere);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// spotlight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-20, 30, -5);
spotLight.castShadow = true;
scene.add(spotLight);

document.getElementById("WebGL-output").appendChild(renderer.domElement);
renderer.render(scene, camera);
