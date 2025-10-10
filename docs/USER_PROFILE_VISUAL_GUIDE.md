# User Profile Component - Visual Guide

## Component Variations

### 1. 🔓 Unauthenticated State
When user is NOT signed in:

```
┌─────────────────────────────────┐
│  [Sign In]  [Get Started]       │
└─────────────────────────────────┘
```

- Two buttons in a button group
- "Sign In" (outline) links to `/login`
- "Get Started" (primary) links to `/register`

---

### 2. 🔐 Authenticated State
When user IS signed in:

```
┌─────────────────────────┐
│        (JD)             │  ← Avatar (initials or image)
│          │              │
│          ▼              │
│   ┌──────────────┐      │
│   │ John Doe     │      │
│   │ john@ex.com  │      │
│   ├──────────────┤      │
│   │ 👤 Dashboard │      │
│   │ ⚙️  Settings  │      │
│   ├──────────────┤      │
│   │ 🚪 Sign out   │      │
│   └──────────────┘      │
└─────────────────────────┘
```

- Circular avatar button
- Shows user initials if no image
- Dropdown menu on click with:
  - User name & email header
  - Dashboard link
  - Settings link
  - Sign out button (destructive style)

---

### 3. ⏳ Loading State
While checking authentication:

```
┌─────────────────────────────────┐
│  ( ○ )  ← Pulsing skeleton      │
└─────────────────────────────────┘
```

- Gray circular skeleton
- Pulse animation
- Prevents layout shift

---

## Implementation in Navigation

### Home Page (Public)
```tsx
<nav className="sticky top-0 border-b bg-background">
  <div className="container flex h-16 items-center justify-between">
    <Logo />
    <div className="flex items-center gap-4">
      <Link href="#features">Features</Link>
      <Link href="#pricing">Pricing</Link>
      <UserProfile />  {/* 👈 Smart component */}
      <ModeToggle />
    </div>
  </div>
</nav>
```

**Result:**
- NOT signed in: Shows "Sign In" + "Get Started"
- Signed in: Shows avatar dropdown

---

### Dashboard Layout (Protected)
```tsx
<nav className="sticky top-0 border-b bg-background">
  <div className="container flex h-16 items-center justify-between">
    <Logo />
    <div className="flex items-center gap-4">
      {user && <UserProfileAuthenticated user={user} />}
      <ModeToggle />
    </div>
  </div>
</nav>
```

**Result:**
- Always shows avatar (route is protected)
- Server-side user data
- No loading state needed

---

## Avatar Fallback Logic

```typescript
// "John Doe" → "JD"
// "Alice" → "A"
// "Bob Smith Jr" → "BS"

const getInitials = (name: string) =>
  name
    .split(" ")        // Split by space
    .map((n) => n[0])  // Get first letter of each word
    .join("")          // Join together
    .toUpperCase()     // Make uppercase
    .slice(0, 2);      // Max 2 characters
```

---

## Dropdown Menu Structure

```
┌─────────────────────────┐
│ LABEL (non-clickable)   │
│ ┌─────────────────────┐ │
│ │ John Doe            │ │  ← User name
│ │ john@example.com    │ │  ← Email (muted)
│ └─────────────────────┘ │
├─────────────────────────┤
│ 👤 Dashboard            │  ← Link to /dashboard
│ ⚙️  Settings             │  ← Link to /dashboard/settings
├─────────────────────────┤
│ 🚪 Sign out             │  ← Logout action (red text)
└─────────────────────────┘
```

---

## Responsive Behavior

### Desktop (≥768px)
- Avatar: 36px (h-9 w-9)
- Buttons: Full text
- Dropdown: Right-aligned
- Smooth animations

### Mobile (<768px)
- Same avatar size
- Buttons stack if needed
- Dropdown adapts
- Touch-friendly

---

## States & Interactions

### Hover States
- **Avatar**: Subtle background color change
- **Buttons**: Border/background highlight
- **Dropdown items**: Background highlight

### Active States
- **Dropdown open**: Avatar has focus ring
- **During logout**: "Sign out" shows "Signing out..." (disabled)

### Focus States
- Keyboard accessible
- Visible focus rings
- Tab navigation works

---

## Dark Mode Support

```css
/* Light Mode */
Avatar Fallback: bg-gray-100, text-gray-900

/* Dark Mode */
Avatar Fallback: bg-gray-800, text-gray-100
```

All components automatically adapt to theme!

---

## File Locations

```
src/
├── components/
│   └── layout/
│       └── user-profile.tsx          ← Main component
└── app/
    ├── page.tsx                      ← Uses UserProfile
    └── dashboard/
        ├── layout.tsx                ← Uses UserProfileAuthenticated
        └── page.tsx                  ← Protected content
```

---

## Quick Copy-Paste Examples

### Example 1: Any Client Component
```tsx
import { UserProfile } from "@/components/layout/user-profile";

export default function MyPage() {
  return (
    <header>
      <UserProfile />
    </header>
  );
}
```

### Example 2: Server Component with Data
```tsx
import { UserProfileAuthenticated } from "@/components/layout/user-profile";
import { getCurrentUser } from "@/lib/session";

export default async function MyLayout() {
  const user = await getCurrentUser();

  return (
    <header>
      {user && <UserProfileAuthenticated user={user} />}
    </header>
  );
}
```

### Example 3: Force Guest View
```tsx
import { UserProfileUnauthenticated } from "@/components/layout/user-profile";

export default function LandingPage() {
  return (
    <header>
      <UserProfileUnauthenticated />
    </header>
  );
}
```
