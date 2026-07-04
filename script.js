// --- 1. SETUP SCENE, CAMERA, & RENDERER ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.005);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 60, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- 2. CONTROLS ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 400;
controls.minDistance = 5;

// --- 3. LIGHTING ---
const sunLight = new THREE.PointLight(0xffffff, 2.5, 400);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

// --- 4. THE SUN ---
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// --- 5. NATIVE AUDIO ENGINE SYSTEM ---
const audio = new Audio();
let fadeInterval = null;

// Raw Timestamp text array for "K."
const lyricsK = [
    { time: 42.42, text: "I remember when I first noticed that you liked me back" },
    { time: 53.02, text: "We were sitting down in a restaurant waiting for the check" },
    { time: 63.23, text: "We had made love earlier that day with no strings attached," },
    { time: 73.61, text: "But I could tell that something had changed how you looked at me then" },
    { time: 83.62, text: "Kristen, come right back" },
    { time: 89.23, text: "I've been waiting for you to slip back in bed" },
    { time: 99.43, text: "When you light the candle" },
    { time: 124.88, text: "And on the Lower East Side you're dancing with me now" },
    { time: 135.65, text: "And I'm taking pictures of you with flowers on the wall" },
    { time: 145.69, text: "Think I like you best when you're dressed in black from head to toe" },
    { time: 155.84, text: "Think I like you best when you're just with me and no one else" },
    { time: 165.89, text: "Kristen, come right back" },
    { time: 171.27, text: "I've been waiting for you to slip back in bed" },
    { time: 181.68, text: "When you light the candle" },
    { time: 206.28, text: "And I'm kissing you lying in my room" },
    { time: 217.50, text: "Holding you until you fall asleep" },
    { time: 226.23, text: "And it's just as good as I knew it would be" },
    { time: 237.77, text: "Stay with me" },
    { time: 241.06, text: "I don't want you to leave..." },
    { time: 267.36, text: "Kristen, come right back" },
    { time: 272.71, text: "I've been waiting for you to slip back in bed" },
    { time: 282.94, text: "When you light the candle" }
];

const lyricsDontLetMeGo = [
    { time: 0.00, text: "[Intro]" },
    { time: 30.40, text: "When I was young, I thought the world of you" },
    { time: 38.10, text: "You were all that I wanted then" },
    { time: 45.70, text: "It faded and I never saw you again" },
    { time: 53.20, text: "But I won't forget the love we had" },
    { time: 61.50, text: "Come to me now" },
    { time: 65.20, text: "Don't let me go" },
    { time: 68.90, text: "Stay by my side" },
    { time: 75.90, text: "Don't let me go" },
    { time: 80.00, text: "Stay with me still" },
    { time: 83.90, text: "I've missed you so" },
    { time: 104.00, text: "When I was young, I thought the world of you" },
    { time: 112.10, text: "I was dumb to let you drift away" },
    { time: 119.70, text: "And though I guess it had to come to an end" },
    { time: 127.30, text: "No one else could have the love we shared" },
    { time: 135.50, text: "Come to me now" },
    { time: 139.10, text: "Don't let me go" },
    { time: 142.00, text: "Stay by my side" },
    { time: 150.10, text: "And my heart goes" },
    { time: 153.80, text: "Out to you" },
    { time: 155.90, text: "Wherever you are" },
    { time: 194.90, text: "Come to me now" },
    { time: 197.40, text: "Don't let me go" },
    { time: 201.80, text: "Stay by my side" },
    { time: 208.20, text: "Don't let me go" },
    { time: 211.80, text: "Stay with me still" },
    { time: 215.60, text: "I've missed you so" }
];

