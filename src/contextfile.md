Create a minimalist, high-performance interactive web experience inspired by Awwwards-level design using React, React Three Fiber (R3F), GSAP, and Lenis.

## Core Concept

This is not a typical website. It is a philosophical interactive experience about:
"Projection vs Presence in Love"

The experience must feel immersive, smooth, minimal, and emotionally driven — not flashy or over-animated.

---

## Visual Style

* Background: clean white (#ffffff), behaves like paper
* No clutter, lots of whitespace
* Typography: elegant, large, well spaced (serif or modern minimal sans)
* Entire design should feel premium and calm

---

## Main Element

* A single 3D rose (GLTF model) centered on screen
* This is the only 3D object
* It represents the emotional state and must transform based on scroll

---

## Scroll System

* Use Lenis for smooth scrolling
* Map scroll progress to a normalized value (0 → 1)
* All animations must be driven by this single value

---

## Emotional States

### 1. Projection (scroll 0 → 0.4)

* Rose:

  * Rich red color
  * High emissive glow
  * Slight pulse scaling
  * Slightly faster rotation
* Background:

  * Pure white
* Text:
  "Love feels intense"
  "It feels complete"
  "You see what you want to feel"

---

### 2. Transition (scroll 0.4 → 0.6)

* Rose:

  * Glow fades
  * Color shifts red → neutral → blue
  * Slight imperfection/distortion (very subtle)
* Background:

  * White begins tinting slightly cool
* Text morphs smoothly:
  "It feels..." → "It is..."

---

### 3. Presence (scroll 0.6 → 1)

* Rose:

  * Desaturated, slightly bluish tone
  * Very slow rotation
  * No glow
* Background:

  * White with very subtle blue tint
* Text:
  "And when projection fades..."
  "What remains is presence"

---

## Final Message (end of scroll)

Display:
"What you feel shapes what you see.
And what you see shapes what you feel."

---

## Animation Rules

* All animations must be subtle and smooth (no abrupt jumps)
* No excessive effects
* No unnecessary particles
* Focus on emotional transitions, not visual noise

---

## Color System

Use a single interpolation variable (t = scroll progress)

* Rose color: interpolate from red → blue
* Background: white → very light blue tint
* Text: black → soft gray

Everything must stay in sync

---

## Performance Constraints (IMPORTANT)

* Must run smoothly on mobile devices
* Limit model complexity (<50k vertices)
* Disable heavy post-processing
* Avoid shadows if possible
* Use lightweight lighting
* Optimize rendering (frameloop where possible)

---

## Libraries

* react-three-fiber (R3F)
* @react-three/drei
* GSAP (for text animations only)
* Lenis (for scroll smoothing)

---

## Interaction Philosophy

* No visible controls
* No buttons
* No UI clutter
* User only scrolls
* The system responds subtly to scroll

---

## Output Requirements

* Clean component structure
* Separate logic for:

  * Scroll handling
  * 3D rendering
  * Text animation
* Code should be readable and production-ready

---

## Goal

The final result should feel like:
A calm, poetic, emotionally intelligent digital experience — not a typical animated website.

Avoid overdesign. Prioritize meaning over effects.
## Scene Title: The Realization

### Timing

Trigger when scrollProgress reaches ~0.9 → 1

---

## 1. Transition to Silence

* Fade out all previous text completely
* Rose becomes almost still (very slow rotation or stop)
* Background: clean white with very subtle blue tint
* No particles, no distractions

Emotion:
Everything feels empty, but not hollow — calm.

---

## 2. Camera Behavior

* Slight zoom out (very subtle)
* Give breathing space around the rose
* Center composition, no movement after this

---

## 3. Rose Movement

* A second rose instance (or same repositioned) enters from top
* Very slow downward motion
* No bounce, no physics exaggeration

IMPORTANT:
It should NOT "fall"
It should feel like it is "arriving"

Final position:
Gently rests near bottom-center of screen

---

## 4. Handwritten Text Appearance

Text should NOT type.
It should be drawn like ink on paper.

Use SVG path animation (stroke reveal)

---

## 5. Final Handwritten Message

(Place slightly above or beside the resting rose)

"What you call love…
is often your own reflection."

---

## 6. Animation Details

* Stroke animation duration: ~2–3 seconds
* Ease: smooth (power2.out or similar)
* Slight delay after rose settles (~0.5–1s)

---

## 7. Final Hold

* No further motion
* Let the scene breathe
* No CTA, no buttons, nothing

The user should sit with the message.

---

## 8. Optional Micro Detail (Premium Touch)

* Very subtle ink spread effect after text appears
* Or slight paper grain texture

Keep it almost unnoticeable.

---

## 9. Exit Behavior

Do nothing.

No forced ending.
No scroll snap.

Let the user decide when to leave.

---

## Goal

The ending should feel like:
A quiet realization — not a conclusion, not a lesson.

Something that lingers.
