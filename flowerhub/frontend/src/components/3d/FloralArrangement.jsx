import React, { useMemo } from 'react';
import FlowerModel from './FlowerModel';
import VaseModel from './VaseModel';

export default function FloralArrangement({ primaryFlower, secondaryFlower, style, stemCount, vaseStyle }) {
  
  // Calculate flower stem positions & angles based on arrangement style & stem count
  const stems = useMemo(() => {
    const arr = [];
    const count = Number(stemCount) || 12;

    for (let i = 0; i < count; i++) {
      const isSecondary = secondaryFlower !== 'none' && i % 3 === 0;
      const fType = isSecondary ? secondaryFlower : primaryFlower;

      let x = 0, y = 0, z = 0;
      let rotX = 0, rotY = 0, rotZ = 0;
      let scale = 1;

      if (style === 'tall') {
        // Central high column with surrounding stepped stems
        const radius = (i / count) * 0.45;
        const angle = (i / count) * Math.PI * 2 * 2;
        const heightFactor = 1 - (i / count) * 0.4;

        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = 0.8 + heightFactor * 1.4;

        rotX = (Math.random() - 0.5) * 0.3;
        rotY = angle;
        rotZ = (Math.random() - 0.5) * 0.3;
        scale = 0.9 + Math.random() * 0.2;
      } 
      else if (style === 'wide') {
        // Spreading fan shape
        const t = i / (count - 1);
        const fanAngle = (t - 0.5) * Math.PI * 0.8;
        const dist = 0.4 + Math.sin(t * Math.PI) * 0.6;

        x = Math.sin(fanAngle) * dist;
        z = (Math.random() - 0.5) * 0.4;
        y = 0.6 + Math.cos(fanAngle) * 0.8;

        rotZ = -fanAngle * 0.7;
        rotY = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
        rotX = (Math.random() - 0.5) * 0.3;
        scale = 0.85 + Math.random() * 0.25;
      } 
      else if (style === 'compact') {
        // Dense spherical dome
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = 0.65;

        x = Math.cos(theta) * Math.sin(phi) * radius;
        z = Math.sin(theta) * Math.sin(phi) * radius;
        y = 0.7 + Math.cos(phi) * 0.45;

        rotX = (Math.random() - 0.5) * 0.4;
        rotY = theta;
        rotZ = (Math.random() - 0.5) * 0.4;
        scale = 0.8 + Math.random() * 0.2;
      } 
      else {
        // Asymmetric Modern (sculptural offset heights)
        const angle = (i / count) * Math.PI * 2;
        const offset = (i % 4) * 0.3;

        x = Math.cos(angle) * (0.3 + offset * 0.4);
        z = Math.sin(angle) * (0.3 + offset * 0.4);
        y = 0.7 + (i % 5) * 0.35;

        rotX = (i % 2 === 0 ? 0.3 : -0.2);
        rotY = angle;
        rotZ = (i % 3 === 0 ? 0.4 : -0.3);
        scale = 0.9 + (i % 3) * 0.15;
      }

      arr.push({
        id: i,
        flowerType: fType,
        position: [x, y, z],
        rotation: [rotX, rotY, rotZ],
        scale: scale
      });
    }

    return arr;
  }, [primaryFlower, secondaryFlower, style, stemCount]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* 3D Vase Base */}
      <VaseModel vaseStyle={vaseStyle} />

      {/* Group of 3D Flower Stems */}
      <group position={[0, 0, 0]}>
        {stems.map((stem) => (
          <FlowerModel
            key={stem.id}
            flowerType={stem.flowerType}
            position={stem.position}
            rotation={stem.rotation}
            scale={stem.scale}
          />
        ))}
      </group>
    </group>
  );
}
