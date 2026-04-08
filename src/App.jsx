import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import { scrollState } from './scrollStore';
import Experience from './Experience';
import TextOverlay from './TextOverlay';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: true,
    });

    const maxScroll = () => document.body.scrollHeight - window.innerHeight;

    lenis.on('scroll', (e) => {
      if (e.progress !== undefined) {
        scrollState.progress = e.progress;
      } else {
        const max = maxScroll();
        if (max > 0) {
          scrollState.progress = Math.max(0, Math.min(1, window.scrollY / max));
        }
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="gradient-bg" />
      <div className="grain-overlay" />
      <div className="fixed-container">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <React.Suspense fallback={null}>
            <Experience />
          </React.Suspense>
        </Canvas>
        <TextOverlay />
      </div>
      <div className="scroll-container" />
    </>
  );
}
