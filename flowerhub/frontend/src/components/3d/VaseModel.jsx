import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function VaseModel({ vaseStyle }) {
  // Generate geometry shape for lathe vase or curved cylinder
  const vaseGeometry = useMemo(() => {
    if (vaseStyle === 'classic_porcelain') {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const y = (t - 0.5) * 2.2;
        let r = 0.5;
        if (t < 0.2) r = 0.5 + t * 0.8;
        else if (t < 0.7) r = 0.66 - Math.sin((t - 0.2) * Math.PI * 2) * 0.2;
        else r = 0.45 + Math.sin((t - 0.7) * Math.PI) * 0.2;
        points.push(new THREE.Vector2(r, y));
      }
      return new THREE.LatheGeometry(points, 32);
    }

    if (vaseStyle === 'crystal_glass') {
      const points = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const y = (t - 0.5) * 2.0;
        const r = 0.45 + Math.pow(t - 0.5, 2) * 0.6;
        points.push(new THREE.Vector2(r, y));
      }
      return new THREE.LatheGeometry(points, 32);
    }

    if (vaseStyle === 'royal_gold') {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const y = (t - 0.5) * 2.4;
        let r = 0.6;
        if (t < 0.3) r = 0.5 + t * 0.7;
        else if (t < 0.8) r = 0.71 - (t - 0.3) * 0.6;
        else r = 0.4 + (t - 0.8) * 0.5;
        points.push(new THREE.Vector2(r, y));
      }
      return new THREE.LatheGeometry(points, 32);
    }

    if (vaseStyle === 'rustic_terracotta') {
      const points = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const y = (t - 0.5) * 1.8;
        const r = 0.6 - Math.sin(t * Math.PI) * 0.15;
        points.push(new THREE.Vector2(r, y));
      }
      return new THREE.LatheGeometry(points, 32);
    }

    // Default: modern_ceramic (Sleek cylinder with tapered neck)
    const points = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const y = (t - 0.5) * 2.2;
      let r = 0.55;
      if (t > 0.75) r = 0.55 - (t - 0.75) * 0.5;
      points.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(points, 32);
  }, [vaseStyle]);

  return (
    <group position={[0, -1, 0]}>
      {vaseStyle === 'crystal_glass' ? (
        <mesh geometry={vaseGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#E0F2FE"
            transmission={0.85}
            opacity={1}
            transparent={true}
            roughness={0.08}
            ior={1.5}
            thickness={0.8}
            specularIntensity={1}
          />
        </mesh>
      ) : vaseStyle === 'royal_gold' ? (
        <mesh geometry={vaseGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
      ) : vaseStyle === 'classic_porcelain' ? (
        <mesh geometry={vaseGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#F8FAFC"
            metalness={0.1}
            roughness={0.15}
          />
        </mesh>
      ) : vaseStyle === 'rustic_terracotta' ? (
        <mesh geometry={vaseGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#C2410C"
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      ) : (
        /* modern_ceramic (Lavender / Soft Purple Matte) */
        <mesh geometry={vaseGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#E9D5FF"
            roughness={0.35}
            metalness={0.05}
          />
        </mesh>
      )}

      {/* Decorative Gold Rim Ring for Porcelain & Royal styles */}
      {(vaseStyle === 'classic_porcelain' || vaseStyle === 'royal_gold') && (
        <mesh position={[0, 1.1, 0]} castShadow>
          <torusGeometry args={[0.48, 0.03, 16, 32]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </mesh>
      )}
    </group>
  );
}
