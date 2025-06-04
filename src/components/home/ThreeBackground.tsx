import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Octahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

// Mouse interaction component
function CameraControls() {
  const { camera, gl } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);
  
  useFrame(() => {
    // Subtle camera movement based on mouse position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.current.x * 2, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.current.y * 1, 0.02);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Individual floating shape component
function FloatingShape({ position, geometry, color, speed = 1 }: {
  position: [number, number, number];
  geometry: 'sphere' | 'box' | 'octahedron' | 'torus';
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.003 * speed;
      
      // Subtle floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.1;
    }
  });

  const material = (
    <meshStandardMaterial
      color={color}
      transparent
      opacity={0.7}
      emissive={color}
      emissiveIntensity={0.15}
      roughness={0.2}
      metalness={0.9}
    />
  );

  const shapeProps = {
    ref: meshRef,
    position,
    castShadow: true,
    receiveShadow: true
  };

  switch (geometry) {
    case 'sphere':
      return (
        <Sphere {...shapeProps} args={[0.4, 32, 32]}>
          {material}
        </Sphere>
      );
    case 'box':
      return (
        <Box {...shapeProps} args={[0.6, 0.6, 0.6]}>
          {material}
        </Box>
      );
    case 'octahedron':
      return (
        <Octahedron {...shapeProps} args={[0.5]}>
          {material}
        </Octahedron>
      );
    case 'torus':
      return (
        <Torus {...shapeProps} args={[0.5, 0.15, 16, 32]}>
          {material}
        </Torus>
      );
    default:
      return null;
  }
}

// Background scene component
function Scene() {
  // Generate random positions for shapes
  const shapes = useMemo(() => {
    const geometries: Array<'sphere' | 'box' | 'octahedron' | 'torus'> = ['sphere', 'box', 'octahedron', 'torus'];
    const colors = ['#06b6d4', '#818cf8', '#6366f1', '#8b5cf6', '#14b8a6', '#22d3ee']; // Cyan and purple variations
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 24, // x: -12 to 12
        (Math.random() - 0.5) * 12, // y: -6 to 6
        (Math.random() - 0.5) * 18  // z: -9 to 9
      ] as [number, number, number],
      geometry: geometries[Math.floor(Math.random() * geometries.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.3 + Math.random() * 1.2 // Random speed between 0.3 and 1.5
    }));
  }, []);

  return (
    <>
      {/* Camera controls for mouse interaction */}
      <CameraControls />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Accent lights */}
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[10, -5, 8]} intensity={0.3} color="#8b5cf6" />
      
      {/* Render floating shapes */}
      {shapes.map((shape) => (
        <Float
          key={shape.id}
          speed={shape.speed}
          rotationIntensity={0.4}
          floatIntensity={0.2}
        >
          <FloatingShape
            position={shape.position}
            geometry={shape.geometry}
            color={shape.color}
            speed={shape.speed}
          />
        </Float>
      ))}
    </>
  );
}

// Main Three.js background component
const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 50,
          near: 0.1,
          far: 100
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        style={{ 
          background: 'transparent'
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeBackground; 