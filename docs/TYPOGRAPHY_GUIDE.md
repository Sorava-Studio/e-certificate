# Typography System Guide

This project uses a comprehensive typography system built with Tailwind CSS and custom components. The system ensures consistent, accessible, and responsive text styling across the application.

## Fonts

The project uses **Geist Sans** and **Geist Mono** fonts:
- **Geist Sans**: Primary font for all text content
- **Geist Mono**: Monospace font for code blocks and technical content

## Typography Component

The `Typography` component provides a flexible, type-safe way to render semantic HTML elements with consistent styling.

### Basic Usage

```tsx
import { Typography } from "@/components/ui/typography";

export function Example() {
  return (
    <>
      <Typography variant="h1">Main Heading</Typography>
      <Typography variant="p">Paragraph text</Typography>
      <Typography variant="muted">Muted text</Typography>
    </>
  );
}
```

### Variants

#### Headings
- `h1` - Extra large heading (4xl → 5xl → 6xl on responsive breakpoints)
- `h2` - Large heading (3xl → 4xl → 5xl)
- `h3` - Medium heading (2xl → 3xl → 4xl)
- `h4` - Small heading (xl → 2xl → 3xl)
- `h5` - Extra small heading (lg → xl → 2xl)
- `h6` - Minimal heading (base → lg → xl)

#### Text Styles
- `p` - Default paragraph with proper spacing
- `lead` - Lead paragraph (larger, muted)
- `large` - Large text
- `small` - Small text
- `muted` - Muted foreground text

#### Special Elements
- `blockquote` - Styled blockquote with left border
- `code` - Inline code block
- `list` - Styled list (ul/ol)

### Custom Element Types

You can override the default HTML element using the `as` prop:

```tsx
<Typography variant="h1" as="div">
  Styled as h1 but rendered as div
</Typography>

<Typography variant="p" as="span">
  Styled as paragraph but rendered as span
</Typography>
```

### Affects Prop

The `affects` prop allows you to modify spacing behavior:

```tsx
<Typography variant="p" affects="removePMargin">
  Paragraph without top margin
</Typography>
```

### Examples

#### Article Layout

```tsx
export function Article() {
  return (
    <article>
      <Typography variant="h1">Article Title</Typography>
      <Typography variant="lead">
        This is a lead paragraph that introduces the article content.
      </Typography>

      <Typography variant="h2">Section Heading</Typography>
      <Typography variant="p">
        Regular paragraph text with proper spacing and line height.
      </Typography>

      <Typography variant="blockquote">
        An important quote or callout.
      </Typography>

      <Typography variant="p">
        You can also include <Typography variant="code" as="span">inline code</Typography> in your text.
      </Typography>
    </article>
  );
}
```

#### Form Labels

```tsx
export function FormExample() {
  return (
    <div>
      <Typography variant="small" as="label" htmlFor="email">
        Email Address
      </Typography>
      <Input id="email" type="email" />

      <Typography variant="muted" as="span">
        We'll never share your email.
      </Typography>
    </div>
  );
}
```

## Direct HTML Elements

When using semantic HTML elements directly, base styles are automatically applied:

```tsx
// These have automatic styling from globals.css
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<p>Paragraph</p>
<blockquote>Quote</blockquote>
<code>inline code</code>
<ul>
  <li>List item</li>
</ul>
```

## Utility Classes

You can also use Tailwind typography utilities directly:

```tsx
<div className="text-lg font-semibold">Custom styled text</div>
<p className="text-muted-foreground">Muted paragraph</p>
```

## Typography Scale

The typography system uses a responsive scale:

| Variant | Mobile | Tablet (md) | Desktop (lg) |
|---------|--------|-------------|--------------|
| h1      | 4xl    | 5xl         | 6xl          |
| h2      | 3xl    | 4xl         | 5xl          |
| h3      | 2xl    | 3xl         | 4xl          |
| h4      | xl     | 2xl         | 3xl          |
| h5      | lg     | xl          | 2xl          |
| h6      | base   | lg          | xl           |

## Accessibility

All typography follows accessibility best practices:
- Semantic HTML elements are used by default
- Proper heading hierarchy is maintained
- Sufficient color contrast ratios
- Responsive font sizes for readability
- Proper line heights for text legibility

## Best Practices

1. **Use semantic headings**: Always use proper heading hierarchy (h1 → h2 → h3, etc.)
2. **Prefer the Typography component**: For consistency and type safety
3. **Use variants over custom classes**: Stick to predefined variants when possible
4. **Test responsiveness**: Verify text renders well on all screen sizes
5. **Maintain contrast**: Ensure text is readable in both light and dark modes

## Customization

To customize the typography system, edit:
- Font configuration: `src/app/layout.tsx`
- Base styles: `src/app/globals.css`
- Component variants: `src/components/ui/typography.tsx`
- Tailwind theme: `@theme` block in `globals.css`
