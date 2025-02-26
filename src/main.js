import * as ob from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new ob.Scene();
const camera = new ob.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new ob.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Smooth camera movement
controls.dampingFactor = 0.05;
controls.minDistance = 20;  // How close the camera can get
controls.maxDistance = 200; // How far the camera can go
controls.autoRotate = false;

// Lighting
const light = new ob.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new ob.AmbientLight(0x404040, 1); // Soft global light
scene.add(ambientLight);

// Sun
const sunGeometry = new ob.SphereGeometry(10, 32, 32);
const sunMaterial = new ob.MeshStandardMaterial({ 
    color: 0xffff00, 
    emissive: 0xffff00, 
    emissiveIntensity: 1.5 
});
const sun = new ob.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create planets
const createPlanet = (size, color, emissive, intensity) => {
    return new ob.Mesh(
        new ob.SphereGeometry(size, 32, 32),
        new ob.MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity })
    );
};



// 🌍 Define all 8 planets



const mercury = createPlanet(1.2, 0xaaaaaa, 0x555555, 1.0);
const venus = createPlanet(2.5, 0xffcc66, 0xaa8844, 1.2);
const earth = createPlanet(3, 0x0000ff, 0x1133ff, 1.5);
const mars = createPlanet(2.5, 0xff0000, 0xff4444, 1.3);
const jupiter = createPlanet(5, 0xd4a373, 0x885522, 1.2);
const saturn = createPlanet(4.5, 0xf4a261, 0xaa5500, 1.2);
const uranus = createPlanet(3.8, 0x55aaff, 0x225577, 1.1);
const neptune = createPlanet(3.5, 0x3344ff, 0x1122aa, 1.1);

// Add planets to the scene
scene.add(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// 🌓 Moon for Earth
const moon = createPlanet(1, 0x888888, 0x444444, 0.5);
scene.add(moon);

// Saturn's Rings
const ringGeometry = new ob.RingGeometry(6, 10, 64);
const ringMaterial = new ob.MeshStandardMaterial({
    color: 0xd4a373, 
    emissive: 0x885522, 
    emissiveIntensity: 1.0,
    side: ob.DoubleSide
});
const ring = new ob.Mesh(ringGeometry, ringMaterial);
scene.add(ring);
ring.rotation.x = Math.PI / 2.5; // Tilted ring

// Camera Position
camera.position.set(50, 110, 150);
camera.lookAt(0, 0, 0);

// 🌌 **Adding Stars to Space**
const starsGeometry = new ob.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 5000; i++) { 
    let x = (Math.random() - 0.5) * 2000;
    let y = (Math.random() - 0.5) * 2000;
    let z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new ob.Float32BufferAttribute(starVertices, 3));

const starsMaterial = new ob.PointsMaterial({ color: 0xffffff, size: 1, sizeAttenuation: true });
const stars = new ob.Points(starsGeometry, starsMaterial);
scene.add(stars);

// 🌌 Animate Function
function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.002;

    let time = Date.now() * 0.0005;

    // 🌀 Orbits for each planet
    mercury.position.set(Math.cos(time * 4) * 15, Math.sin(time * 2) * 2, Math.sin(time * 4) * 15);
    venus.position.set(Math.cos(time * 3) * 18, Math.sin(time * 1.5) * 3, Math.sin(time * 3) * 18);
    earth.position.set(Math.cos(time * 2) * 22, Math.sin(time * 1.5) * 5, Math.sin(time * 2) * 22);
    mars.position.set(Math.cos(time * 1.5) * 30, Math.sin(time) * 4, Math.sin(time * 1.5) * 30);
    jupiter.position.set(Math.cos(time * 0.8) * 50, Math.sin(time * 0.5) * 6, Math.sin(time * 0.8) * 50);
    saturn.position.set(Math.cos(time * 0.6) * 65, Math.sin(time * 0.4) * 4, Math.sin(time * 0.6) * 65);
    uranus.position.set(Math.cos(time * 0.4) * 80, Math.sin(time * 0.3) * 3, Math.sin(time * 0.4) * 80);
    neptune.position.set(Math.cos(time * 0.3) * 95, Math.sin(time * 0.2) * 2, Math.sin(time * 0.3) * 95);

    // 🌙 Moon Orbiting Earth
    moon.position.set(
        earth.position.x + Math.cos(time * 8) * 5,
        earth.position.y + Math.sin(time * 4) * 2,
        earth.position.z + Math.sin(time * 8) * 5
    );

    // 🪐 Saturn's Ring Following Saturn
    ring.position.copy(saturn.position);

    // 🌍 Self Rotation for planets
    mercury.rotation.y += 0.004;
    venus.rotation.y += 0.002;
    earth.rotation.y += 0.01;
    mars.rotation.y += 0.008;
    jupiter.rotation.y += 0.02;
    saturn.rotation.y += 0.015;
    uranus.rotation.y += 0.012;
    neptune.rotation.y += 0.011;

    controls.update();

    renderer.render(scene, camera);
}

animate();
