# User Settings Dialog Component

A comprehensive, tabbed settings dialog for managing user profile, security, and preferences.

## Features

- **📱 Dialog-based UI**: Modal overlay, no dedicated page needed
- **🎨 Three tabs**: Profile, Security, and Preferences
- **🎯 Smart integration**: Opens from user profile dropdown
- **🌓 Theme switching**: Live theme toggle in Preferences tab
- **🔒 Security features**: Password, 2FA, sessions (UI ready)
- **✨ Beautiful UI**: Consistent with shadcn/ui design system

## Component Structure

### Main Component: `UserSettingsDialog`

A controlled/uncontrolled dialog component with tabbed interface.

```tsx
import { UserSettingsDialog } from "@/components/settings/user-settings-dialog";

// Controlled (recommended for dropdown integration)
<UserSettingsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
/>

// With trigger (uncontrolled)
<UserSettingsDialog
  trigger={<Button>Settings</Button>}
/>
```

### Standalone Button: `SettingsButton`

Pre-configured button that opens settings dialog.

```tsx
import { SettingsButton } from "@/components/settings/user-settings-dialog";

<SettingsButton />
```

## Tabs Overview

### 📋 Profile Tab
- **Avatar display** with initials fallback
- **Profile picture upload** (UI ready, disabled)
- **Name field** (read-only for now)
- **Email field** with verification status
- **Role field** (read-only)
- **Save/Cancel buttons** (disabled, ready for implementation)

### 🔐 Security Tab
- **Password change** (button ready)
- **Two-Factor Authentication** (button ready)
- **Active sessions** viewer (shows current device)
- **Danger zone**: Account deletion (protected)

### ⚙️ Preferences Tab
- **Theme selector**: Light, Dark, System (fully functional)
- **Email notifications** toggle (UI ready)
- **Push notifications** toggle (UI ready)
- **Language selector** (UI ready)

## Integration Examples

### 1. In User Profile Dropdown

```tsx
export function UserProfileAuthenticated({ user }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Profile</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
}
```

### 2. As Standalone Button

```tsx
import { SettingsButton } from "@/components/settings/user-settings-dialog";

<nav>
  <SettingsButton />
</nav>
```

### 3. With Custom Trigger

```tsx
<UserSettingsDialog
  trigger={
    <Button variant="ghost">
      <Settings className="h-4 w-4" />
    </Button>
  }
/>
```

## Props API

### UserSettingsDialogProps

```typescript
type UserSettingsDialogProps = {
  // Optional trigger element (makes it uncontrolled)
  trigger?: React.ReactNode;

  // Controlled open state
  open?: boolean;

  // Callback when open state changes
  onOpenChange?: (open: boolean) => void;
};
```

## Features by Tab

### Profile Tab Features

```tsx
✅ Avatar display (20x20, larger in dialog)
✅ Initials fallback
✅ Name field (disabled - ready for edit)
✅ Email field with verification status
✅ Role display (user/partner/admin)
🚧 Avatar upload (button ready)
🚧 Form validation
🚧 Save changes action
```

### Security Tab Features

```tsx
✅ Password change section
✅ 2FA section
✅ Active sessions viewer
✅ Account deletion (danger zone)
🚧 Change password dialog
🚧 Enable 2FA flow
🚧 Session revocation
🚧 Account deletion confirmation
```

### Preferences Tab Features

```tsx
✅ Theme switcher (Light/Dark/System) - FULLY WORKING
✅ Email notifications toggle
✅ Push notifications toggle
✅ Language selector
🚧 Save notification preferences
🚧 Language change functionality
```

## Current Implementation Status

### ✅ Fully Functional
- Dialog open/close
- Tab navigation
- Theme switching
- User data display
- Verification status badges
- Responsive layout

### 🚧 UI Ready (Disabled)
- Profile editing
- Avatar upload
- Password change
- 2FA setup
- Session management
- Notification toggles
- Language selection
- Account deletion

### 📝 To Implement
- Form submission handlers
- Server actions for updates
- Avatar upload logic
- Password change flow
- 2FA enrollment
- Session revocation
- Notification preferences
- Account deletion flow

## Styling & Theming

### Theme Integration
The Preferences tab includes a **live theme switcher**:

