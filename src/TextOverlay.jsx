import { useEffect, useRef } from 'react';
import { scrollState } from './scrollStore';

// Splits text into word spans for individual fill control
function WordFillText({ text, className, style }) {
  const words = text.split(' ');
  return (
    <span className={`fill-text ${className || ''}`} style={style}>
      {words.map((word, i) => (
        <span key={i} className="fill-word" data-word-index={i}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/*
  SCROLL TIMELINE — Properly spaced with clear breathing gaps.
  Each section has:
    - fadeIn:  rangeStart - 0.03  →  rangeStart  (opacity 0→1)
    - fill:   rangeStart → rangeEnd              (words fill)
    - fadeOut: rangeEnd → rangeEnd + 0.03         (opacity 1→0)
  
  Gap between sections = at least 0.04 (so fadeOut of prev doesn't overlap fadeIn of next)
*/

const SECTIONS = [
  {
    id: 'act-1a',
    lines: [
      { text: 'We fall in love', className: 'fill-hero' },
    ],
    range: [0.02, 0.10],
    layout: 'left-top',
  },
  {
    id: 'act-1b',
    lines: [
      { text: 'with an idea', className: 'fill-hero fill-hero--italic' },
    ],
    range: [0.10, 0.17],
    layout: 'right-bottom',
  },
  {
    id: 'act-2',
    lines: [
      { text: 'A beautiful dream', className: 'fill-caption' },
      { text: 'of what could be', className: 'fill-caption' },
    ],
    range: [0.22, 0.32],
    layout: 'center',
  },
  {
    id: 'act-3a',
    lines: [
      { text: 'The idea is beautiful...', className: 'fill-statement' },
    ],
    range: [0.37, 0.46],
    layout: 'center',
  },
  {
    id: 'act-3b',
    lines: [
      { text: 'And so is the experience.', className: 'fill-statement' },
    ],
    range: [0.49, 0.57],
    layout: 'center',
  },
  {
    id: 'act-4',
    lines: [
      { text: 'When the dream', className: 'fill-caption' },
      { text: 'meets reality...', className: 'fill-caption' },
    ],
    range: [0.62, 0.70],
    layout: 'center',
  },
  {
    id: 'act-5a',
    lines: [
      { text: "It doesn't shatter.", className: 'fill-hero' },
    ],
    range: [0.74, 0.80],
    layout: 'left-center',
  },
  {
    id: 'act-5b',
    lines: [
      { text: 'It deepens.', className: 'fill-hero fill-hero--accent' },
    ],
    range: [0.80, 0.86],
    layout: 'right-center',
  },
  {
    id: 'stoic',
    lines: [
      { text: 'The idea of love is the seed,', className: 'fill-body' },
      { text: 'while the experience is the bloom.', className: 'fill-body' },
      { text: 'Both are equally profound,', className: 'fill-body' },
      { text: 'forming one beautiful truth.', className: 'fill-body' },
    ],
    range: [0.89, 0.96],
    layout: 'center-top',
  },
];

// Layout positioning map — each section gets unique, cinematic placement
const LAYOUT_STYLES = {
  'left-top': {
    top: '20%',
    left: '6%',
    right: 'auto',
    textAlign: 'left',
    transform: 'none',
    maxWidth: '70vw',
  },
  'right-bottom': {
    top: 'auto',
    bottom: '22%',
    left: 'auto',
    right: '6%',
    textAlign: 'right',
    transform: 'none',
    maxWidth: '70vw',
  },
  'center': {
    top: '50%',
    left: '50%',
    right: 'auto',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80vw',
  },
  'left-center': {
    top: '40%',
    left: '6%',
    right: 'auto',
    textAlign: 'left',
    transform: 'none',
    maxWidth: '75vw',
  },
  'right-center': {
    top: '58%',
    left: 'auto',
    right: '6%',
    textAlign: 'right',
    transform: 'none',
    maxWidth: '75vw',
  },
  'center-top': {
    top: '18%',
    left: '50%',
    right: 'auto',
    textAlign: 'center',
    transform: 'translateX(-50%)',
    maxWidth: '600px',
  },
};

const FADE_DURATION = 0.03; // 3% scroll for fade in/out

export default function TextOverlay() {
  const containerRef = useRef(null);
  const svggroupRef = useRef(null);
  const textPath1Ref = useRef(null);
  const textPath2Ref = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const p = scrollState.progress;
      const container = containerRef.current;
      if (!container) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Process each section
      SECTIONS.forEach((section) => {
        const sectionEl = container.querySelector(`[data-section="${section.id}"]`);
        if (!sectionEl) return;

        const [rangeStart, rangeEnd] = section.range;
        const words = sectionEl.querySelectorAll('.fill-word');
        const totalWords = words.length;

        // FADE ZONES:
        // fadeIn:  rangeStart - FADE_DURATION  →  rangeStart
        // active:  rangeStart  →  rangeEnd
        // fadeOut: rangeEnd  →  rangeEnd + FADE_DURATION
        const fadeInStart = rangeStart - FADE_DURATION;
        const fadeOutEnd = rangeEnd + FADE_DURATION;

        let opacity = 0;
        let translateY = 25;

        if (p >= fadeInStart && p < rangeStart) {
          // Fading in
          const t = (p - fadeInStart) / FADE_DURATION;
          opacity = t;
          translateY = 25 * (1 - t);
        } else if (p >= rangeStart && p <= rangeEnd) {
          // Fully visible & filling
          opacity = 1;
          translateY = 0;
        } else if (p > rangeEnd && p <= fadeOutEnd) {
          // Fading out
          const t = 1 - ((p - rangeEnd) / FADE_DURATION);
          opacity = t;
          translateY = -15 * (1 - t);
        } else {
          // Invisible
          opacity = 0;
          translateY = p < fadeInStart ? 25 : -15;
        }

        sectionEl.style.opacity = opacity;

        // Apply translateY while preserving existing transform from layout
        const layout = LAYOUT_STYLES[section.layout];
        if (layout.transform && layout.transform !== 'none') {
          sectionEl.style.transform = `${layout.transform} translateY(${translateY}px)`;
        } else {
          sectionEl.style.transform = `translateY(${translateY}px)`;
        }

        // Word-by-word fill
        if (totalWords > 0 && opacity > 0) {
          const sectionProgress = Math.max(0, Math.min(1, (p - rangeStart) / (rangeEnd - rangeStart)));
          const fillCount = sectionProgress * totalWords;

          words.forEach((word, i) => {
            if (i < Math.floor(fillCount)) {
              word.classList.add('fill-word--active');
            } else if (i === Math.floor(fillCount)) {
              // Current word — partial fill via opacity blend
              const partial = fillCount - Math.floor(fillCount);
              if (partial > 0.3) {
                word.classList.add('fill-word--active');
              } else {
                word.classList.remove('fill-word--active');
              }
            } else {
              word.classList.remove('fill-word--active');
            }
          });
        } else if (totalWords > 0) {
          // Section not visible — reset all words
          words.forEach((word) => word.classList.remove('fill-word--active'));
        }
      });

      // Handwritten SVG reveal (kept from original)
      if (svggroupRef.current && textPath1Ref.current && textPath2Ref.current) {
        if (p > 0.94) {
          svggroupRef.current.style.opacity = 1;
          let drawP = (p - 0.94) / 0.04;
          drawP = Math.max(0, Math.min(1, drawP));
          const easeDrawP = 1 - Math.pow(1 - drawP, 2);
          const offset = 300 - (easeDrawP * 300);
          textPath1Ref.current.style.strokeDashoffset = offset;

          let drawP2 = (p - 0.96) / 0.04;
          drawP2 = Math.max(0, Math.min(1, drawP2));
          const offset2 = 400 - (drawP2 * 400);
          textPath2Ref.current.style.strokeDashoffset = offset2;

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
    <div className="text-overlay" ref={containerRef}>
      {SECTIONS.map((section) => {
        const layout = LAYOUT_STYLES[section.layout];
        return (
          <div
            key={section.id}
            data-section={section.id}
            className={`fill-section fill-section--${section.layout}`}
            style={{
              position: 'absolute',
              top: layout.top || 'auto',
              bottom: layout.bottom || 'auto',
              left: layout.left || 'auto',
              right: layout.right || 'auto',
              textAlign: layout.textAlign,
              maxWidth: layout.maxWidth,
              opacity: 0,
            }}
          >
            {section.lines.map((line, i) => (
              <div key={i} className="fill-line">
                <WordFillText text={line.text} className={line.className} />
              </div>
            ))}
          </div>
        );
      })}

      {/* Handwritten SVG reveal */}
      <div
        className="handwritten-container"
        ref={svggroupRef}
        style={{ opacity: 0 }}
      >
        <svg className="handwritten-svg" viewBox="0 0 500 120">
          <text
            ref={textPath1Ref}
            x="50%"
            y="40%"
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
            x="50%"
            y="85%"
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
