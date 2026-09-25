'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PROCESS_STEPS } from '@/lib/constants';
import SectionHeader from '../ui/SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Read a CSS custom property from :root as a hex-parseable color string.
// Falls back to the supplied default if the variable is missing.
function readCSSColor(varName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return raw || fallback;
}

// ─── Shared material factory ──────────────────────────────────────────────────
// We make a slightly warm silver that reads clearly on both light and dark bg.
function makeMat(color = 0xb8b8c0) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.18,
    metalness: 0.88,
    emissive: 0x111116,
  });
}

// ─── Scene builders ───────────────────────────────────────────────────────────

function buildDiscoverScene(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  // Transparent – canvas background set via CSS variable
  // scene.background not set → alpha pass-through

  const camera = new THREE.PerspectiveCamera(34, 340 / 510, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  // Stronger ambient so the tunnel reads on a light background too
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
  keyLight.position.set(-5, 7, 3);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xbbbbdd, 0.4);
  fillLight.position.set(4, -3, 1);
  scene.add(fillLight);

  const group = new THREE.Group();
  scene.add(group);

  const mat = makeMat(0xc0c0cc);

  const fw = 1.35, fh = 1.85, depth = 6.8, wallThick = 0.14;

  const topWall = new THREE.Mesh(new THREE.BoxGeometry(fw, wallThick, depth), mat);
  topWall.position.set(0, (fh - wallThick) / 2, -depth / 2);
  group.add(topWall);

  const botWall = new THREE.Mesh(new THREE.BoxGeometry(fw, wallThick, depth), mat);
  botWall.position.set(0, -(fh - wallThick) / 2, -depth / 2);
  group.add(botWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, fh - wallThick * 2, depth), mat);
  leftWall.position.set(-(fw - wallThick) / 2, 0, -depth / 2);
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, fh - wallThick * 2, depth), mat);
  rightWall.position.set((fw - wallThick) / 2, 0, -depth / 2);
  group.add(rightWall);

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
  dot.position.set(0, 0, -depth + 0.05);
  group.add(dot);

  const sweepLight = new THREE.PointLight(0xffffff, 10, 9);
  group.add(sweepLight);

  const clock = new THREE.Clock();
  let animId: number;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.x = Math.sin(t * 0.1) * 0.02;
    group.rotation.y = Math.sin(t * 0.07) * 0.015;
    const p = (t * 0.2) % 1.0;
    sweepLight.position.set(0, 0, -depth + p * depth);
    sweepLight.intensity = Math.sin(p * Math.PI) * 10;
    renderer.render(scene, camera);
  }
  animate();
  return () => cancelAnimationFrame(animId);
}

function buildDesignScene(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 340 / 510, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  scene.add(new THREE.AmbientLight(0xffffff, 3.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
  keyLight.position.set(-5, 7, 3);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xbbbbdd, 0.4);
  fillLight.position.set(4, -3, 1);
  scene.add(fillLight);

  const group = new THREE.Group();
  scene.add(group);

  const mat = makeMat(0xb0b0bc);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x999999 });

  const core = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.7), mat);
  group.add(core);

  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.3, 1.8, 0.85)),
    wireMat,
  );
  group.add(wireframe);

  const fragment = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), mat);
  fragment.position.set(0.55, 0.75, 0.35);
  group.add(fragment);

  const clock = new THREE.Clock();
  let animId: number;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.x = 0.25 + Math.sin(t * 0.12) * 0.025;
    group.rotation.y = 0.35 + Math.sin(t * 0.085) * 0.018;
    wireframe.position.y = Math.sin(t * 0.4) * 0.03;
    fragment.position.x = 0.55 + Math.cos(t * 0.6) * 0.04;
    fragment.rotation.y = t * 0.15;
    renderer.render(scene, camera);
  }
  animate();
  return () => cancelAnimationFrame(animId);
}