const lyricsApocalypse = [
    { time: 0.00, text: "[Intro]" },
    { time: 34.11, text: "You leapt from crumbling bridges" },
    { time: 36.77, text: "Watching cityscapes turn to dust" },
    { time: 44.22, text: "Filming helicopters crashing in the ocean from way above" },
    { time: 54.86, text: "Got the music in you, baby, tell me why" },
    { time: 60.05, text: "Got the music in you, baby, tell me why" },
    { time: 65.17, text: "You've been locked in here forever and you just can't say goodbye" },
    { time: 76.00, text: "Kisses on the foreheads of the lovers wrapped in your arms" },
    { time: 85.41, text: "You've been hiding them in hollowed out pianos left in the dark" },
    { time: 95.97, text: "Got the music in you, baby, tell me why" },
    { time: 101.11, text: "Got the music in you, baby, tell me why" },
    { time: 106.14, text: "You've been locked in here forever and you just can't say goodbye" },
    { time: 117.82, text: "Your lips, my lips, apocalypse" },
    { time: 128.11, text: "Your lips, my lips, apocalypse" },
    { time: 136.59, text: "Go and sneak us through the rivers" },
    { time: 139.39, text: "Flood is rising up on your knees, oh, please" },
    { time: 147.72, text: "Come on and haunt me, I know you want me" },
    { time: 152.74, text: "Come on and haunt me" },
    { time: 157.14, text: "Sharing all your secrets with each other since you were kids" },
    { time: 166.49, text: "Sleeping soundly with the locket that she gave you clutched in your fist" },
    { time: 177.02, text: "Got the music in you, baby, tell me why" },
    { time: 182.12, text: "Got the music in you, baby, tell me why" },
    { time: 187.07, text: "You've been locked in here forever and you just can't say goodbye" },
    { time: 207.08, text: "You've been locked in here forever and you just can't say goodbye" },
    { time: 240.05, text: "When you're all alone, I will reach for you" },
    { time: 250.02, text: "When you're feeling low, I will be there too" }
];

const lyricsSweet = [
    { time: 0.00, text: "Watching the video that you sent me" },
    { time: 9.79, text: "The one where you're showering with wet hair dripping" },
    { time: 20.15, text: "You know that I'm obsessed with your body" },
    { time: 30.15, text: "But it's the way you smile that does it for me" },
    { time: 40.33, text: "It's so sweet, knowing that you love me" },
    { time: 50.66, text: "Though we don't need to say it to each other, sweet" },
    { time: 60.39, text: "Knowing that I love you, and running my fingers through your hair" },
    { time: 71.10, text: "It's so sweet" },
    { time: 115.44, text: "Watching the video where you're lying" },
    { time: 125.39, text: "In your red lingerie ten times nightly" },
    { time: 135.29, text: "You know I think your skin's the perfect color" },
    { time: 145.43, text: "But it's always your eyes that pull me under" },
    { time: 155.23, text: "It's so sweet, knowing that you love me" },
    { time: 205.23, text: "Though we don't need to say it to each other, sweet" },
    { time: 215.21, text: "Knowing that I love you, and running my fingers through your hair" },
    { time: 224.85, text: "It's so sweet" },
    { time: 250.16, text: "And I will gladly break it, I will gladly break my heart for you" },
    { time: 300.37, text: "And I will gladly break it, I will gladly break my heart for you" },
    { time: 309.34, text: "And I will gladly break it, I will gladly break my heart for you" },
    { time: 319.68, text: "And I will gladly break it, I will gladly break my heart for you" },
    { time: 329.00, text: "It's so sweet, knowing that you love me" },
    { time: 338.66, text: "Though we don't need to say it to each other, sweet" },
    { time: 348.61, text: "Knowing that I love you, and running my fingers through your hair" },
    { time: 358.02, text: "It's so sweet" }
];

