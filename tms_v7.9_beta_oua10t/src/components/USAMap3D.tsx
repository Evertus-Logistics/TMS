import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const cities: Array<{ name: string, position: [number, number, number] }> = [
  { name: "New York", position: [5.5, 0, 2] },
  { name: "Los Angeles", position: [-5.5, 0, -0.5] },
  { name: "Chicago", position: [0, 0, 2.8] },
  { name: "Houston", position: [-3, 0, -2] },
  { name: "Phoenix", position: [-5, 0, -1] },
  { name: "Philadelphia", position: [4.5, 0, 1] },
  { name: "San Antonio", position: [-3, 0, -2] },
  { name: "San Diego", position: [-5.5, 0, -0.8] },
  { name: "Dallas", position: [-3, 0, -1.5] },
  { name: "San Jose", position: [-6, 0, 1] },
  { name: "Miami", position: [2, 0, -2.5] },
  { name: "Atlanta", position: [1, 0, -1] },
  { name: "Boston", position: [6, 0, 2.5] },
  { name: "Seattle", position: [-5.5, 0, 3] },
  { name: "Denver", position: [-4, 0, 0.5] }
];

interface TrailPoint {
  position: [number, number, number];
  opacity: number;
}

function Trail({ points }: { points: TrailPoint[] }) {
  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point.position}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={0.5}
            transparent
            opacity={point.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

interface BeaconProps {
  position: [number, number, number];
  name: string;
  isActive: boolean;
  destination?: [number, number, number];
  speed?: number;
  onComplete?: () => void;
}

function Beacon({ position, name, isActive, destination, speed = 1, onComplete }: BeaconProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [pulseOffset] = useState(() => Math.random() * Math.PI * 2);
  const initialY = position[1];
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (isActive && destination) {
        // Update progress based on speed
        setProgress((prev) => {
          const newProgress = prev + (0.005 * speed);
          if (newProgress >= 1) {
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false);
              onComplete?.();
            }, 1000);
            return 1;
          }
          return newProgress;
        });

        // Interpolate position
        const x = position[0] + (destination[0] - position[0]) * progress;
        const y = position[1] + Math.sin(progress * Math.PI) * 0.5; // Arc upward
        const z = position[2] + (destination[2] - position[2]) * progress;
        
        meshRef.current.position.set(x, y, z);

        // Update trail
        if (progress < 1) {
          setTrail(prevTrail => {
            const newTrail = [...prevTrail, {
              position: [x, y, z] as [number, number, number],
              opacity: 1
            }];
            
            return newTrail
              .map(point => ({
                ...point,
                opacity: Math.max(0, point.opacity - 0.02)
              }))
              .filter(point => point.opacity > 0)
              .slice(-30);
          });
        }
      } else {
        // Idle animation
        const time = clock.getElapsedTime() + pulseOffset;
        const yPos = initialY + Math.sin(time * 1.5) * 0.1;
        meshRef.current.position.y = yPos;
        
        // Slower pulse when idle
        const scale = 0.8 + Math.sin(time * 2) * 0.2;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group>
      <Trail points={trail} />
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00FF00"
          emissive="#00FF00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {showMessage && destination && (
        <Billboard
          follow={true}
          position={[destination[0], destination[1] + 0.5, destination[2]]}
        >
          <Text
            fontSize={0.2}
            color="#00FF00"
            anchorX="center"
            anchorY="middle"
          >
            Delivered Boss! 🚚
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function DeliveryDot({ position, name, offset }: { position: [number, number, number], name: string, offset: number }) {
  const textRef = useRef<any>(null);
  const initialY = position[1];
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      const time = clock.getElapsedTime() + offset;
      const yPos = initialY + Math.sin(time * 2) * 0.1;
      textRef.current.position.y = yPos + 0.3;
      const textScale = 0.5 + Math.sin(time * 3) * 0.1;
      textRef.current.scale.set(textScale, textScale, textScale);
    }
  });

  return (
    <Text
      ref={textRef}
      position={[position[0], position[1] + 0.3, position[2]]}
      fontSize={0.2}
      color="#FFD700"
      anchorX="center"
      anchorY="middle"
    >
      {name}
    </Text>
  );
}

