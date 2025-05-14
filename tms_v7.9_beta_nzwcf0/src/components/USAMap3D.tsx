import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function DeliveryDot({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = initialY + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      // Pulse animation
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.3;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFA500"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function MapOutline() {
  // Simplified USA outline vertices (just for visualization)
  const vertices = useMemo(() => [
    // West Coast
    new THREE.Vector3(-6, 0, 3),
    new THREE.Vector3(-6, 0, -3),
    // East Coast
    new THREE.Vector3(6, 0, 2),
    new THREE.Vector3(6, 0, -2),
    // Northern border
    new THREE.Vector3(-6, 0, 3),
    new THREE.Vector3(6, 0, 2),
    // Southern border
    new THREE.Vector3(-6, 0, -3),
    new THREE.Vector3(6, 0, -2),
  ], []);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    return geometry;
  }, [vertices]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#FFD700" linewidth={1} />
    </lineSegments>
  );
}

function DeliveryPoints() {
  // Random delivery points across the USA map
  const points = useMemo(() => {
    const result = [];
    for (let i = 0; i < 15; i++) {
      result.push([
        THREE.MathUtils.randFloat(-5.5, 5.5),
        0,
        THREE.MathUtils.randFloat(-2.5, 2.5)
      ] as [number, number, number]);
    }
    return result;
  }, []);

  return (
    <group>
      {points.map((position, index) => (
        <DeliveryDot key={index} position={position} />
      ))}
    </group>
  );
}

export function USAMap3D() {
  return (
    <div className="h-[400px] w-full">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <MapOutline />
        <DeliveryPoints />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 2.1}
        />
        
        {/* Grid for reference */}
        <gridHelper args={[20, 20, '#FFD700', '#444444']} />
      </Canvas>
    </div>
  );
}