```tsx
<Button
  onClick={() => setTheme("dark")}
  variant={theme === "dark" ? "default" : "outline"}
>
  <Moon className="mr-2 h-4 w-4" />
  Dark
</Button>
```

### Responsive Design
- **Desktop (≥640px)**: Max width 672px (2xl)
- **Mobile (<640px)**: Full width minus 2rem margin
- Tabs stack on narrow viewports
- Dialog scrolls when content overflows

### Visual States

```css
/* Verification Status */
✓ Verified: text-green-600 dark:text-green-500
⚠ Unverified: text-amber-600 dark:text-amber-500

/* Danger Zone */
Border: border-destructive/50
Text: text-destructive
```

## File Structure

```
src/
├── components/
│   ├── settings/
│   │   └── user-settings-dialog.tsx    ← Main component
│   └── layout/
│       └── user-profile.tsx            ← Integration point
└── lib/
    └── auth-client.ts                  ← Session hook
```

## Usage in Project

Currently integrated in:
- ✅ User profile dropdown (replaces `/dashboard/settings` link)
- ✅ Available as `<SettingsButton />` standalone

## Accessibility

- ✅ Keyboard navigation (Tab, Arrow keys)
- ✅ Focus management (auto-focus on open)
- ✅ Screen reader labels
- ✅ ARIA attributes
- ✅ Escape key to close
- ✅ Click outside to close

## Dependencies

```json
{
  "@radix-ui/react-dialog": "Dialog primitive",
  "@radix-ui/react-tabs": "Tabs primitive",
  "next-themes": "Theme management",
  "lucide-react": "Icons",
  "better-auth/react": "Session management"
}
```

## Next Steps for Full Implementation

### 1. Profile Updates
```tsx
// Add server action
async function updateProfile(data: ProfileFormData) {
  "use server";
  // Validate and update user
}
```

### 2. Avatar Upload
```tsx
// Add file upload handler
async function uploadAvatar(file: File) {
  // Upload to storage
  // Update user image URL
}
```

### 3. Password Change
```tsx
// Create password change dialog
<ChangePasswordDialog />
```

### 4. 2FA Setup
```tsx
// Create 2FA enrollment flow
<Enable2FADialog />
```

### 5. Preferences Persistence
```tsx
// Save to user preferences table
async function updatePreferences(prefs: UserPreferences) {
  // Save to database
}
```

## Example: Enabling Profile Editing

To enable profile editing, update the Profile tab:

```tsx
// Add form state
const [name, setName] = useState(user.name);
const [isSaving, setIsSaving] = useState(false);

// Enable inputs
<Input
  value={name}
  onChange={(e) => setName(e.target.value)}
  id="name"
/>

// Enable save button
<Button
  onClick={async () => {
    setIsSaving(true);
    await updateProfile({ name });
    setIsSaving(false);
  }}
  disabled={isSaving}
>
  {isSaving ? "Saving..." : "Save Changes"}
</Button>
```

## Visual Preview

```
┌─────────────────────────────────────┐
│ Settings                         [X]│
│ Manage your account settings...     │
├─────────────────────────────────────┤
│ [👤 Profile] [🛡️ Security] [🌐 Prefs] │
├─────────────────────────────────────┤
│                                     │
│  ┌─────┐  Profile Picture          │
│  │ JD  │  Upload a new avatar       │
│  └─────┘  [Upload] [Remove]        │
│                                     │
│  Name                               │
│  [John Doe            ]             │
│                                     │
│  Email                              │
│  [john@example.com    ]             │
│  ✓ Email verified                   │
│                                     │
│  Role                               │
│  [user                ]             │
│                                     │
│           [Cancel] [Save Changes]   │
│                                     │
└─────────────────────────────────────┘
```

## Tips

1. **Always wrap in fragment** when using with dropdown to avoid layout issues
2. **Use controlled state** for better integration with other components
3. **Check session** before rendering (component returns null if no user)
4. **Test all tabs** to ensure smooth transitions
5. **Customize disabled features** as you implement backend logic

## Performance

- ✅ Lazy loads with dialog (only renders when open)
- ✅ Session data cached by Better Auth
- ✅ No unnecessary re-renders
- ✅ Optimistic UI for theme switching
