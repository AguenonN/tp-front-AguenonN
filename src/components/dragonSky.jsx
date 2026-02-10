import { useEffect, useRef } from "react";

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

function createDragon(THREE, colorMain, colorGlow, segmentCount = 18) {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: colorMain,
    roughness: 0.38,
    metalness: 0.22,
    emissive: colorGlow,
    emissiveIntensity: 0.2,
  });

  const segments = [];
  for (let i = 0; i < segmentCount; i += 1) {
    const t = i / (segmentCount - 1);
    const radius = 0.32 - t * 0.19;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.08, radius), 16, 16), material);
    group.add(sphere);
    segments.push(sphere);
  }

  const hornMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0c882,
    emissive: 0xf0c882,
    emissiveIntensity: 0.15,
    roughness: 0.25,
    metalness: 0.5,
  });

  const leftHorn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 8), hornMaterial);
  const rightHorn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 8), hornMaterial);
  leftHorn.position.set(-0.16, 0.19, 0.03);
  rightHorn.position.set(0.16, 0.19, 0.03);
  leftHorn.rotation.z = 0.4;
  rightHorn.rotation.z = -0.4;
  group.add(leftHorn);
  group.add(rightHorn);

  return { group, segments };
}

const DragonSky = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let renderer;
    let frameId;
    let onResize;

    (async () => {
      const THREE = await import(/* @vite-ignore */ THREE_URL);
      if (disposed || !mountRef.current) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0c0b08, 0.045);

      const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0.4, 9.5);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mountRef.current.appendChild(renderer.domElement);

      const keyLight = new THREE.DirectionalLight(0xffcf8c, 1.1);
      keyLight.position.set(4, 5, 6);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x53e9ff, 0.9);
      rimLight.position.set(-5, 2, 4);
      scene.add(rimLight);

      scene.add(new THREE.AmbientLight(0x7d6141, 0.55));

      const dragons = [
        { ...createDragon(THREE, 0x965323, 0x4deaff), speed: 0.26, phase: 0.0, radius: 3.4, height: 2.15, drift: 0.22 },
        { ...createDragon(THREE, 0xb98a3c, 0x55d7ff), speed: 0.22, phase: 1.8, radius: 2.9, height: 2.55, drift: 0.18 },
        { ...createDragon(THREE, 0x7c4120, 0x6cefff), speed: 0.3, phase: 3.2, radius: 3.9, height: 1.85, drift: 0.26 },
      ];

      dragons.forEach((d) => scene.add(d.group));

      const clock = new THREE.Clock();

      onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", onResize);

      const animate = () => {
        const t = clock.getElapsedTime();

        dragons.forEach((dragon, dragonIndex) => {
          const headX = Math.cos(t * dragon.speed + dragon.phase) * dragon.radius;
          const headZ = Math.sin(t * dragon.speed + dragon.phase) * (dragon.radius * 0.32);
          const headY = Math.sin(t * (dragon.speed * 1.9) + dragon.phase * 1.5) * dragon.drift + dragon.height;

          dragon.segments.forEach((segment, i) => {
            const lag = i * 0.18;
            const x = Math.cos((t - lag) * dragon.speed + dragon.phase) * (dragon.radius - i * 0.045);
            const z = Math.sin((t - lag) * dragon.speed + dragon.phase) * ((dragon.radius * 0.32) - i * 0.02);
            const y = Math.sin((t - lag) * (dragon.speed * 1.9) + dragon.phase * 1.5) * (dragon.drift - i * 0.004) + dragon.height;

            segment.position.set(x, y, z);
            segment.scale.setScalar(1 - i * 0.02);

            if (i === 0) {
              const nx = Math.cos((t + 0.01) * dragon.speed + dragon.phase) * dragon.radius;
              const nz = Math.sin((t + 0.01) * dragon.speed + dragon.phase) * (dragon.radius * 0.32);
              const ny = Math.sin((t + 0.01) * (dragon.speed * 1.9) + dragon.phase * 1.5) * dragon.drift + dragon.height;
              dragon.group.lookAt(nx, ny, nz);
            }
          });

          dragon.group.position.set(0, 0, 0);
          dragon.group.rotation.y += 0.0016 + dragonIndex * 0.0002;

          // Keep head reference to prevent tree-shake warnings
          void headX;
          void headY;
          void headZ;
        });

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };

      animate();
    })().catch(() => {
      // Ignore network failures for CDN import; UI remains usable without sky layer.
    });

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      if (onResize) window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        const canvas = renderer.domElement;
        if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return <div className="dragon-sky" ref={mountRef} aria-hidden="true" />;
};

export default DragonSky;
