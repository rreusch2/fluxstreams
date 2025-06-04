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
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.current.x * 1.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.current.y * 0.8, 0.02);
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
      meshRef.current.rotation.x += 0.008 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
      
      // Subtle floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.2;
    }
  });

  const material = (
    <meshStandardMaterial
      color={color}
      transparent
      opacity={0.8}
      emissive={color}
      emissiveIntensity={0.2}
      roughness={0.1}
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
        <Sphere {...shapeProps} args={[0.5, 32, 32]}>
          {material}
        </Sphere>
      );
    case 'box':
      return (
        <Box {...shapeProps} args={[0.8, 0.8, 0.8]}>
          {material}
        </Box>
      );
    case 'octahedron':
      return (
        <Octahedron {...shapeProps} args={[0.6]}>
          {material}
        </Octahedron>
      );
    case 'torus':
      return (
        <Torus {...shapeProps} args={[0.6, 0.2, 16, 32]}>
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
    
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20, // x: -10 to 10
        (Math.random() - 0.5) * 10, // y: -5 to 5
        (Math.random() - 0.5) * 15  // z: -7.5 to 7.5
      ] as [number, number, number],
      geometry: geometries[Math.floor(Math.random() * geometries.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.4 + Math.random() * 1.0 // Random speed between 0.4 and 1.4
    }));
  }, []);

  return (
    <>
      {/* Camera controls for mouse interaction */}
      <CameraControls />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
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
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[10, -5, 8]} intensity={0.4} color="#8b5cf6" />
      
      {/* Render floating shapes */}
      {shapes.map((shape) => (
        <Float
          key={shape.id}
          speed={shape.speed}
          rotationIntensity={0.3}
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
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 60,
          near: 0.1,
          far: 100
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        onCreated={({ gl }) => {
          console.log('Three.js Beautiful Background loaded successfully!');
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
        onError={(error) => {
          console.error('Three.js error:', error);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeBackground; 