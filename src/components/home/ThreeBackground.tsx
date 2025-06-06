import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Octahedron, Torus, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// Mouse interaction component with enhanced effects
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
    // Enhanced camera movement with smooth easing
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.current.x * 2, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.current.y * 1.2, 0.03);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Data Particle Stream Component
function DataStream({ start, end, color, speed = 1 }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 20;
  
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount;
      positions[i * 3] = start[0] + (end[0] - start[0]) * progress;
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * progress;
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * progress;
      
      velocities[i * 3] = (end[0] - start[0]) * 0.01 * speed;
      velocities[i * 3 + 1] = (end[1] - start[1]) * 0.01 * speed;
      velocities[i * 3 + 2] = (end[2] - start[2]) * 0.01 * speed;
    }
    
    return [positions, velocities];
  }, [start, end, speed]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Reset particle if it reaches the end
        const progress = Math.sqrt(
          Math.pow(positions[i * 3] - start[0], 2) +
          Math.pow(positions[i * 3 + 1] - start[1], 2) +
          Math.pow(positions[i * 3 + 2] - start[2], 2)
        ) / Math.sqrt(
          Math.pow(end[0] - start[0], 2) +
          Math.pow(end[1] - start[1], 2) +
          Math.pow(end[2] - start[2], 2)
        );
        
        if (progress > 1) {
          positions[i * 3] = start[0];
          positions[i * 3 + 1] = start[1];
          positions[i * 3 + 2] = start[2];
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.1}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Neural Network Node Component
function NeuralNode({ position, connections, color, pulseSpeed = 1 }: {
  position: [number, number, number];
  connections?: [number, number, number][];
  color: string;
  pulseSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing effect
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.2;
      meshRef.current.scale.setScalar(pulse);
      
      // Gentle rotation
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group>
      {/* Main neural node */}
      <Sphere ref={meshRef} position={position} args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Connection lines to other nodes */}
      <group ref={linesRef}>
        {connections?.map((connectionPos, index) => (
          <DataStream
            key={index}
            start={position}
            end={connectionPos}
            color={color}
            speed={0.5 + Math.random() * 1}
          />
        ))}
      </group>
    </group>
  );
}

// Circuit Pattern Component
function CircuitPattern({ position, size = 1 }: {
  position: [number, number, number];
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.005;
      // Slight floating movement
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Circuit traces */}
      <Box args={[2 * size, 0.05, 0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Box>
      <Box args={[0.05, 1.5 * size, 0.05]} position={[0.5 * size, 0, 0]}>
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Box>
      <Box args={[0.05, 1.5 * size, 0.05]} position={[-0.5 * size, 0, 0]}>
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Box>
      
      {/* Circuit nodes */}
      <Sphere args={[0.1]} position={[0.5 * size, 0.5 * size, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Sphere args={[0.1]} position={[-0.5 * size, -0.5 * size, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </group>
  );
}

// Data Cube with scrolling binary
function DataCube({ position, color, rotationSpeed = 1 }: {
  position: [number, number, number];
  color: string;
  rotationSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * rotationSpeed;
      meshRef.current.rotation.y += 0.008 * rotationSpeed;
      meshRef.current.rotation.z += 0.005 * rotationSpeed;
      
      // Floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[0.8, 0.8, 0.8]}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.7}
        wireframe={Math.random() > 0.5}
      />
    </Box>
  );
}

// Background scene component with AI-themed elements
function Scene() {
  const neuralNodes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12
      ];
      
      return {
        id: i,
        position,
        color: ['#06b6d4', '#8b5cf6', '#14b8a6'][Math.floor(Math.random() * 3)],
        pulseSpeed: 0.5 + Math.random() * 1.5
      };
    });
  }, []);

  const circuitPatterns = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      size: 0.5 + Math.random() * 1
    }));
  }, []);

  const dataCubes = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 13
      ] as [number, number, number],
      color: ['#06b6d4', '#22d3ee', '#14b8a6'][Math.floor(Math.random() * 3)],
      rotationSpeed: 0.5 + Math.random() * 1.5
    }));
  }, []);

  return (
    <>
      {/* Camera controls for mouse interaction */}
      <CameraControls />
      
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Colored accent lights for AI atmosphere */}
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#06b6d4" />
      <pointLight position={[10, -5, 8]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 10, -8]} intensity={0.4} color="#14b8a6" />
      
      {/* Neural Network Nodes */}
      {neuralNodes.map((node) => (
        <Float
          key={node.id}
          speed={1 + Math.random()}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <NeuralNode
            position={node.position}
            color={node.color}
            pulseSpeed={node.pulseSpeed}
          />
        </Float>
      ))}
      
      {/* Circuit Patterns */}
      {circuitPatterns.map((circuit) => (
        <Float
          key={circuit.id}
          speed={0.5 + Math.random() * 0.5}
          rotationIntensity={0.1}
          floatIntensity={0.2}
        >
          <CircuitPattern
            position={circuit.position}
            size={circuit.size}
          />
        </Float>
      ))}
      
      {/* Data Cubes */}
      {dataCubes.map((cube) => (
        <Float
          key={cube.id}
          speed={0.8 + Math.random() * 0.7}
          rotationIntensity={0.4}
          floatIntensity={0.3}
        >
          <DataCube
            position={cube.position}
            color={cube.color}
            rotationSpeed={cube.rotationSpeed}
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
          position: [0, 0, 10], 
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
          console.log('Three.js AI-Enhanced Background loaded successfully!');
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