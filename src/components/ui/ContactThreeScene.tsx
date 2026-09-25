'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeContext } from '@/providers/ThemeProvider';

export default function ContactThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const W = 340, H = 510;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
    keyLight.position.set(-5, 7, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xbbbbdd, 0.5);
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

    // Initial line connecting platforms
    const lineGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 8);
    const line = new THREE.Mesh(lineGeo, mat);
    group.add(line);

    // Theme-aware glowing spark
    const sparkMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0x555555,
    });
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      sparkMat
    );
    group.add(spark);

    const sparkLight = new THREE.PointLight(0xffffff, 3.0, 3.5);
    spark.add(sparkLight);

    // Mouse tracking for dynamic tilt
    const mouse = { x: 0, y: 0 };
    let targetX = 0;
    let targetY = 0;
    let mouseRaf: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountEl.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const smoothMouse = () => {
      mouse.x += (targetX - mouse.x) * 0.08;
      mouse.y += (targetY - mouse.y) * 0.08;
      mouseRaf = requestAnimationFrame(smoothMouse);
    };
    smoothMouse();

    mountEl.addEventListener('mousemove', handleMouseMove);
    mountEl.addEventListener('mouseleave', handleMouseLeave);

    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Calm, smooth rotation + subtle interactive mouse tilt
      group.rotation.x = Math.sin(t * 0.35) * 0.05 - mouse.y * 0.18;
      group.rotation.y = 0.20 + Math.sin(t * 0.28) * 0.07 + mouse.x * 0.18;

      // Gentle platform hover float
      const leftY = 0.45 + Math.sin(t * 0.45) * 0.035;
      const rightY = -0.45 - Math.sin(t * 0.45) * 0.035;
      platLeft.position.y = leftY;
      platRight.position.y = rightY;

      // Update connecting line geometry
      const p1 = platLeft.position;
      const p2 = platRight.position;
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const midZ = (p1.z + p2.z) / 2;
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 + (p2.z - p1.z) ** 2);

      line.position.set(midX, midY, midZ);
      line.scale.set(1, dist, 1);
      line.lookAt(p2);
      line.rotateX(Math.PI / 2);

      // Smooth, elegant spark travel (~5s period)
      const progress = (Math.sin(t * 0.65) + 1) / 2;
      spark.position.set(
        p1.x + (p2.x - p1.x) * progress,
        p1.y + (p2.y - p1.y) * progress,
        p1.z + (p2.z - p1.z) * progress,
      );

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(mouseRaf);
      mountEl.removeEventListener('mousemove', handleMouseMove);
      mountEl.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      if (mountEl && renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return <div ref={mountRef} className="contact-three-mount" />;
}