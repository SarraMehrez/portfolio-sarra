/* global THREE */
/**
 * Three.js 3D Scene - Cybernetic Background
 * Optimized for full-screen performance and robust initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Use a small delay to ensure full window dimensions are parsed
    setTimeout(() => {
        initBackground(container);
    }, 100);
});

function initBackground(container) {
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. NEBULA PARTICLE FLOW ---
    const partCount = 2000;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partVel = new Float32Array(partCount);

    for (let i = 0; i < partCount; i++) {
        partPos[i * 3] = (Math.random() - 0.5) * 40;
        partPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        partPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
        partVel[i] = Math.random() * 0.02 + 0.01;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
        color: 0x00d2ff,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(partGeo, partMat);
    mainGroup.add(particles);

    // --- 2. THE CYBER CORE ---
    const coreGroup = new THREE.Group();
    mainGroup.add(coreGroup);

    const outerGeo = new THREE.OctahedronGeometry(4, 0);
    const outerMat = new THREE.MeshPhongMaterial({
        color: 0x0081cf,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        emissive: 0x0081cf,
        emissiveIntensity: 0.5
    });
    const outerCore = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCore);

    const innerGeo = new THREE.IcosahedronGeometry(2.5, 0);
    const innerMat = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.8,
        flatShading: true,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.2
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // --- 3. DATA RINGS ---
    const createRing = (radius, thickness, count, color) => {
        const ringGroup = new THREE.Group();
        const segmentAngle = (Math.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            if (Math.random() > 0.3) {
                const arcGeo = new THREE.TorusGeometry(radius, thickness, 8, 50, segmentAngle * 0.7);
                const arcMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.4 });
                const arc = new THREE.Mesh(arcGeo, arcMat);
                arc.rotation.z = i * segmentAngle;
                ringGroup.add(arc);
            }
        }
        return ringGroup;
    };

    const ring1 = createRing(7, 0.03, 12, 0x00d2ff);
    const ring2 = createRing(9, 0.03, 8, 0x189ab4);
    const ring3 = createRing(11, 0.04, 15, 0x011f4b);

    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;

    mainGroup.add(ring1);
    mainGroup.add(ring2);
    mainGroup.add(ring3);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00d2ff, 1.5, 100);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const pulseLight = new THREE.PointLight(0x0081cf, 2, 20);
    scene.add(pulseLight);

    camera.position.z = 18;

    // Interaction
    let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0, scrollY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.01;
        targetY = (e.clientY - window.innerHeight / 2) * 0.01;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        coreGroup.rotation.y += 0.01;
        coreGroup.rotation.z += 0.005;

        const s = 1 + Math.sin(time * 2) * 0.1;
        innerCore.scale.set(s, s, s);
        innerCore.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;

        ring1.rotation.z += 0.005;
        ring2.rotation.z -= 0.008;
        ring3.rotation.z += 0.003;

        const positions = partGeo.attributes.position.array;
        for (let i = 0; i < partCount; i++) {
            positions[i * 3 + 1] += partVel[i];
            if (positions[i * 3 + 1] > 20) positions[i * 3 + 1] = -20;
            positions[i * 3] += Math.sin(time + i) * 0.01;
        }
        partGeo.attributes.position.needsUpdate = true;

        mainGroup.rotation.x = mouseY * 0.2;
        mainGroup.rotation.y = mouseX * 0.2;
        mainGroup.position.y = -scrollY * 0.01;

        pulseLight.intensity = 1.5 + Math.sin(time * 4) * 0.5;

        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}
