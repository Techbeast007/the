import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from './scrollStore';

const colorRed = new THREE.Color('#d90429');
const colorNeutral = new THREE.Color('#a5a5b5');
const colorBlue = new THREE.Color('#8d99ae');
const colorDim = new THREE.Color('#6c757d');

export default function Rose() {
  const mainRoseRef = useRef();
  const mainMatsRef = useRef([]);

  // Load the downloaded GLTF model
  const { scene: originalScene } = useGLTF('/rose/scene.gltf');

  // We only need one instance now
  const mainScene = useMemo(() => {
    const cloned = originalScene.clone(true);
    const mats = [];
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone the original material to preserve textures and maps
        child.material = child.material.clone();
        child.material.userData.originalColor = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff);
        child.material.side = THREE.DoubleSide;
        mats.push(child.material);
      }
    });
    mainMatsRef.current = mats;
    
    // Attempt to center and scale the model somewhat reasonably
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale it down/up to fit within a 3 unit bounding sphere roughly
    if (maxDim > 0) {
      const scale = 3 / maxDim;
      cloned.scale.setScalar(scale);
      cloned.position.copy(center).multiplyScalar(-scale);
    }

    return cloned;
  }, [originalScene]);

  useFrame((state, delta) => {
    const p = scrollState.progress;
    
    if (mainRoseRef.current && mainMatsRef.current.length > 0) {
      // Rotation logic 
      let rotationSpeed = 0.25;
      if (p < 0.4) {
        rotationSpeed = 0.5;
      } else if (p > 0.9) {
        rotationSpeed = 0.05;
      } else {
        rotationSpeed = THREE.MathUtils.lerp(0.5, 0.05, (p - 0.4) / 0.5);
      }
      
      // Spining around its own stem (Y-axis) so it stays upright
      mainRoseRef.current.rotation.y += delta * rotationSpeed;
      mainRoseRef.current.rotation.z = 0;

      let currentGoalScale = 1.3; // Fixed, larger premium size
      let currentGoalRotX = 0;
      
      // Sink down motion, X-tilt (pitch forward), and zoom at the end
      if (p > 0.85) {
        const t = Math.min(1, Math.max(0, (p - 0.85) / 0.15));
        const targetY = THREE.MathUtils.lerp(0, -0.6, t); // Sinks slightly, creating perfect center alignment for ending
        mainRoseRef.current.position.y = THREE.MathUtils.lerp(mainRoseRef.current.position.y, targetY, 0.05);

        // Tilt forward towards the user slightly and zoom in by 35%
        currentGoalRotX = THREE.MathUtils.lerp(0, Math.PI / 4.5, t);
        currentGoalScale = THREE.MathUtils.lerp(1, 1.35, t);
      } else {
        mainRoseRef.current.position.y = THREE.MathUtils.lerp(mainRoseRef.current.position.y, 0, 0.05);
      }

      // Smoothly apply the X rotation tilt
      mainRoseRef.current.rotation.x = THREE.MathUtils.lerp(mainRoseRef.current.rotation.x, currentGoalRotX, 0.05);
      
      // Apply scale
      mainRoseRef.current.scale.setScalar(currentGoalScale);

      // Color/Emissive filters logic
      let tintColor = colorRed;
      let mixFactor = 0;
      let emColor = colorRed;
      let emIntensity = 0;

      if (p < 0.4) {
        tintColor = colorRed;
        mixFactor = 0.5; 
        emColor = colorRed;
        emIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      } else if (p < 0.6) {
        const t = (p - 0.4) / 0.2;
        tintColor = new THREE.Color().copy(colorRed).lerp(colorNeutral, t * 2).lerp(colorBlue, Math.max(0, t * 2 - 1));
        mixFactor = THREE.MathUtils.lerp(0.5, 0.2, t);
        emIntensity = THREE.MathUtils.lerp(0.5, 0, t);
      } else if (p < 0.9) {
        tintColor = colorBlue;
        mixFactor = 0.2;
        emIntensity = 0;
      } else {
        const t = (p - 0.9) / 0.1;
        tintColor = new THREE.Color().copy(colorBlue).lerp(colorDim, t);
        mixFactor = THREE.MathUtils.lerp(0.2, 0.5, t); 
        emIntensity = 0;
      }

      for (let mat of mainMatsRef.current) {
        if (mat.userData.originalColor) {
          mat.color.copy(mat.userData.originalColor).lerp(tintColor, mixFactor);
        }
        mat.emissive.copy(emColor);
        mat.emissiveIntensity = emIntensity;
      }
      
      mainRoseRef.current.visible = true;
    }
  });

  return (
    <group ref={mainRoseRef}>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <primitive object={mainScene} />
      </Float>
    </group>
  );
}

useGLTF.preload('/rose/scene.gltf');
