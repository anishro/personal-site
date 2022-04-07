//jshint esversion: 7
import "./style.css";
import * as THREE from "three";
import datGui from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new datGui.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};

function genratePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i++) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + Math.random() * 0.2;
    array[i + 1] = y + Math.random() * 0.2;
    array[i + 2] = z + Math.random() * 0.2;
  }
}
//add gui controls for planeMesh
gui.add(world.plane, "height", 1, 20).onChange(genratePlane);
gui.add(world.plane, "width", 1, 20).onChange(genratePlane);
gui.add(world.plane, "widthSegments", 1, 50).onChange(genratePlane);
gui.add(world.plane, "heightSegments", 1, 50).onChange(genratePlane);

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planematerial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planematerial);
console.log(planeMesh.geometry.attributes.position.array);
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i++) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x + Math.random() * 0.2;
}
scene.add(planeMesh);

const colors = [];
console.log(planeMesh.geometry.attributes.position.count);
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(1, 0, 0);
}

planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

const backlight = new THREE.DirectionalLight(0xffffff, 1, 100);
backlight.position.set(0, 0, -1);
scene.add(backlight);

const mouse = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    console.log(intersects[0].object.geometry.attributes.color);
    //vertices 1
    color.setX(intersects[0].face.a, 0);
    color.setY(intersects[0].face.a, 0);
    color.setZ(intersects[0].face.a, 1);
    //vertices 2
    color.setX(intersects[0].face.b, 0);
    color.setY(intersects[0].face.b, 0);
    color.setZ(intersects[0].face.b, 1);
    //vertices 3
    color.setX(intersects[0].face.c, 0);
    color.setY(intersects[0].face.c, 0);
    color.setZ(intersects[0].face.c, 1);
    //updates on Hover
    color.needsUpdate = true;
  }
}

animate();

//mouse position on screen
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  //mouse move center 0,0
});
