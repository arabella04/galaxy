import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('#0b0914'), 1); 
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.enablePan = false;    

const particleCount = 5000;
const currentPositions = new Float32Array(particleCount * 3);

const shapes = {
  Heart: new Float32Array(particleCount * 3),
  Galaxy: new Float32Array(particleCount * 3),
  Infinity: new Float32Array(particleCount * 3),
  Butterfly: new Float32Array(particleCount * 3),
  Lily: new Float32Array(particleCount * 3) 
};

// -- SHAPE MATH --
for (let i = 0; i < particleCount; i++) {
  // Heart
  let t = (i / particleCount) * Math.PI * 2; 
  let spread = 0.1 + (Math.random() * 0.015);
  shapes.Heart[i * 3]     = 16 * Math.pow(Math.sin(t), 3) * spread;
  shapes.Heart[i * 3 + 1] = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * spread;
  shapes.Heart[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

  // Galaxy
  let angle = (i / particleCount) * Math.PI * 10; 
  let radius = (i / particleCount) * 4; 
  shapes.Galaxy[i * 3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.2;
  shapes.Galaxy[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.2;
  shapes.Galaxy[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

  // Infinity
  t = (i / particleCount) * Math.PI * 2;
  let scale = 2 / (3 - Math.cos(2 * t));
  shapes.Infinity[i * 3]     = scale * Math.cos(t) * 3 + (Math.random() - 0.5) * 0.2;
  shapes.Infinity[i * 3 + 1] = scale * Math.sin(2 * t) / 2 * 3 + (Math.random() - 0.5) * 0.2;
  shapes.Infinity[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

  // Butterfly
  t = (i / particleCount) * Math.PI * 24; 
  let r = Math.exp(Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5);
  shapes.Butterfly[i * 3]     = Math.sin(t) * r * 1.0 + (Math.random() - 0.5) * 0.2;
  shapes.Butterfly[i * 3 + 1] = Math.cos(t) * r * 1.0 + (Math.random() - 0.5) * 0.2;
  shapes.Butterfly[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

  // Lily
  const petalCount = 6;
  if (i < particleCount * 0.85) {
      const petalIndex = i % petalCount;
      const baseAngle = (petalIndex / petalCount) * Math.PI * 2;
      let u = Math.random();
      let v = (Math.random() - 0.5) * 2;
      const maxHalfWidth = 1.3; 
      const petalWidth = Math.sin(u * Math.PI) * Math.pow(u, 0.5) * maxHalfWidth;
      v *= petalWidth;
      const length = 5.0; 
      const xLocal = u * length;
      const yLocal = v;
      const zLocal = -Math.pow(u, 2) * 0.8; 
      const rotAngle = baseAngle + (u * 0.1); 
      const cosA = Math.cos(rotAngle);
      const sinA = Math.sin(rotAngle);
      shapes.Lily[i * 3]     = xLocal * cosA - yLocal * sinA;
      shapes.Lily[i * 3 + 1] = xLocal * sinA + yLocal * cosA;
      shapes.Lily[i * 3 + 2] = zLocal + (Math.random() - 0.5) * 0.05; 
  } else {
      const stamenIndex = i % 6;
      const stAngle = (stamenIndex / 6) * Math.PI * 2; 
      const isTip = Math.random() > 0.8;
      let u = isTip ? 0.9 + Math.random() * 0.1 : Math.random(); 
      const spreadRadius = 0.8; 
      const lengthZ = 3.5; 
      const xLocal = Math.cos(stAngle) * (u * spreadRadius);
      const yLocal = Math.sin(stAngle) * (u * spreadRadius) - (u * u * 0.5); 
      const zLocal = u * lengthZ; 
      let spread = isTip ? 0.15 : 0.02; 
      shapes.Lily[i * 3]     = xLocal + (Math.random() - 0.5) * spread;
      shapes.Lily[i * 3 + 1] = yLocal + (Math.random() - 0.5) * spread;
      shapes.Lily[i * 3 + 2] = zLocal + (Math.random() - 0.5) * spread;
  }
}

// 4. Initialize Geometry
for (let i = 0; i < currentPositions.length; i++) {
  currentPositions[i] = shapes.Heart[i];
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

const material = new THREE.PointsMaterial({ 
    color: 0xff6699, 
    size: 0.05, 
    transparent: true, 
    opacity: 0.8,
    blending: THREE.AdditiveBlending 
});

const pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);

// 5. ANIMATION STATE VARIABLES
let drawCount = 0;
let isDrawing = true;
let isBeating = false; // <-- NEW: Tracks if the heart should be pulsing
geometry.setDrawRange(0, 0); 

// 6. UI Controls & Shape Switching
const shapeNames = ['Heart', 'Galaxy', 'Infinity', 'Butterfly', 'Lily'];
let currentIndex = 0;
let targetPositions = shapes.Heart;
const label = document.getElementById('label');

let hasTriggeredEnding = false; 

function changeShape(direction) {
  if (hasTriggeredEnding) return; 

  if (direction === 'next') {
    if (currentIndex === shapeNames.length - 1) {
        startSequence();
        return;
    }
    currentIndex = (currentIndex + 1) % shapeNames.length;
  } else {
    currentIndex = (currentIndex - 1 + shapeNames.length) % shapeNames.length;
  }
  
  label.innerText = shapeNames[currentIndex];
  targetPositions = shapes[shapeNames[currentIndex]];
  
  if (currentIndex === 0) material.color.setHex(0xff6699);
  if (currentIndex === 1) material.color.setHex(0x66ccff);
  if (currentIndex === 2) material.color.setHex(0x00ffcc);
  if (currentIndex === 3) material.color.setHex(0xffaa00);
  if (currentIndex === 4) material.color.setHex(0xffd1dc); 
  
  drawCount = 0;
  isDrawing = true;
  geometry.setDrawRange(0, 0);
}

document.getElementById('nextBtn').addEventListener('click', () => changeShape('next'));
document.getElementById('prevBtn').addEventListener('click', () => changeShape('prev'));

// 7. THE TYPEWRITER SEQUENCE
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Changed innerText to textContent to preserve spaces perfectly
async function typeWriter(element, text, speed = 80) {
    element.textContent = ''; 
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await sleep(speed);
    }
}

async function eraseText(element, speed = 40) {
    let text = element.textContent;
    for (let i = text.length; i >= 0; i--) {
        element.textContent = text.substring(0, i);
        await sleep(speed);
    }
}

async function startSequence() {
    hasTriggeredEnding = true;
    
    document.getElementById('ui-container').classList.add('hidden');
    const overlay = document.getElementById('message-overlay');
    overlay.classList.remove('hidden');

    const typeDiv = document.getElementById('typewriter-text');
    
    // Corrected Grammar and Spacing
    const messages = [
        "hey, are you okay?",
        "if not, you know that i'm here.",
        "i don't know what's going on, but i'm trying to cheer you up.",
        "so please eat on time, okay?",
        "take care!",
        "oh, before i end this, click the play button to play a song."
    ];

    await sleep(1000); 

    for (let i = 0; i < messages.length; i++) {
        await typeWriter(typeDiv, messages[i]);
        await sleep(2500); 
        if (i < messages.length - 1) {
            await eraseText(typeDiv); 
            await sleep(500);
        }
    }

    document.getElementById('playBtn').classList.remove('hidden');
}

// 8. MUSIC & LYRICS LOGIC
const audio = document.getElementById('bgm');
const lyricsContainer = document.getElementById('lyrics-container');

const lyricsData = [
    { time: 0.00, text: "" },
    { time: 0.09, text: "I love you" },
    { time: 3.31, text: "But I don't really show you" },
    { time: 8.61, text: "I'd call you" },
    { time: 11.79, text: "But only if you want me to" },
    { time: 15.04, text: "" }, 
    { time: 16.07, text: "Oh, don't you let it stop" },
    { time: 20.30, text: "Oh, I won't let it happen, baby" },
    { time: 24.84, text: "I will never stop" },
    { time: 28.08, text: "But only if you listen to me" },
    { time: 33.26, text: "" },
    { time: 33.33, text: "Come inside of my heart if you're lookin' for answers" },
    { time: 38.37, text: "Look at the stars, go a little bit faster" },
    { time: 42.63, text: "Ooh-ooh" },
    { time: 44.71, text: "Ooh-ooh, ooh-ooh, ooh-ooh-ooh" },
    { time: 50.31, text: "Come inside of my heart if you're lookin' for answers" },
    { time: 55.40, text: "Look at the stars, go a little bit faster" },
    { time: 59.58, text: "Ooh, ooh" },
    { time: 61.76, text: "Ooh-ooh, ooh-ooh, ooh-ooh-ooh" },
    { time: 63.00, text: "" }
];

document.getElementById('playBtn').addEventListener('click', () => {
    document.getElementById('message-overlay').classList.add('hidden');
    document.getElementById('playBtn').classList.add('hidden');
    
    // Switch to heart and trigger draw animation
    targetPositions = shapes.Heart;
    material.color.setHex(0xff6699);
    drawCount = 0;
    isDrawing = true;
    geometry.setDrawRange(0, 0);

    // Turn on the heartbeat animation!
    isBeating = true;

    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
    controls.update();

    lyricsContainer.classList.remove('hidden');
    audio.volume = 1.0; 
    audio.play();
});

audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    
    // Audio Fade Out 
    if (currentTime >= 62.0 && currentTime < 65.0) {
        let fadeLevel = 1.0 - ((currentTime - 62.0) / 2.0); 
        audio.volume = Math.max(0, Math.min(1, fadeLevel)); 
    } else if (currentTime >= 65.0) {
        audio.pause();
        lyricsContainer.innerText = ""; 
        isBeating = false; // Stop beating when the song ends
    }

    // Lyrics Sync
    let currentText = "";
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            currentText = lyricsData[i].text;
        }
    }
    lyricsContainer.innerText = currentText;
});


// 9. Render Loop
function render() {
  requestAnimationFrame(render);
  controls.update(); 
  
  if (isDrawing) {
      drawCount += 35; 
      geometry.setDrawRange(0, drawCount); 
      if (drawCount >= particleCount) isDrawing = false; 
  }

  // --- NEW: Heartbeat & Resize Logic ---
  if (isBeating) {
      // 1.6 scales the heart up so the lyrics fit inside.
      // The Math.sin creates a rhythmic pulse based on the time!
      const pulse = 1.6 + Math.abs(Math.sin(Date.now() * 0.002)) * 0.12;
      pointCloud.scale.set(pulse, pulse, pulse);
  } else {
      // Keep it at standard size for all other shapes
      pointCloud.scale.set(1, 1, 1);
  }
  
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i++) {
     positions[i] += (targetPositions[i] - positions[i]) * 0.08; 
  }
  geometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
}

render();

// 10. Handle Window Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});