const lyricsYoureAllIWant = [
    { time: 0.00, text: "[Intro]" },
    { time: 21.73, text: "You would use your songs to say" },
    { time: 29.18, text: "The words you couldn't say" },
    { time: 34.50, text: "And every word you sang" },
    { time: 39.79, text: "Was about you and me" },
    { time: 45.17, text: "I loved everything you've wrote" },
    { time: 50.19, text: "And when you would sing" },
    { time: 55.64, text: "I felt that my heart was falling" },
    { time: 63.82, text: "You're all I want" },
    { time: 108.69, text: "We fuck so hard, it left me faded" },
    { time: 114.62, text: "For all you are" },
    { time: 119.22, text: "There is no other love, it's only yours" },
    { time: 135.34, text: "You're all I want, all the love" },
    { time: 205.69, text: "And with Cristal and pink champagne" },
    { time: 214.16, text: "On our wedding day" },
    { time: 219.08, text: "You had a Hollywood sign made of cocaine for us" },
    { time: 232.35, text: "Then you got on top of it" },
    { time: 236.36, text: "And you sang to me" },
    { time: 244.80, text: "As the snow was falling" },
    { time: 248.11, text: "You're all I want" },
    { time: 252.89, text: "We fuck so hard, it left me faded" },
    { time: 258.80, text: "For all you are" },
    { time: 263.39, text: "There is no other love, it's only yours" },
    { time: 319.48, text: "You're all I want, all the love" }
];
// --- 6. THE CAS GALACTIC SYSTEM DATA ---
// OPTIMIZATION: Reduced speeds significantly so they are easy to click.
const planetData = [
    { name: "Mercury", size: 0.6, distance: 12, speed: 0.005, color: 0x888888, song: "K.", artist: "Cigarettes After Sex", file: "K.mp3", lyrics: lyricsK },
    { name: "Venus", size: 1.2, distance: 18, speed: 0.004, color: 0xe3bb76, song: "Don't Let Me Go", artist: "Cigarettes After Sex", file: "Don't Let Me Go.mp3", lyrics: lyricsDontLetMeGo },
    { name: "Earth", size: 1.3, distance: 26, speed: 0.003, color: 0x2277ff, song: "Dreaming of You", artist: "Cigarettes After Sex", lyrics: [] },
    { name: "Mars", size: 0.9, distance: 34, speed: 0.002, color: 0xcc4400, song: "Cry", artist: "Cigarettes After Sex", lyrics: [] },
    { name: "Jupiter", size: 3.5, distance: 48, speed: 0.0015, color: 0xd4a373, song: "Sweet", artist: "Cigarettes After Sex", file: "Sweet.mp3", lyrics: lyricsSweet },
    { name: "Saturn", size: 2.8, distance: 64, speed: 0.001, color: 0xf4e2bb, hasRings: true, song: "Starry Eyes", artist: "Cigarettes After Sex", lyrics: [] },
    { name: "Uranus", size: 2.0, distance: 78, speed: 0.0007, color: 0x70d6ff, song: "Apocalypse", artist: "Cigarettes After Sex", file: "Apocalypse.mp3", lyrics: lyricsApocalypse },
    { name: "Neptune", size: 1.9, distance: 92, speed: 0.0005, color: 0x3a86ff, song: "You're All I Want", artist: "Cigarettes After Sex", file: "You're All I Want.mp3", lyrics: lyricsYoureAllIWant }
];

const planets = [];
planetData.forEach(data => {
    const pivot = new THREE.Group(); scene.add(pivot);
    const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7, metalness: 0.2 });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.x = data.distance;
    planetMesh.userData = data; 
    pivot.add(planetMesh);

    if(data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(data.size + 1, data.size + 4, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xa68a64, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2; planetMesh.add(ringMesh);
    }

    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.15, data.distance + 0.15, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.04, transparent: true, side: THREE.DoubleSide });
    const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = Math.PI / 2; scene.add(orbitLine);
    planets.push({ pivot, mesh: planetMesh, speed: data.speed, baseSize: data.size });
});

// --- STARFIELD ---
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(4000 * 3);
for(let i = 0; i < 4000 * 3; i++) { starPositions[i] = (Math.random() - 0.5) * 600; }
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.8 })));

// --- 7. LYRICS RENDERING & INTERACTION LOGIC ---
const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2(); let targetPlanet = null;

const infoPanel = document.getElementById('info-panel');
const lyricsContainer = document.getElementById('lyrics-container');
const planetUIName = document.getElementById('planet-name');
const songUITitle = document.getElementById('song-title');
const songUIArtist = document.getElementById('song-artist');

window.addEventListener('click', (event) => {
    if (event.target.closest('#info-panel') || event.target.closest('#instructions')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        if (targetPlanet) {
            targetPlanet.scale.set(1.4, 1.4, 1.4);
        }

        const clickedPlanetMesh = intersects[0].object;
        const data = clickedPlanetMesh.userData;
        targetPlanet = clickedPlanetMesh;

        targetPlanet.scale.set(1.4, 1.4, 1.4);

        planetUIName.innerText = data.name;
        songUITitle.innerText = data.song;
        songUIArtist.innerText = data.artist;

        buildLyricsDOM(data.lyrics);
        
        container.classList.add('active');
        infoPanel.classList.add('active');

        // --- NEW: ONE-TIME ZOOM ON CLICK ONLY ---
        const targetWorldPos = new THREE.Vector3();
        targetPlanet.getWorldPosition(targetWorldPos);
        const optimalDist = data.size * 10;
        
        // Snap camera directly to an ideal view distance instantly on click
        camera.position.set(
            targetWorldPos.x,
            targetWorldPos.y + (optimalDist * 0.5),
            targetWorldPos.z + optimalDist
        );
        controls.target.copy(targetWorldPos);
        // ----------------------------------------

        if (data.file) {
            audio.src = data.file;
            audio.play().catch(e => console.log("User interaction required first."));
            fadeVolume(1.0, 1500);
        }
    } else {
        resetFocus();
    }
});

