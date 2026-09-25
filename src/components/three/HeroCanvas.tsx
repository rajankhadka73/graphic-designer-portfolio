'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GlassTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.015;
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.z += 0.001;
    }
  });

  const scale = viewport.width / 10;

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <torusGeometry args={[1.05, 0.42, 80, 160]} />
      <MeshTransmissionMaterial
        thickness={0.2}
        roughness={0}
        transmission={1}
        ior={1.2}
        chromaticAberration={0.02}
        backside
        samples={10}
        resolution={512}
        color="#ffffff"
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full z-3 pointer-events-none">
      <Canvas
        id="three-canvas"
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 4, 5]} intensity={1.2} color="#ccddff" />
        <directionalLight position={[-3, -1, 2]} intensity={0.6} color="#899ccc" />
        <GlassTorus />
      </Canvas>
    </div>
  );
}
