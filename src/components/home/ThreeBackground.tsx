import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Octahedron, Torus, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// Mouse trail particles component
function MouseTrail() {
  const trailRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0, z: 0 });
  const trailPositions = useRef<Float32Array>();
  const trailOpacity = useRef<Float32Array>();
  const maxTrailPoints = 50;
  const currentIndex = useRef(0);

  useEffect(() => {
    const positions = new Float32Array(maxTrailPoints * 3);
    const opacity = new Float32Array(maxTrailPoints);
    
    trailPositions.current = positions;
    trailOpacity.current = opacity;
  }, []);

  useFrame((state) => {
    if (trailRef.current && trailPositions.current && trailOpacity.current) {
      // Add new point to trail
      const index = currentIndex.current % maxTrailPoints;
      trailPositions.current[index * 3] = mousePosition.current.x;
      trailPositions.current[index * 3 + 1] = mousePosition.current.y;
      trailPositions.current[index * 3 + 2] = mousePosition.current.z;
      
      // Update opacity for fade effect
      for (let i = 0; i < maxTrailPoints; i++) {
        const age = (currentIndex.current - i + maxTrailPoints) % maxTrailPoints;
        trailOpacity.current[i] = Math.max(0, 1 - age / maxTrailPoints);
      }
      
      currentIndex.current++;
      
      trailRef.current.geometry.attributes.position.needsUpdate = true;
      if (trailRef.current.material) {
        (trailRef.current.material as any).needsUpdate = true;
      }
    }
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={maxTrailPoints}
          array={trailPositions.current || new Float32Array(maxTrailPoints * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#06b6d4"
        size={0.15}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Enhanced mouse interaction component with trail
function CameraControls() {
  const { camera, gl, viewport } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    if (!isMobile) {
      gl.domElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [gl, isMobile]);
  
  useFrame(() => {
    if (!isMobile) {
      // Enhanced camera movement with smooth easing
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.current.x * 1.5, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.current.y * 1, 0.02);
      camera.lookAt(0, 0, 0);
    }
  });
  
  return isMobile ? null : <MouseTrail />;
}

// Enhanced Data Particle Stream Component with dynamic colors
function DataStream({ start, end, color, speed = 1, pulseIntensity = 0 }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
  pulseIntensity?: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 15; // Reduced for mobile performance
  
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

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + pulseIntensity) * 0.3;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * pulse;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * pulse;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * pulse;
        
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
        size={0.08}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Enhanced Neural Network Node Component with hover detection
function NeuralNode({ position, connections, color, pulseSpeed = 1, onHover }: {
  position: [number, number, number];
  connections?: [number, number, number][];
  color: string;
  pulseSpeed?: number;
  onHover?: (isHovering: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Enhanced pulsing effect with hover state
      const basePulse = 0.5 + Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.2;
      const hoverMultiplier = isHovered ? 1.5 : 1;
      meshRef.current.scale.setScalar(basePulse * hoverMultiplier);
      
      // Gentle rotation with hover acceleration
      const rotationSpeed = isHovered ? 0.02 : 0.01;
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.8;
    }
  });

  return (
    <group>
      {/* Main neural node with hover detection */}
      <Sphere 
        ref={meshRef} 
        position={position} 
        args={[0.25, 12, 12]}
        onPointerEnter={() => {
          setIsHovered(true);
          onHover?.(true);
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          onHover?.(false);
        }}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={isHovered ? 0.6 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Enhanced connection lines with pulse */}
      <group ref={linesRef}>
        {connections?.map((connectionPos, index) => (
          <DataStream
            key={index}
            start={position}
            end={connectionPos}
            color={isHovered ? '#06b6d4' : color}
            speed={isHovered ? 2 : 0.5 + Math.random() * 1}
            pulseIntensity={index * Math.PI * 0.3}
          />
        ))}
      </group>
    </group>
  );
}

// Enhanced Circuit Pattern Component with dynamic colors
function CircuitPattern({ position, size = 1, heightFactor = 0 }: {
  position: [number, number, number];
  size?: number;
  heightFactor?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Dynamic color based on height (purple at bottom, cyan at top)
  const colorMix = (heightFactor + 8) / 16; // Normalize to 0-1
  const color = new THREE.Color().lerpColors(
    new THREE.Color('#8b5cf6'), // Purple at bottom
    new THREE.Color('#06b6d4'), // Cyan at top
    colorMix
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.003;
      // Enhanced floating movement
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Circuit traces with dynamic color */}
      <Box args={[2 * size, 0.05, 0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </Box>
      <Box args={[0.05, 1.5 * size, 0.05]} position={[0.5 * size, 0, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </Box>
      <Box args={[0.05, 1.5 * size, 0.05]} position={[-0.5 * size, 0, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </Box>
      
      {/* Circuit nodes with enhanced glow */}
      <Sphere args={[0.08]} position={[0.5 * size, 0.5 * size, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </Sphere>
      <Sphere args={[0.08]} position={[-0.5 * size, -0.5 * size, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </Sphere>
    </group>
  );
}

// Enhanced Data Cube with dynamic color shifting
function DataCube({ position, color, rotationSpeed = 1, heightFactor = 0 }: {
  position: [number, number, number];
  color: string;
  rotationSpeed?: number;
  heightFactor?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Dynamic color based on height
  const colorMix = (heightFactor + 8) / 16;
  const dynamicColor = new THREE.Color().lerpColors(
    new THREE.Color('#8b5cf6'),
    new THREE.Color('#06b6d4'),
    colorMix
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.008 * rotationSpeed;
      meshRef.current.rotation.y += 0.006 * rotationSpeed;
      meshRef.current.rotation.z += 0.004 * rotationSpeed;
      
      // Enhanced floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.4;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[0.6, 0.6, 0.6]}>
      <meshStandardMaterial
        color={dynamicColor}
        transparent
        opacity={0.7}
        emissive={dynamicColor}
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.7}
        wireframe={Math.random() > 0.7}
      />
    </Box>
  );
}

// Enhanced background scene component with dynamic elements
function Scene() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce elements on mobile for performance
  const elementCounts = isMobile 
    ? { nodes: 4, circuits: 3, cubes: 3 }
    : { nodes: 6, circuits: 4, cubes: 5 };

  const neuralNodes = useMemo(() => {
    return Array.from({ length: elementCounts.nodes }, (_, i) => {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10
      ];
      
      // Dynamic color based on height
      const heightFactor = position[1];
      const colorMix = (heightFactor + 4) / 8;
      const colors = ['#8b5cf6', '#06b6d4', '#14b8a6'];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        id: i,
        position,
        color: baseColor,
        pulseSpeed: 0.5 + Math.random() * 1.5,
        heightFactor
      };
    });
  }, [elementCounts.nodes]);

  const circuitPatterns = useMemo(() => {
    return Array.from({ length: elementCounts.circuits }, (_, i) => {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12
      ];
      
      return {
        id: i,
        position,
        size: 0.4 + Math.random() * 0.8,
        heightFactor: position[1]
      };
    });
  }, [elementCounts.circuits]);

  const dataCubes = useMemo(() => {
    return Array.from({ length: elementCounts.cubes }, (_, i) => {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 11
      ];
      
      return {
        id: i,
        position,
        color: ['#06b6d4', '#22d3ee', '#14b8a6'][Math.floor(Math.random() * 3)],
        rotationSpeed: 0.5 + Math.random() * 1.2,
        heightFactor: position[1]
      };
    });
  }, [elementCounts.cubes]);

  return (
    <>
      {/* Camera controls with mouse trail */}
      <CameraControls />
      
      {/* Enhanced lighting setup with dynamic colors */}
      <ambientLight intensity={0.2} />
      
      {/* Main directional light */}
      <directionalLight
        position={[8, 8, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
      />
      
      {/* Dynamic colored accent lights */}
      <pointLight position={[-8, -8, -4]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[8, -4, 6]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[0, 8, -6]} intensity={0.3} color="#14b8a6" />
      
      {/* Enhanced Neural Network Nodes */}
      {neuralNodes.map((node) => (
        <Float
          key={node.id}
          speed={0.8 + Math.random() * 0.5}
          rotationIntensity={0.15}
          floatIntensity={0.2}
        >
          <NeuralNode
            position={node.position}
            color={node.color}
            pulseSpeed={hoveredNode === node.id ? node.pulseSpeed * 2 : node.pulseSpeed}
            onHover={(isHovering) => setHoveredNode(isHovering ? node.id : null)}
          />
        </Float>
      ))}
      
      {/* Enhanced Circuit Patterns with dynamic colors */}
      {circuitPatterns.map((circuit) => (
        <Float
          key={circuit.id}
          speed={0.4 + Math.random() * 0.3}
          rotationIntensity={0.08}
          floatIntensity={0.15}
        >
          <CircuitPattern
            position={circuit.position}
            size={circuit.size}
            heightFactor={circuit.heightFactor}
          />
        </Float>
      ))}
      
      {/* Enhanced Data Cubes with dynamic colors */}
      {dataCubes.map((cube) => (
        <Float
          key={cube.id}
          speed={0.6 + Math.random() * 0.4}
          rotationIntensity={0.3}
          floatIntensity={0.25}
        >
          <DataCube
            position={cube.position}
            color={cube.color}
            rotationSpeed={cube.rotationSpeed}
            heightFactor={cube.heightFactor}
          />
        </Float>
      ))}
    </>
  );
}

// Main Three.js background component with performance optimizations
const ThreeBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: isMobile ? 70 : 60,
          near: 0.1,
          far: 100
        }}
        shadows={!isMobile}
        dpr={isMobile ? [0.5, 1] : [1, 2]}
        performance={{ min: 0.5 }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        onCreated={({ gl }) => {
          console.log('Enhanced Three.js AI Background loaded successfully!');
          gl.setClearColor(0x000000, 0); // Transparent background
          // Performance optimizations for mobile
          if (isMobile) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          }
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