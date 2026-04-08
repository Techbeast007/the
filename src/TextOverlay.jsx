import { useEffect, useRef } from 'react';
import { scrollState } from './scrollStore';

export default function TextOverlay() {
  const proj1Ref = useRef(null);
  const proj2Ref = useRef(null);
  const proj3Ref = useRef(null);
  const proj4Ref = useRef(null);
  const transRef = useRef(null);
  const pres1Ref = useRef(null);
  const pres2Ref = useRef(null);
  const pres3Ref = useRef(null);
  const pres4Ref = useRef(null);
  const stoicRef = useRef(null);
  
  const textContainerRef = useRef(null);
  const svggroupRef = useRef(null);
  const textPath1Ref = useRef(null);
  const textPath2Ref = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const p = scrollState.progress;

      // Helper function to fade in and out an element based on scroll bounds
      const updateOpacity = (el, start, end, fadeOutStart, fadeOutEnd) => {
        if (!el) return;
        let opacity = 0;
        if (p >= start && p < end) {
          if (p < fadeOutStart) {
            opacity = (p - start) / (fadeOutStart - start); // fade in
          } else {
            opacity = 1; // hold
          }
        } else if (p >= end && p < fadeOutEnd) {
          opacity = 1 - ((p - end) / (fadeOutEnd - end)); // fade out
        }
        // Cap opacity between 0 and 1
        opacity = Math.max(0, Math.min(1, opacity));
        el.style.opacity = opacity;
        el.style.transform = `translateY(${20 * (1 - opacity)}px)`;
      };

      // 1. Projection (0 -> 0.4)
      // Pair A: "We fall in love" (Left) & "with an idea" (Right)
      updateOpacity(proj1Ref.current, -0.1, 0.12, 0.0, 0.18);
      updateOpacity(proj2Ref.current, -0.05, 0.12, 0.05, 0.18);

      // Pair B: "A beautiful dream" (Left) & "of what could be" (Right)
      updateOpacity(proj3Ref.current, 0.20, 0.32, 0.24, 0.38);
      updateOpacity(proj4Ref.current, 0.22, 0.32, 0.26, 0.38);

      // 2. Transition (0.4 -> 0.6)
      // Morphing effect: We just fade one text in, then change its innerHTML or use two separate spans
      if (transRef.current) {
        let opacity = 0;
        if (p >= 0.35 && p < 0.6) {
          if (p < 0.45) opacity = (p - 0.35) / 0.1; // fade in
          else if (p > 0.55) opacity = 1 - ((p - 0.55) / 0.05); // fade out
          else opacity = 1;
        }
        opacity = Math.max(0, Math.min(1, opacity));
        transRef.current.style.opacity = opacity;
        
        if (p >= 0.5) {
          transRef.current.innerText = "And so is the experience.";
        } else {
          transRef.current.innerText = "The idea is beautiful...";
        }
      }

      // 3. Presence (0.6 -> 0.8)
      // Pair C: "When the dream" (Left) & "meets reality..." (Right)
      updateOpacity(pres1Ref.current, 0.60, 0.70, 0.64, 0.76);
      updateOpacity(pres2Ref.current, 0.62, 0.70, 0.66, 0.76);

      // Pair D: "It doesn't shatter." (Left) & "It deepens." (Right)
      updateOpacity(pres3Ref.current, 0.74, 0.82, 0.78, 0.88);
      updateOpacity(pres4Ref.current, 0.75, 0.82, 0.79, 0.88);

      // 4. Stoic Paragraph (0.85 -> 0.95)
      updateOpacity(stoicRef.current, 0.85, 1.0, 0.9, 1.5);

      // 5. The Realization (0.9 -> 1.0)
      if (svggroupRef.current && textPath1Ref.current && textPath2Ref.current) {
        if (p > 0.92) {
          svggroupRef.current.style.opacity = 1;
          // Progress from 0.93 to 0.98 is the "drawing" phase
          let drawP = (p - 0.93) / 0.05;
          drawP = Math.max(0, Math.min(1, drawP));
          
          // Easing power2.out
          const easeDrawP = 1 - Math.pow(1 - drawP, 2);
          
          // Assuming max dash array is ~300
          const offset = 300 - (easeDrawP * 300);
          textPath1Ref.current.style.strokeDashoffset = offset;
          
          // Delay second line slightly
          let drawP2 = (p - 0.95) / 0.05;
          drawP2 = Math.max(0, Math.min(1, drawP2));
          const offset2 = 400 - (drawP2 * 400);
          textPath2Ref.current.style.strokeDashoffset = offset2;

          // Fade in fill after drawing
          if (p > 0.98) {
             let fillOpacity = (p - 0.98) / 0.02;
             fillOpacity = Math.max(0, Math.min(1, fillOpacity));
             textPath1Ref.current.style.fill = `rgba(255,255,255,${fillOpacity})`;
             textPath2Ref.current.style.fill = `rgba(255,255,255,${fillOpacity})`;
          } else {
             textPath1Ref.current.style.fill = 'transparent';
             textPath2Ref.current.style.fill = 'transparent';
          }

        } else {
          svggroupRef.current.style.opacity = 0;
          textPath1Ref.current.style.strokeDashoffset = 300;
          textPath2Ref.current.style.strokeDashoffset = 400;
          textPath1Ref.current.style.fill = 'transparent';
          textPath2Ref.current.style.fill = 'transparent';
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="text-overlay" ref={textContainerRef}>
      
      <div className="text-group" style={{ position: 'absolute', top: '25%', textAlign: 'left', width: '90%', left: '5%' }}>
        <h1 ref={proj1Ref} className="title-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>We fall in love</h1>
      </div>
      <div className="text-group" style={{ position: 'absolute', top: '65%', textAlign: 'right', width: '90%', left: '5%' }}>
        <h1 ref={proj2Ref} className="title-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>with an idea</h1>
      </div>
      <div className="text-group" style={{ position: 'absolute', top: '40%', textAlign: 'left', width: '90%', left: '5%' }}>
        <h2 ref={proj3Ref} className="subtitle-text">A beautiful dream</h2>
      </div>
      <div className="text-group" style={{ position: 'absolute', top: '60%', textAlign: 'right', width: '90%', left: '5%' }}>
        <h2 ref={proj4Ref} className="subtitle-text">of what could be</h2>
      </div>

      <div className="text-group" style={{ position: 'absolute', top: '50%', textAlign: 'center', width: '100%' }}>
        <h1 ref={transRef} className="title-text">The idea is beautiful...</h1>
      </div>

      <div className="text-group" style={{ position: 'absolute', top: '30%', textAlign: 'left', width: '90%', left: '5%' }}>
        <h2 ref={pres1Ref} className="subtitle-text">When the dream</h2>
      </div>
      <div className="text-group" style={{ position: 'absolute', top: '60%', textAlign: 'right', width: '90%', left: '5%' }}>
        <h2 ref={pres2Ref} className="subtitle-text">meets reality...</h2>
      </div>
      <div className="text-group" style={{ position: 'absolute', top: '35%', textAlign: 'left', width: '90%', left: '5%' }}>
        <h1 ref={pres3Ref} className="title-text" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>It doesn't shatter.</h1>
      </div>
      <div className="text-group" style={{ position: 'absolute', top: '65%', textAlign: 'right', width: '90%', left: '5%' }}>
        <h1 ref={pres4Ref} className="title-text" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>It deepens.</h1>
      </div>

      <div className="text-group" style={{ position: 'absolute', top: '25%', textAlign: 'center', width: '100%' }}>
        <p ref={stoicRef} className="stoic-paragraph">The idea of love is the seed, while the experience is the bloom. Both are equally profound, forming one beautiful truth. If you simply allow it to unfold, reality becomes just as breathtaking as the dream.</p>
      </div>

      <div className="handwritten-container" style={{ position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', pointerEvents: 'none' }} ref={svggroupRef}>
        <svg className="handwritten-svg" viewBox="0 0 500 120">
          <text 
            ref={textPath1Ref} 
            x="50%" y="40%" 
            textAnchor="middle" 
            fontFamily="'Alex Brush', cursive" 
            fontSize="32" 
            fill="transparent" 
            stroke="#ffffff" 
            strokeWidth="1" 
            strokeDasharray="300" 
            strokeDashoffset="300"
          >
            Allow the idea...
          </text>
          <text 
            ref={textPath2Ref} 
            x="50%" y="85%" 
            textAnchor="middle" 
            fontFamily="'Alex Brush', cursive" 
            fontSize="32" 
            fill="transparent" 
            stroke="#ffffff" 
            strokeWidth="1" 
            strokeDasharray="400" 
            strokeDashoffset="400"
          >
            to become the experience.
          </text>
        </svg>
      </div>

    </div>
  );
}
