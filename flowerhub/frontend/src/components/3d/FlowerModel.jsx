import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function FlowerModel({ flowerType, position, rotation, scale = 1 }) {
  
  // Custom Petal colors based on flower type
  const flowerColor = useMemo(() => {
    switch (flowerType) {
      case 'rose': return '#E11D48'; // Rich red
      case 'sunflower': return '#F59E0B'; // Bright golden yellow
      case 'lily': return '#FCE7F3'; // Soft blush pink/white
      case 'orchid': return '#C084FC'; // Royal purple/orchid
      case 'jasmine': return '#FFFFFF'; // Crisp Mysuru Mallige white
      case 'tulip': return '#9333EA'; // Deep royal violet tulip
      default: return '#E11D48';
    }
  }, [flowerType]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      
      {/* Green Stem */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 1.4, 8]} />
        <meshStandardMaterial color="#15803D" roughness={0.5} />
      </mesh>

      {/* Stem Leaves */}
      <mesh position={[0.1, -0.4, 0]} rotation={[0.2, 0, -0.6]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} scale={[1.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#166534" roughness={0.4} />
      </mesh>
      <mesh position={[-0.1, -0.7, 0.05]} rotation={[-0.2, 0, 0.6]} castShadow>
        <sphereGeometry args={[0.14, 8, 8]} scale={[1.6, 0.2, 0.5]} />
        <meshStandardMaterial color="#166534" roughness={0.4} />
      </mesh>

      {/* Flower Blossom Top */}
      {flowerType === 'sunflower' ? (
        <group position={[0, 0.1, 0]}>
          {/* Dark Brown Center Disk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
            <meshStandardMaterial color="#451A03" roughness={0.9} />
          </mesh>

          {/* Yellow Ray Petals */}
          {[...Array(14)].map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.32, 0, Math.sin(angle) * 0.32]}
                rotation={[0, -angle, 0.2]}
                castShadow
              >
                <coneGeometry args={[0.09, 0.38, 4]} />
                <meshStandardMaterial color="#F59E0B" roughness={0.3} />
              </mesh>
            );
          })}
        </group>
      ) : flowerType === 'lily' ? (
        <group position={[0, 0.1, 0]}>
          {/* 6 Trumpet Petals */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.15, 0.1, Math.sin(angle) * 0.15]}
                rotation={[0.4, -angle, 0.5]}
                castShadow
              >
                <coneGeometry args={[0.12, 0.5, 5]} />
                <meshStandardMaterial color={flowerColor} roughness={0.25} />
              </mesh>
            );
          })}
          {/* Center Stamens */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
            <meshStandardMaterial color="#FACC15" />
          </mesh>
        </group>
      ) : flowerType === 'orchid' ? (
        <group position={[0, 0.1, 0]}>
          {[...Array(5)].map((_, i) => {
            const angle = (i / 5) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.18, Math.sin(angle * 2) * 0.05, Math.sin(angle) * 0.18]}
                rotation={[0.3, angle, 0.4]}
                castShadow
              >
                <sphereGeometry args={[0.16, 8, 8]} scale={[1.2, 0.3, 0.8]} />
                <meshStandardMaterial color={flowerColor} roughness={0.3} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.05, 0.08]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#F43F5E" />
          </mesh>
        </group>
      ) : flowerType === 'jasmine' ? (
        /* Mysuru Mallige Cluster */
        <group position={[0, 0.1, 0]}>
          {[...Array(5)].map((_, idx) => {
            const offsetX = (idx % 3 - 1) * 0.12;
            const offsetZ = (Math.floor(idx / 3) - 0.5) * 0.12;
            return (
              <group key={idx} position={[offsetX, idx * 0.04, offsetZ]}>
                {[...Array(5)].map((_, i) => {
                  const angle = (i / 5) * Math.PI * 2;
                  return (
                    <mesh key={i} position={[Math.cos(angle) * 0.08, 0, Math.sin(angle) * 0.08]} rotation={[0, angle, 0.3]} castShadow>
                      <coneGeometry args={[0.04, 0.18, 4]} />
                      <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
                    </mesh>
                  );
                })}
              </group>
            );
          })}
        </group>
      ) : (
        /* Rose & Default: Layered spiral petals */
        <group position={[0, 0.1, 0]}>
          {/* Inner Bud Core */}
          <mesh castShadow>
            <sphereGeometry args={[0.16, 12, 12]} scale={[1, 1.2, 1]} />
            <meshStandardMaterial color={flowerColor} roughness={0.3} />
          </mesh>

          {/* Outer Layer 1 Petals */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.14, -0.02, Math.sin(angle) * 0.14]}
                rotation={[0.3, -angle, 0.4]}
                castShadow
              >
                <sphereGeometry args={[0.15, 8, 8]} scale={[1.2, 0.25, 0.9]} />
                <meshStandardMaterial color={flowerColor} roughness={0.3} />
              </mesh>
            );
          })}

          {/* Outer Layer 2 Petals */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 + 0.3;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.22, -0.06, Math.sin(angle) * 0.22]}
                rotation={[0.5, -angle, 0.6]}
                castShadow
              >
                <sphereGeometry args={[0.18, 8, 8]} scale={[1.3, 0.2, 1]} />
                <meshStandardMaterial color={flowerColor} roughness={0.35} />
              </mesh>
            );
          })}
        </group>
      )}

    </group>
  );
}