function MapOutline() {
  const vertices = useMemo(() => [
    // West Coast (Washington to California)
    new THREE.Vector3(-5.5, 0, 3),    // Washington
    new THREE.Vector3(-5.8, 0, 2.5),  // Oregon
    new THREE.Vector3(-6, 0, 1),      // California
    new THREE.Vector3(-5.5, 0, -0.5), // Southern California
    
    // Southwest
    new THREE.Vector3(-5, 0, -1),     // Arizona
    new THREE.Vector3(-4, 0, -1.5),   // New Mexico
    new THREE.Vector3(-3, 0, -2),     // Texas
    new THREE.Vector3(-2, 0, -2.5),   // Gulf Coast
    
    // Southeast
    new THREE.Vector3(-1, 0, -2),     // Louisiana
    new THREE.Vector3(0, 0, -1.5),    // Mississippi/Alabama
    new THREE.Vector3(1, 0, -1),      // Georgia
    new THREE.Vector3(2, 0, -0.5),    // South Carolina
    new THREE.Vector3(3, 0, 0),       // North Carolina
    
    // East Coast
    new THREE.Vector3(4, 0, 0.5),     // Virginia
    new THREE.Vector3(4.5, 0, 1),     // Maryland/Delaware
    new THREE.Vector3(5, 0, 1.5),     // New Jersey
    new THREE.Vector3(5.5, 0, 2),     // New York
    new THREE.Vector3(6, 0, 2.5),     // New England
    
    // Northern Border
    new THREE.Vector3(5, 0, 3),       // Maine
    new THREE.Vector3(4, 0, 3),       // Vermont/New Hampshire
    new THREE.Vector3(2, 0, 2.5),     // Great Lakes
    new THREE.Vector3(0, 0, 2.8),     // Michigan
    new THREE.Vector3(-2, 0, 3),      // Minnesota
    new THREE.Vector3(-4, 0, 3.2),    // North Dakota
    new THREE.Vector3(-5.5, 0, 3),    // Back to Washington
  ], []);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points = [...vertices, vertices[0]];
    geometry.setFromPoints(points);
    return geometry;
  }, [vertices]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#FFD700" linewidth={2} />
    </lineSegments>
  );
}

function BeaconSystem() {
  const [activeBeacons, setActiveBeacons] = useState<Array<{
    id: number,
    startCity: number,
    endCity: number,
    speed: number
  }>>([]);
  const nextId = useRef(0);

  const addNewDelivery = () => {
    const startCityIndex = Math.floor(Math.random() * cities.length);
    let endCityIndex;
    do {
      endCityIndex = Math.floor(Math.random() * cities.length);
    } while (endCityIndex === startCityIndex);

    setActiveBeacons(prev => [...prev, {
      id: nextId.current++,
      startCity: startCityIndex,
      endCity: endCityIndex,
      speed: 0.5 + Math.random() * 1.5 // Random speed between 0.5x and 2x
    }]);
  };

  useEffect(() => {
    // Add new delivery every few seconds
    const interval = setInterval(addNewDelivery, 2000);
    return () => clearInterval(interval);
  }, []);

  const removeBeacon = (id: number) => {
    setActiveBeacons(prev => prev.filter(beacon => beacon.id !== id));
  };

  return (
    <>
      {cities.map((city, index) => (
        <Beacon
          key={index}
          position={city.position}
          name={city.name}
          isActive={false}
        />
      ))}
      {activeBeacons.map(beacon => (
        <Beacon
          key={beacon.id}
          position={cities[beacon.startCity].position}
          name={cities[beacon.startCity].name}
          isActive={true}
          destination={cities[beacon.endCity].position}
          speed={beacon.speed}
          onComplete={() => removeBeacon(beacon.id)}
        />
      ))}
    </>
  );
}

function DeliveryPoints() {
  const points = useMemo(() => {
    return cities.map(city => ({
      ...city,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  return (
    <group>
      {points.map((point, index) => (
        <DeliveryDot 
          key={index} 
          position={point.position} 
          name={point.name}
          offset={point.offset}
        />
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
        <BeaconSystem />
        
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
