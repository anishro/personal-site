//jshint esversion: 7
import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeometry, material);
scene.add(planeMesh);

const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  planeMesh.rotation.x += 0.01;
  planeMesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
