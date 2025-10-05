import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Rotate the Earth continuously
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  // Load high-quality Earth textures
  const earthTexture = useMemo(() => 
    new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
    ), []
  );

  const cloudsTexture = useMemo(() => 
    new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ), []
  );

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={meshRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.2}
          roughness={0.8}
        />
      </Sphere>

      {/* Clouds layer */}
      <Sphere ref={cloudsRef} args={[2.52, 64, 64]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmospheric glow */}
      <Sphere ref={atmosphereRef} args={[2.8, 64, 64]}>
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

export const Earth3D = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={0.3} color="#4a9eff" />
        <pointLight position={[10, 5, -10]} intensity={0.2} color="#ffffff" />
        <EarthSphere />
        <OrbitControls 
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
