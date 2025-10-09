# Luxury Brand Color Scheme - Emerald Green

## Overview
This document defines the luxury brand color palette for the e-Certificate application. The color scheme features a sophisticated emerald green as the primary color, complemented by warm neutrals and elegant accent colors to convey luxury and prestige.

## Color Philosophy
- **Primary**: Deep emerald green - represents growth, prestige, and luxury
- **Secondary**: Soft gold tones - adds warmth and luxury
- **Neutrals**: Warm cream and charcoal - sophisticated and timeless
- **Accents**: Sage, teal, and terracotta - natural elegance

---

## Light Mode Colors

### Primary Colors
| Color | OKLCH Value | Usage | Preview |
|-------|-------------|-------|---------|
| **Primary** | `oklch(0.42 0.14 155)` | Main brand color, CTAs, links | Deep Emerald |
| **Primary Foreground** | `oklch(0.99 0.005 85)` | Text on primary backgrounds | Cream White |

### Background Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Background** | `oklch(0.99 0.005 85)` | Main page background |
| **Card** | `oklch(1 0 0)` | Card backgrounds |
| **Popover** | `oklch(1 0 0)` | Dropdown/popover backgrounds |

### Secondary & Accent Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Secondary** | `oklch(0.95 0.02 90)` | Secondary actions, backgrounds |
| **Secondary Foreground** | `oklch(0.25 0.08 155)` | Text on secondary |
| **Accent** | `oklch(0.88 0.04 150)` | Highlights, hover states |
| **Accent Foreground** | `oklch(0.25 0.08 155)` | Text on accents |

### Muted & Borders
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Muted** | `oklch(0.96 0.01 140)` | Subtle backgrounds |
| **Muted Foreground** | `oklch(0.5 0.03 155)` | Secondary text |
| **Border** | `oklch(0.9 0.01 140)` | Borders, dividers |
| **Input** | `oklch(0.9 0.01 140)` | Input borders |
| **Ring** | `oklch(0.42 0.14 155)` | Focus rings |

### Status Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Destructive** | `oklch(0.55 0.18 25)` | Errors, dangerous actions |

### Chart Colors
| Color | OKLCH Value | Description |
|-------|-------------|-------------|
| **Chart 1** | `oklch(0.42 0.14 155)` | Emerald |
| **Chart 2** | `oklch(0.65 0.15 85)` | Gold |
| **Chart 3** | `oklch(0.35 0.12 180)` | Deep Teal |
| **Chart 4** | `oklch(0.55 0.08 140)` | Sage |
| **Chart 5** | `oklch(0.45 0.10 30)` | Terracotta |

---

## Dark Mode Colors

### Primary Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Primary** | `oklch(0.65 0.16 155)` | Brighter emerald for dark backgrounds |
| **Primary Foreground** | `oklch(0.16 0.01 155)` | Dark text on primary |

### Background Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Background** | `oklch(0.16 0.01 155)` | Deep charcoal with green undertone |
| **Card** | `oklch(0.20 0.015 155)` | Slightly elevated surfaces |
| **Popover** | `oklch(0.20 0.015 155)` | Dropdown backgrounds |

### Secondary & Accent Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Secondary** | `oklch(0.25 0.02 90)` | Muted gold |
| **Secondary Foreground** | `oklch(0.92 0.02 140)` | Light text |
| **Accent** | `oklch(0.28 0.03 150)` | Vibrant sage |
| **Accent Foreground** | `oklch(0.92 0.02 140)` | Light text |

### Muted & Borders
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Muted** | `oklch(0.25 0.015 155)` | Subtle surfaces |
| **Muted Foreground** | `oklch(0.65 0.03 140)` | Secondary text |
| **Border** | `oklch(0.9 0.01 140 / 12%)` | Subtle borders |
| **Input** | `oklch(0.9 0.01 140 / 18%)` | Input borders |
| **Ring** | `oklch(0.65 0.16 155)` | Focus rings |

### Status Colors
| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Destructive** | `oklch(0.62 0.20 25)` | Softer red for dark mode |

### Chart Colors (Dark Mode)
| Color | OKLCH Value | Description |
|-------|-------------|-------------|
| **Chart 1** | `oklch(0.65 0.16 155)` | Bright Emerald |
| **Chart 2** | `oklch(0.72 0.15 85)` | Bright Gold |
| **Chart 3** | `oklch(0.55 0.14 180)` | Bright Teal |
| **Chart 4** | `oklch(0.68 0.10 140)` | Light Sage |
| **Chart 5** | `oklch(0.62 0.12 30)` | Coral |

---

## Usage Guidelines

### Primary Color Usage
- **Do**: Use for primary CTAs, important actions, brand elements
- **Don't**: Overuse - reserve for key interactive elements
- **Example**: Submit buttons, active navigation items, primary links

### Secondary Color Usage
- **Do**: Use for secondary actions, subtle emphasis
- **Don't**: Mix with primary in the same hierarchy level
- **Example**: Cancel buttons, less important actions, badges

### Muted Colors
- **Do**: Use for supporting text, disabled states, subtle backgrounds
- **Don't**: Use for important calls to action
- **Example**: Helper text, placeholder text, disabled buttons

### Chart Colors
- Use the defined chart colors in order (1-5) for data visualization
- Maintain consistency across all charts in the application
- Colors are optimized for both accessibility and aesthetic appeal

---

## Accessibility

All color combinations meet WCAG 2.1 AA standards for contrast:
- Primary text on background: ✓ AAA
- Primary foreground on primary: ✓ AAA
- Muted foreground on background: ✓ AA
- All interactive elements have visible focus states

---

## Implementation

Colors are defined in `src/app/globals.css` using the OKLCH color space for:
- Better perceptual uniformity
- Smoother gradients
- More predictable color mixing
- Future-proof for wide gamut displays

To use in components:
```tsx
// Using Tailwind classes
<Button className="bg-primary text-primary-foreground">
  Click Me
</Button>

// Using CSS variables
<div style={{ backgroundColor: 'var(--primary)' }}>
  Custom Element
</div>
```

---

## Color Tokens Reference

Quick reference for developers:

### Backgrounds
- `bg-background` - Main page background
- `bg-card` - Card backgrounds
- `bg-popover` - Popover/dropdown backgrounds
- `bg-muted` - Subtle backgrounds

### Text
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `text-primary` - Brand color text
- `text-secondary-foreground` - On secondary backgrounds

### Borders & Outlines
- `border-border` - Standard borders
- `border-input` - Input borders
- `ring-ring` - Focus rings

### Interactive Elements
- `bg-primary` + `text-primary-foreground` - Primary buttons
- `bg-secondary` + `text-secondary-foreground` - Secondary buttons
- `bg-accent` + `text-accent-foreground` - Accent elements
- `bg-destructive` + `text-destructive-foreground` - Destructive actions

---

## Brand Values Reflected

| Value | How It's Reflected |
|-------|-------------------|
| **Luxury** | Deep emerald green, gold accents, refined color palette |
| **Trust** | Consistent green tones, professional neutrals |
| **Growth** | Green primary color, natural tones |
| **Prestige** | Sophisticated color combinations, high contrast |
| **Elegance** | Subtle color variations, warm undertones |

---

## Maintenance

When updating colors:
1. Maintain WCAG contrast ratios
2. Test in both light and dark modes
3. Verify chart colors are distinguishable
4. Update this documentation
5. Test with color blindness simulators
