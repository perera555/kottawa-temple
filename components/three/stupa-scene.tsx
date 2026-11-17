"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const GOLD = "#e8b43a";
const WHITE = "#f7f1e6";

/** A white Sri Lankan dagoba with golden spire, built from primitives. */
function Stupa() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.15;
    // gentle mouse parallax
    const { x, y } = state.pointer;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.15, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x * 0.3, 0.05);
  });

  const white = useMemo(() => new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.55, metalness: 0.05 }), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.25, metalness: 0.9, emissive: "#5a3500", emissiveIntensity: 0.25 }), []);

  return (
    <group ref={group} position={[0, -1.25, 0]}>
      {/* Terraces */}
      <mesh material={white} position={[0, 0.1, 0]}><cylinderGeometry args={[2.1, 2.2, 0.2, 64]} /></mesh>
      <mesh material={white} position={[0, 0.3, 0]}><cylinderGeometry args={[1.85, 1.95, 0.2, 64]} /></mesh>
      <mesh material={white} position={[0, 0.5, 0]}><cylinderGeometry args={[1.6, 1.7, 0.2, 64]} /></mesh>
      {/* Bell / dome */}
      <mesh material={white} position={[0, 0.6, 0]}>
        <sphereGeometry args={[1.45, 64, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Square chamber (Hatares kotuwa) */}
      <mesh material={white} position={[0, 2.2, 0]}><boxGeometry args={[0.7, 0.4, 0.7]} /></mesh>
      <mesh material={gold} position={[0, 2.44, 0]}><boxGeometry args={[0.8, 0.08, 0.8]} /></mesh>
      {/* Devata kotuwa */}
      <mesh material={white} position={[0, 2.6, 0]}><cylinderGeometry args={[0.28, 0.3, 0.25, 32]} /></mesh>
      {/* Golden spire rings */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} material={gold} position={[0, 2.8 + i * 0.13, 0]}>
          <torusGeometry args={[0.22 - i * 0.025, 0.035, 12, 32]} />
        </mesh>
      ))}
      <mesh material={gold} position={[0, 3.55, 0]}><coneGeometry args={[0.1, 0.6, 24]} /></mesh>
      {/* Chudamanikya (crest gem) */}
      <mesh position={[0, 3.92, 0]}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color="#fff6c8" emissive="#ffd34d" emissiveIntensity={2} />
      </mesh>
      <Lotus />
    </group>
  );
}

/** Ring of lotus petals around the base */
function Lotus() {
  const petals = 24;
  return (
    <group position={[0, 0.02, 0]}>
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.35, 0.1, Math.sin(a) * 2.35]} rotation={[0, -a, Math.PI / 5]} scale={[0.28, 0.08, 0.14]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color={i % 2 ? "#f2a3b3" : "#f7c6cf"} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Rotating Dharma wheel floating behind the stupa */
function Wheel() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.25;
  });
  const spokes = 24;
  return (
    <group ref={ref} position={[0, 0.6, -2.6]}>
      <mesh><torusGeometry args={[2.6, 0.06, 16, 120]} /><meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} emissive="#7a4a00" emissiveIntensity={0.4} /></mesh>
      <mesh><torusGeometry args={[0.35, 0.05, 12, 48]} /><meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} /></mesh>
      {Array.from({ length: spokes }, (_, i) => {
        const a = (i / spokes) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.45, Math.sin(a) * 1.45, 0]} rotation={[0, 0, a + Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 2.2, 6]} />
            <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Floating oil-lamp lights (pahan) */
function Lamps({ count = 70 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 6 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.1 + Math.random() * 0.3;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -2;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffd27a" size={0.07} transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function StupaScene({ variant = "temple" }: { variant?: "temple" | "dhamma" | "montessori" }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 7.5], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff1d6" />
      <pointLight position={[-4, 2, 3]} intensity={18} color={variant === "dhamma" ? "#7aa2ff" : variant === "montessori" ? "#8be08b" : "#ff9a3c"} />
      <pointLight position={[0, 3.5, 2]} intensity={6} color="#ffd34d" />
      <Wheel />
      <Stupa />
      <Lamps />
    </Canvas>
  );
}
