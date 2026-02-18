/* global THREE */
/**
 * Three.js 3D Scene - Credential Totem
 */

function initCredentialTotem() {
    const container = document.getElementById('credentials-three-container');
    if (!container) return;
    if (container.querySelector('canvas')) return; // Already init

    const rect = container.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const totemGroup = new THREE.Group();
    scene.add(totemGroup);

    // Core
    const crystalGeo = new THREE.OctahedronGeometry(2, 0);
    const crystalMat = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.8,
        flatShading: true,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.4
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    totemGroup.add(crystal);

    // Shields
    const shieldGroup = new THREE.Group();
    totemGroup.add(shieldGroup);
    for (let i = 0; i < 6; i++) {
        const shieldGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const shieldMat = new THREE.MeshPhongMaterial({ color: 0x0081cf, transparent: true, opacity: 0.4 });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        const angle = (Math.PI * 2 / 6) * i;
        shield.position.x = 3.5 * Math.cos(angle);
        shield.position.y = 3.5 * Math.sin(angle);
        shield.lookAt(0, 0, 0);
        shieldGroup.add(shield);
    }

    // Rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.02, 16, 100), new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.2 }));
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4, 0.02, 16, 100), new THREE.MeshBasicMaterial({ color: 0x0081cf, transparent: true, opacity: 0.1 }));
    ring2.rotation.x = Math.PI / 2;
    totemGroup.add(ring1);
    totemGroup.add(ring2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl = new THREE.PointLight(0x00d2ff, 2, 50);
    pl.position.set(5, 5, 5);
    scene.add(pl);

    camera.position.z = 12;

    let tx = 0, ty = 0, mx = 0, my = 0;
    container.addEventListener('mousemove', (e) => {
        const r = container.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * 0.01;
        ty = (e.clientY - r.top - r.height / 2) * 0.01;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;
        totemGroup.rotation.y = time * 0.5 + mx;
        totemGroup.rotation.x = Math.sin(time * 0.3) * 0.2 + my;
        crystal.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
        crystal.rotation.z += 0.01;
        shieldGroup.children.forEach((s, i) => {
            s.position.z = Math.sin(time * 2 + i) * 0.5;
            s.rotation.y += 0.02;
        });
        ring1.rotation.z -= 0.01;
        ring2.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

// Multi-trigger to be safe
document.addEventListener('DOMContentLoaded', initCredentialTotem);
window.addEventListener('load', initCredentialTotem);
setTimeout(initCredentialTotem, 500);
setTimeout(initCredentialTotem, 2000);
