# User Profile Component

A flexible, reusable user profile component with authentication state detection and two display variations.

## Features

- **Smart Authentication Detection**: Automatically detects if user is signed in
- **Two Variations**:
  - **Authenticated**: Avatar with dropdown menu (profile, dashboard, settings, logout)
  - **Unauthenticated**: Button group with "Sign In" and "Get Started" buttons
- **Loading State**: Shows skeleton while checking authentication
- **Fully Accessible**: Built with Radix UI primitives
- **Type-Safe**: Full TypeScript support

## Components

### `UserProfile` (Smart Component)

The main component that automatically detects authentication state and renders the appropriate variation.

```tsx
import { UserProfile } from "@/components/layout/user-profile";

export default function Navigation() {
  return (
    <nav>
      <UserProfile />
    </nav>
  );
}
```

### `UserProfileAuthenticated`

Displays an avatar with a dropdown menu for authenticated users.

```tsx
import { UserProfileAuthenticated } from "@/components/layout/user-profile";

export default function DashboardNav() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/avatar.jpg",
    role: "user"
  };

  return <UserProfileAuthenticated user={user} />;
}
```

**Props:**
- `user.name` (string, required): User's display name
- `user.email` (string, required): User's email address
- `user.image` (string | null, optional): Avatar image URL
- `user.role` (string | null, optional): User's role

**Dropdown Menu Items:**
- Dashboard (links to `/dashboard`)
- Settings (links to `/dashboard/settings`)
- Sign out (triggers logout and redirects to `/login`)

### `UserProfileUnauthenticated`

Displays sign-in and registration buttons for unauthenticated users.

```tsx
import { UserProfileUnauthenticated } from "@/components/layout/user-profile";

export default function PublicNav() {
  return <UserProfileUnauthenticated />;
}
```

**Buttons:**
- "Sign In" (links to `/login`)
- "Get Started" (links to `/register`)

## Usage Examples

### In a Public Page (Home Page)

```tsx
"use client";

import { UserProfile } from "@/components/layout/user-profile";

export default function HomePage() {
  return (
    <nav>
      <div className="flex items-center gap-4">
        <Link href="/">Logo</Link>
        <UserProfile /> {/* Shows avatar or sign-in buttons */}
      </div>
    </nav>
  );
}
```

### In a Dashboard Layout (Server Component)

```tsx
import { UserProfileAuthenticated } from "@/components/layout/user-profile";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div>
      <nav>
        {user && <UserProfileAuthenticated user={user} />}
      </nav>
      <main>{children}</main>
    </div>
  );
}
```

### With Custom Styling

```tsx
<div className="flex items-center gap-4">
  <UserProfile />
  <ModeToggle />
</div>
```

## Avatar Fallback

When no image is provided, the component displays user initials:
- Single name: First letter (e.g., "John" → "J")
- Multiple names: First letter of first two words (e.g., "John Doe" → "JD")
- Maximum 2 characters, uppercase

## Dependencies

- `@radix-ui/react-avatar`: Avatar component
- `@radix-ui/react-dropdown-menu`: Dropdown menu
- `lucide-react`: Icons (User, Settings, LogOut)
- `better-auth/react`: Authentication client
- `next/link`: Navigation
- `next/navigation`: Router

## Styling

The component uses:
- Tailwind CSS utility classes
- shadcn/ui design system
- Consistent with project theme (light/dark mode support)

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Error Handling

- Graceful fallback if logout fails
- Loading states during authentication check
- Safe navigation even if session data is incomplete

## Type Safety

```typescript
type UserProfileAuthenticatedProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
};
```

## Best Practices

1. **Use `UserProfile` for client components** where you want automatic auth detection
2. **Use `UserProfileAuthenticated` in server components** with `getCurrentUser()`
3. **Always handle the loading state** when using `UserProfile`
4. **Customize dropdown items** by modifying the component directly

## Future Enhancements

Potential additions:
- Notification badge on avatar
- Quick settings toggle in dropdown
- User status indicator (online/offline)
- Profile picture upload from dropdown
- Keyboard shortcuts for dropdown items
