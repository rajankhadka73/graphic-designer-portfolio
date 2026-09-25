'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeContext } from '@/providers/ThemeProvider';

export default function ContactThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeContext(); // ← Get current theme
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mountRef.current) return;

    const W = 340, H = 510;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
    keyLight.position.set(-5, 7, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xbbbbdd, 0.4);
    fillLight.position.set(4, -3, 1);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const mat = new THREE.MeshStandardMaterial({
      color: 0xb0b0bc,
      roughness: 0.18,
      metalness: 0.88,
      emissive: 0x111116,
    });

    const platGeo = new THREE.BoxGeometry(0.75, 0.05, 0.75);
    const platLeft = new THREE.Mesh(platGeo, mat);
    platLeft.position.set(-0.65, 0.45, 0);
    group.add(platLeft);

    const platRight = new THREE.Mesh(platGeo, mat);
    platRight.position.set(0.65, -0.45, -0.4);
    group.add(platRight);

    const dx = platRight.position.x - platLeft.position.x;
    const dy = platRight.position.y - platLeft.position.y;
    const dz = platRight.position.z - platLeft.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const lineGeo = new THREE.CylinderGeometry(0.01, 0.01, dist, 8);
    const line = new THREE.Mesh(lineGeo, mat);
    line.position.set(
      (platLeft.position.x + platRight.position.x) / 2,
      (platLeft.position.y + platRight.position.y) / 2,
      (platLeft.position.z + platRight.position.z) / 2,
    );
    line.lookAt(platRight.position);
    line.rotateX(Math.PI / 2);
    group.add(line);

    // --- SPARK WITH THEME-AWARE COLOR ---
    const sparkMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0x666666, //here 0x666666 is light grey color to make it visible
    });
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 16, 16),
      sparkMat
    );
    group.add(spark);

    const sparkLight = new THREE.PointLight(0xffffff, 2.5, 3.0);
    spark.add(sparkLight);

    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.x = Math.sin(t * 0.12) * 0.025;
      group.rotation.y = 0.20 + Math.sin(t * 0.085) * 0.018;

      const progress = (Math.sin(t * 0.3) + 1) / 2;
      spark.position.set(
        platLeft.position.x + dx * progress,
        platLeft.position.y + dy * progress,
        platLeft.position.z + dz * progress,
      );

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isDark]); // ← Re-run when theme changes

  return <div ref={mountRef} className="contact-three-mount" />;
}