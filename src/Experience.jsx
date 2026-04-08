import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from './scrollStore';
import Rose from './Rose';

const colorWhite = new THREE.Color('#ffffff');
const colorLightBlue = new THREE.Color('#f4f8ff'); // very subtle blue tint

export default function Experience() {
  const sceneRef = useRef();

  useFrame((state) => {
    const p = scrollState.progress;
    
    // state.scene.background = bgColor; // Removed so CSS background shows

    // Camera zoom out slightly at the end (0.9 to 1.0)
    let targetZ = 8;
    if (p > 0.9) {
      const t = (p - 0.9) / 0.1;
      targetZ = 8 + t * 2; // Move camera from 8 to 10
    }
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
  });

  return (
    <group ref={sceneRef}>
      {/* Soft environment lighting */}
      <Environment preset="studio" />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#e0eaff" />
      
      <Rose />
    </group>
  );
}
