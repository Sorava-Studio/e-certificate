# Animation Guide

This document describes all the Framer Motion animations implemented in the Certificate app homepage.

## Libraries Used
- **Framer Motion** (v12.23.22) - Production-ready motion library for React

## Animation Types

### 1. **Fade In Up** (`fadeInUp`)
Elements fade in while moving up slightly from below.
- **Initial:** Opacity 0, Y position 20px down
- **Animate:** Opacity 1, Y position 0
- **Duration:** 0.5s
- **Used in:** Hero section text and buttons, pricing headers, stats header, CTA section

### 2. **Fade In** (`fadeIn`)
Simple fade-in effect without movement.
- **Initial:** Opacity 0
- **Animate:** Opacity 1
- **Duration:** 0.5s
- **Used in:** Footer section

### 3. **Scale In** (`scaleIn`)
Elements scale up from slightly smaller while fading in.
- **Initial:** Opacity 0, Scale 0.95
- **Animate:** Opacity 1, Scale 1
- **Duration:** 0.5s
- **Used in:** Feature cards, stats cards

### 4. **Slide In Left** (`slideInLeft`)
Elements slide in from the left side.
- **Initial:** Opacity 0, X position -20px
- **Animate:** Opacity 1, X position 0
- **Duration:** 0.5s
- **Used in:** Paper certificate limitations card

### 5. **Slide In Right** (`slideInRight`)
Elements slide in from the right side.
- **Initial:** Opacity 0, X position 20px
- **Animate:** Opacity 1, X position 0
- **Duration:** 0.5s
- **Used in:** Digital certificate advantages card

### 6. **Stagger Container** (`staggerContainer`)
Parent container that staggers the animation of its children.
- **Stagger delay:** 0.1s between children
- **Used in:** Hero section, feature cards, pricing cards, stats cards

## Interactive Animations

### Hover Effects
- **Button hover:** Scale 1.05 (5% larger)
- **Button tap:** Scale 0.95 (5% smaller)
- **Card hover:** Shadow increases (via CSS `hover:shadow-lg`)
- **Logo hover:** Scale 1.05

### Navigation Animation
- **Initial state:** Y position -100px (hidden above viewport)
- **Animate:** Slides down to Y position 0
- **Duration:** 0.5s with easeOut easing

## Scroll-Based Animations

All sections except the hero use `whileInView` to trigger animations when scrolling:
- **Viewport trigger:** `once: true` (animation plays only once)
- **Margin:** `-100px` (triggers 100px before entering viewport)

### Sections with scroll animations:
1. Problem vs Solution comparison
2. Features grid
3. Pricing section
4. Stats section
5. Final CTA
6. Footer

## Performance Optimizations

1. **`once: true`** - Animations play only once, reducing re-renders
2. **Viewport margin** - Animations trigger slightly before entering viewport for smoother UX
3. **Transform-based animations** - Using transform (scale, translate) instead of width/height for GPU acceleration
4. **Opacity animations** - Composited on GPU for smooth performance

## Best Practices Followed

✅ Reduced motion accessibility - Framer Motion respects user's `prefers-reduced-motion` setting
✅ Semantic HTML maintained with animations
✅ No layout shift - animations use transform and opacity
✅ Stagger effects for visual hierarchy
✅ Consistent timing (0.5s duration across all animations)
✅ Subtle effects (small scale/translate values)

## How to Use

All animations are defined as variant objects at the top of the component:

```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};
```

Apply to elements using motion components:

```tsx
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, margin: "-100px" }}
  variants={fadeInUp}
>
  Content here
</motion.div>
```

## Customization

To modify animations, update the variant objects:
- Change `duration` for speed
- Adjust `y` and `x` values for distance
- Modify `scale` for size changes
- Update `staggerChildren` for timing between elements
