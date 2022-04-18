//jshint esversion: 7
import "./style.css";
import * as THREE from "three";
import datGui from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const gui = new datGui.GUI();
const world = {
  plane: {
    width: 1000,
    height: 800,
    widthSegments: 100,
    heightSegments: 100,
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

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0, 1);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}
//add gui controls for planeMesh
// gui.add(world.plane, "height", 1, 1000).onChange(genratePlane);
// gui.add(world.plane, "width", 1, 1000).onChange(genratePlane);
// gui.add(world.plane, "widthSegments", 1, 100).onChange(genratePlane);
// gui.add(world.plane, "heightSegments", 1, 100).onChange(genratePlane);

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 50;
camera.position.y = -50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planematerial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planematerial);
const randomValue = [];
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i++) {
  if (i % 3 === 0) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i] = x + Math.random() - 0.5;
    array[i + 1] = y + Math.random() - 0.5;
    array[i + 2] = z + Math.random();
  }
  randomValue.push(Math.random() - 0.5);
}
planeMesh.geometry.attributes.position.randomValues = randomValue;
planeMesh.geometry.attributes.position.originalPosition =
  planeMesh.geometry.attributes.position.array;

scene.add(planeMesh);

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0.12, 0.24, 0.84);
}

planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

const light = new THREE.DirectionalLight(0xffff00, 1, 100);
light.position.set(0, 2, 1);
scene.add(light);
const pointLight = new THREE.DirectionalLight(0xffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
const backlight = new THREE.DirectionalLight(0xffffff, 1, 100);
backlight.position.set(0, 0, -1);
scene.add(backlight);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0x2B65EC });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  addStar();
  frame += 0.01;
  for (
    let i = 0;
    i < planeMesh.geometry.attributes.position.array.length;
    i += 3
  ) {
    //x
    array[i] =
      planeMesh.geometry.attributes.position.originalPosition[i] +
      Math.cos(frame + randomValue[i]) * 0.007;
    //y
    array[i + 1] =
      planeMesh.geometry.attributes.position.originalPosition[i + 1] +
      Math.sin(frame + randomValue[i + 1]) * 0.003;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    //vertices 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);
    //vertices 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);
    //vertices 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0);
    color.setZ(intersects[0].face.c, 1);
    //updates on Hover
    color.needsUpdate = true;
    const intialcolor = {
      r: 0.12,
      g: 0.24,
      b: 0.84,
    };
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };
    gsap.to(hoverColor, {
      r: intialcolor.r,
      g: intialcolor.g,
      b: intialcolor.b,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);
        //vertices 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);
        //vertices 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
        //updates on Hover
        color.needsUpdate = true;
      },
    });
  }
}

animate();

//mouse position on screen
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  //mouse move center 0,0
});
