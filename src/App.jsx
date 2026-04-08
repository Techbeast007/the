import React, { useEffect, useState, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import { scrollState } from './scrollStore';
import Experience from './Experience';
import TextOverlay from './TextOverlay';
import Preloader from './Preloader';

function ScrollIndicator() {
  const [visible, setVisible] = useState(false);
  const indicatorRef = useRef(null);

  useEffect(() => {
    // Show after a brief delay
    const showTimer = setTimeout(() => setVisible(true), 500);

    let animationFrameId;
    const check = () => {
      if (scrollState.progress > 0.03) {
        setVisible(false);
      }
      animationFrameId = requestAnimationFrame(check);
    };
    check();

    return () => {
      clearTimeout(showTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={indicatorRef}
      className={`scroll-indicator ${!visible ? 'scroll-indicator--hidden' : ''}`}
    >
      <span className="scroll-indicator__text">Scroll to explore</span>
      <div className="scroll-indicator__line" />
      <div className="scroll-indicator__chevron">
        <svg viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

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
      <Preloader onComplete={() => setLoaded(true)} />
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
      {loaded && <ScrollIndicator />}
      <div className="scroll-container" />
    </>
  );
}
