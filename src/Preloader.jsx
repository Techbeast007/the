import { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

export default function Preloader({ onComplete }) {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const minTimeRef = useRef(false);
  const loadedRef = useRef(false);

  // Minimum display time of 2.5s so it feels intentional
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeRef.current = true;
      if (loadedRef.current) {
        triggerExit();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Smooth progress counter
  useEffect(() => {
    const target = Math.round(progress);
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < target) return prev + 1;
        if (prev > target) return target;
        clearInterval(interval);
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [progress]);

  // When loading finishes
  useEffect(() => {
    if (progress >= 100 && !active) {
      loadedRef.current = true;
      if (minTimeRef.current) {
        triggerExit();
      }
    }
  }, [progress, active]);

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1200);
  };

  if (!isVisible) return null;

  return (
    <div className={`preloader ${isExiting ? 'preloader--exit' : ''}`}>
      <div className="preloader__content">
        {/* Animated rose petals */}
        <div className="preloader__rose">
          <svg viewBox="0 0 100 100" className="preloader__rose-svg">
            <defs>
              <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d90429" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8d1b3d" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Petal 1 */}
            <path
              className="preloader__petal preloader__petal--1"
              d="M50 30 Q60 10 50 0 Q40 10 50 30"
              fill="url(#petalGrad)"
            />
            {/* Petal 2 */}
            <path
              className="preloader__petal preloader__petal--2"
              d="M50 30 Q70 20 80 30 Q70 40 50 30"
              fill="url(#petalGrad)"
            />
            {/* Petal 3 */}
            <path
              className="preloader__petal preloader__petal--3"
              d="M50 30 Q60 50 50 60 Q40 50 50 30"
              fill="url(#petalGrad)"
            />
            {/* Petal 4 */}
            <path
              className="preloader__petal preloader__petal--4"
              d="M50 30 Q30 20 20 30 Q30 40 50 30"
              fill="url(#petalGrad)"
            />
            {/* Petal 5 */}
            <path
              className="preloader__petal preloader__petal--5"
              d="M50 30 Q55 15 65 10 Q65 25 50 30"
              fill="url(#petalGrad)"
            />
            {/* Center */}
            <circle cx="50" cy="30" r="4" fill="#d90429" opacity="0.6" className="preloader__center" />
          </svg>
        </div>

        {/* Progress */}
        <div className="preloader__progress-container">
          <div className="preloader__progress-bar">
            <div
              className="preloader__progress-fill"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <span className="preloader__progress-text">{displayProgress}%</span>
        </div>

        {/* Title */}
        <p className="preloader__title">Preparing your experience</p>
      </div>
    </div>
  );
}