function buildLyricsDOM(lyricsArray) {
    lyricsContainer.innerHTML = '';
    if (!lyricsArray || lyricsArray.length === 0) {
        lyricsContainer.innerHTML = '<div class="lyric-line">[Instrumental / No Lyrics Loaded]</div>';
        return;
    }
    lyricsArray.forEach((line, index) => {
        const lineEl = document.createElement('div');
        lineEl.classList.add('lyric-line');
        lineEl.id = `lyric-line-${index}`;
        lineEl.innerText = line.text;

        // FEATURE: Clicking a lyric line sets the audio position directly to that text timestamp
        lineEl.addEventListener('click', () => {
            audio.currentTime = line.time;
        });

        lyricsContainer.appendChild(lineEl);
    });
}

// Drive auto-scroll tracking engine on audio progress ticks
audio.addEventListener('timeupdate', () => {
    if (!targetPlanet || !targetPlanet.userData.lyrics) return;
    const currentTime = audio.currentTime;
    const lyricsArray = targetPlanet.userData.lyrics;
    
    let activeIndex = -1;
    for (let i = 0; i < lyricsArray.length; i++) {
        if (currentTime >= lyricsArray[i].time) {
            activeIndex = i;
        } else {
            break;
        }
    }

    const lines = document.querySelectorAll('.lyric-line');
    lines.forEach((line, index) => {
        if (index === activeIndex) {
            if (!line.classList.contains('active')) {
                // Clear old active line quickly
                document.querySelectorAll('.lyric-line.active').forEach(el => el.classList.remove('active'));
                
                line.classList.add('active');
                
                // CRITICAL FIX: Direct distance-based scroll animation loop
                const containerTop = lyricsContainer.getBoundingClientRect().top;
                const lineTop = line.getBoundingClientRect().top;
                
                // Calculates target scroll position relative to the middle of the container box
                const targetScroll = lyricsContainer.scrollTop + (lineTop - containerTop) - 60;
                
                lyricsContainer.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }
        } else if (activeIndex === -1) {
            line.classList.remove('active');
        }
    });
});

function fadeVolume(targetVolume, duration) {
    clearInterval(fadeInterval);
    const step = 0.05;
    const intervalTime = duration * step;
    if (targetVolume === 1.0) audio.volume = 0;

    fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + step, targetVolume);
        } else if (audio.volume > targetVolume) {
            audio.volume = Math.max(audio.volume - step, targetVolume);
        }
        if (audio.volume === targetVolume) {
            clearInterval(fadeInterval);
            if (targetVolume === 0.0) audio.pause();
        }
    }, intervalTime);
}

function resetFocus() {
    if (targetPlanet) {
        targetPlanet.scale.set(1, 1, 1); // Shrink size back to native scale configurations
        targetPlanet = null;
    }
    container.classList.remove('active');
    infoPanel.classList.remove('active');
    fadeVolume(0.0, 800);
}

document.getElementById('close-btn').addEventListener('click', resetFocus);

// --- 8. MAIN ANIMATION FRAME ---
const targetWorldPosition = new THREE.Vector3();
function animate() {
    requestAnimationFrame(animate);
    planets.forEach(planet => {
        const currentSpeed = (targetPlanet === planet.mesh) ? planet.speed * 0.3 : planet.speed;
        planet.pivot.rotation.y += currentSpeed;
        planet.mesh.rotation.y += 0.015;
    });

    if (targetPlanet) {
        // Smoothly pin the camera's rotational center pivot to the moving planet coordinates
        targetPlanet.getWorldPosition(targetWorldPosition);
        controls.target.lerp(targetWorldPosition, 0.05); 
    } else {
        // Return back home to the sun center coordinate points
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
    
    controls.update(); 
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});