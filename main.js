//jshint esversion:7
import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
); //renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10); //plane takes (width, height, widthSegments, heightSegments)
const planematerial = new THREE.MeshPhongMaterial({
  // wireframe: true,
  color: 0xfff000,
  side: THREE.DoubleSide, // allow to see the back of the plane
  flatShading: THREE.FlatShading, // smooth shading
}); // materalise the plane
const plane = new THREE.Mesh(planeGeometry, planematerial); //plane takes (geometry, material)
function animate() {
  //animation function
  requestAnimationFrame(animate); //call the animate function again
  renderer.render(scene, camera);
}

const { array } = plane.geometry.attributes.position; //get the array of the position of the plane
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random() * 0.1; //change the z value of the position of the plane
}

const light = new THREE.DirectionalLight(0xffffff, 0.5); //light(color, intensity)
light.position.set(0, 0, 1); //light position
new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;
scene.add(plane, light);
animate();
//gui for development
const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};
gui.add(world.plane, "width", 0, 20).onChange(() => {
  genrateplane();
});

gui.add(world.plane, "height", 0, 20).onChange(() => {
  genrateplane();
});

gui.add(world.plane, "widthSegments", 0, 20).onChange(() => {
  genrateplane();
});

gui.add(world.plane, "heightSegments", 0, 20).onChange(() => {
  genrateplane();
});

function genrateplane() {
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = plane.geometry.attributes.position; //get the array of the position of the plane
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random() * 1; //change the z value of the position of the plane
  }
}