function buildTestScene(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 340 / 510, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  scene.add(new THREE.AmbientLight(0xffffff, 3.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
  keyLight.position.set(-5, 7, 3);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xbbbbdd, 0.4);
  fillLight.position.set(4, -3, 1);
  scene.add(fillLight);

  const group = new THREE.Group();
  scene.add(group);

  const mat = makeMat(0xb0b0bc);

  const cubeW = 1.1, cubeH = 1.5, cubeD = 1.2;
  const cubeGroup = new THREE.Group();
  const cube = new THREE.Mesh(new THREE.BoxGeometry(cubeW, cubeH, cubeD), mat);
  cubeGroup.add(cube);

  const diagonal = Math.sqrt(cubeW * cubeW + cubeH * cubeH);
  const crackMat = new THREE.MeshBasicMaterial({ color: 0x555560 });
  const crack = new THREE.Mesh(new THREE.BoxGeometry(diagonal, 0.022, 0.022), crackMat);
  crack.rotation.z = Math.atan2(cubeH, cubeW);
  crack.position.set(0, 0, cubeD / 2 + 0.001);
  cubeGroup.add(crack);
  group.add(cubeGroup);

  const platform = new THREE.Mesh(new THREE.BoxGeometry(cubeW, 0.03, cubeW), mat);
  platform.position.y = -cubeH / 2 - 0.4;
  group.add(platform);

  const clock = new THREE.Clock();
  let animId: number;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.x = 0.15 + Math.sin(t * 0.12) * 0.025;
    group.rotation.y = -0.25 + Math.sin(t * 0.085) * 0.018;
    cubeGroup.position.y = Math.sin(t * 1.1) * 0.05;
    renderer.render(scene, camera);
  }
  animate();
  return () => cancelAnimationFrame(animId);
}

function buildRefineScene(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 340 / 510, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  scene.add(new THREE.AmbientLight(0xffffff, 3.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 7.5);
  keyLight.position.set(-5, 7, 3);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xbbbbdd, 0.4);
  fillLight.position.set(4, -3, 1);
  scene.add(fillLight);

  const group = new THREE.Group();
  scene.add(group);

  const mat = makeMat(0xb0b0bc);

  const leftPlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.6, 0.15), mat);
  leftPlate.position.set(-0.51, 0, 0);
  group.add(leftPlate);

  const rightPlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.6, 0.15), mat);
  rightPlate.position.set(0.51, 0, 0);
  group.add(rightPlate);

  const centerPlate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.9, 0.22), mat);
  centerPlate.position.set(0, 0, 0.02);
  group.add(centerPlate);

  const clock = new THREE.Clock();
  let animId: number;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.x = Math.sin(t * 0.1) * 0.02;
    group.rotation.y = 0.22 + Math.sin(t * 0.07) * 0.015;
    centerPlate.position.x = Math.sin(t * 1.3) * 0.09;
    renderer.render(scene, camera);
  }
  animate();
  return () => cancelAnimationFrame(animId);
}

const SCENE_BUILDERS = [buildDiscoverScene, buildDesignScene, buildTestScene, buildRefineScene];

// ─── Single Three.js card ─────────────────────────────────────────────────────
interface ThreeCardProps {
  buildScene: (renderer: THREE.WebGLRenderer) => () => void;
}

function ThreeCard({ buildScene }: ThreeCardProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = 340, H = 510;
    // alpha:true → renderer produces transparent pixels where no object is drawn
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    // No setClearColor needed — alpha:true keeps it transparent by default

    mountRef.current.appendChild(renderer.domElement);

    const cancelAnim = buildScene(renderer);

    return () => {
      cancelAnim();
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountRef.current.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="process-three-mount" />;
}

// ─── Process Section ──────────────────────────────────────────────────────────
export default function Process() {
  return (
    <div id="process">
      <ScrollReveal className="process-header">
        <SectionHeader
          eyebrow="How I work"
          title="From concept to visual art."
          body="A focused graphic design workflow—transforming abstract ideas into polished, high-impact visuals through deliberate composition, typography, and color harmony."
        />
      </ScrollReveal>

      <div className="process-rows">
        {PROCESS_STEPS.map((step, index) => {
          const isEven = index % 2 === 0;
          return (
            <ScrollReveal key={step.num}>
              <div className={`process-row ${isEven ? 'process-row--left' : 'process-row--right'}`}>
                <div className="process-row-visual">
                  <ThreeCard buildScene={SCENE_BUILDERS[index]} />
                </div>
                <div className="process-row-content">
                  <span className="process-row-num">{step.num}</span>
                  <h3 className="process-row-title">{step.title}</h3>
                  <p className="process-row-desc">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
