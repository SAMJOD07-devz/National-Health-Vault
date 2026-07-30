import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#1E3A8A"
        attach="material"
        distort={0.4} // Amount of distortion
        speed={1.5} // Speed of distortion
        roughness={0.2}
        metalness={0.8}
        transmission={0.9} // Glass-like
        thickness={1}
        ior={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}

export default function OrbCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center md:justify-end md:pr-32">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]} // Cap DPR for performance
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#38BDF8" />
        <AnimatedOrb />
      </Canvas>
    </div>
  );
}
