# User Settings Dialog - Visual Guide

## 🎨 Component Preview

### Opening Flow
```
1. User Avatar → 2. Dropdown Menu → 3. Settings Dialog

   ┌─────┐         ┌──────────────┐
   │ JD  │ ──────→ │ John Doe     │
   └─────┘         │ john@ex.com  │
                   ├──────────────┤
                   │ 👤 Dashboard  │
                   │ ⚙️ Settings ← │
                   ├──────────────┤      ┌─────────────────────────┐
                   │ 🚪 Sign out   │ ───→ │ ⚙️ Settings          [X]│
                   └──────────────┘      │ Manage your account...  │
                                         ├─────────────────────────┤
                                         │ [👤][🛡️][🌐]             │
                                         │                         │
                                         │ (Settings Content)      │
                                         └─────────────────────────┘
```

---

## 📱 Dialog Layout

```
┌─────────────────────────────────────────────────────────┐
│  Settings                                            [X]│
│  Manage your account settings and preferences           │
├─────────────────────────────────────────────────────────┤
│  ┌───────────┬───────────┬────────────┐                │
│  │👤 Profile │🛡️ Security│🌐 Preferences│               │
│  └───────────┴───────────┴────────────┘                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Tab Content Area - Scrollable]                       │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Tab 1: 👤 Profile

```
┌─────────────────────────────────────────┐
│  ┌────────┐  Profile Picture            │
│  │        │                              │
│  │   JD   │  Upload a new avatar for    │
│  │        │  your account                │
│  └────────┘                              │
│             [Upload Image]  [Remove]     │
├─────────────────────────────────────────┤
│  Name                                    │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                        │   │
│  └─────────────────────────────────┘   │
│  This is the name displayed on your     │
│  profile                                │
│                                          │
│  Email                                   │
│  ┌─────────────────────────────────┐   │
│  │ john@example.com                │   │
│  └─────────────────────────────────┘   │
│  ✓ Email verified                       │
│                                          │
│  Role                                    │
│  ┌─────────────────────────────────┐   │
│  │ User                            │   │
│  └─────────────────────────────────┘   │
│                                          │
│                  [Cancel] [Save Changes]│
└─────────────────────────────────────────┘
```

### Profile Elements
- **Avatar**: 80px circle with initials fallback
- **Upload buttons**: Disabled (ready for implementation)
- **Fields**: All showing user data
- **Verification badge**: Green ✓ or amber ⚠
- **Action buttons**: Aligned right

---

## Tab 2: 🛡️ Security

```
┌─────────────────────────────────────────┐
│  🔑 Password                            │
│  Change your password to keep your      │
│  account secure                          │
│  [Change Password]                       │
├─────────────────────────────────────────┤
│  🛡️ Two-Factor Authentication           │
│  Add an extra layer of security to      │
│  your account                            │
│  [Enable 2FA]                            │
├─────────────────────────────────────────┤
│  Active Sessions                         │
│  Manage devices where you're currently  │
│  signed in                               │
│  ┌─────────────────────────────────┐   │
│  │ Current Device           [Revoke]│   │
│  │ Last active: Just now            │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  ⚠️ Danger Zone                         │
│  Permanently delete your account and    │
│  all associated data                     │
│  [Delete Account]                        │
└─────────────────────────────────────────┘
```

### Security Elements
- **Sections**: Each with icon and description
- **Buttons**: Outline variant for safety
- **Sessions**: Card layout with device info
- **Danger Zone**: Red border and text
- **All disabled**: Ready for implementation

---

## Tab 3: 🌐 Preferences

```
┌─────────────────────────────────────────┐
│  🌙 Theme                               │
│  Choose how Certificate looks to you    │
│  ┌──────┬──────┬───────┐               │
│  │☀️Light│🌙Dark│🌐System│              │
│  └──────┴──────┴───────┘               │
├─────────────────────────────────────────┤
│  🔔 Notifications                       │
│  Configure how you receive              │
│  notifications                           │
│  ┌─────────────────────────────────┐   │
│  │ Email Notifications    [Enable] │   │
│  │ Receive updates via email       │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Push Notifications     [Enable] │   │
│  │ Receive push notifications      │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  🌐 Language                            │
│  Select your preferred language         │
│  ┌─────────────────────────────────┐   │
│  │ English (US)                    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Preferences Elements
- **Theme buttons**: 3 columns, active highlighted
- **Notification cards**: Border with toggle button
- **Language**: Dropdown (currently disabled)
- **Theme switching**: ✅ FULLY WORKING!

---

## 🎯 Interactive States

### Theme Button States
```
┌─────────────────────────────────────┐
│ Not Selected:                       │
│ ┌────────────┐                      │
│ │ ☀️ Light    │  ← Outline variant   │
│ └────────────┘                      │
│                                      │
│ Selected:                            │
│ ┌────────────┐                      │
│ │ 🌙 Dark     │  ← Filled variant    │
│ └────────────┘                      │
└─────────────────────────────────────┘
```

### Verification Badge
```
✓ Email verified      ← Green (verified)
⚠ Email not verified  ← Amber (unverified)
```

### Disabled Elements
```
[Button]     ← Grayed out, no hover
[Input]      ← Grayed background, no cursor
```

---

## 📱 Responsive Behavior

### Desktop (≥640px)
```
┌────────────────────────────────────┐
│  Settings                       [X]│
│  Manage your account...            │
├────────────────────────────────────┤
│  [👤 Profile][🛡️ Security][🌐 Prefs] │
├────────────────────────────────────┤
│                                    │
│  Wide content area                 │
│  672px max width                   │
│                                    │
└────────────────────────────────────┘
```

### Mobile (<640px)
```
┌────────────────────┐
│ Settings        [X]│
│ Manage your...     │
├────────────────────┤
│ [👤][🛡️][🌐]       │
├────────────────────┤
│                    │
│ Full width         │
│ (minus margins)    │
│                    │
└────────────────────┘
```

---

## 🎨 Color Scheme

### Light Mode
```css
Background:  white
Text:        gray-900
Muted:       gray-500
Border:      gray-200
Primary:     your-primary-color
Destructive: red-600
```

### Dark Mode
```css
Background:  gray-950
Text:        gray-50
Muted:       gray-400
Border:      gray-800
Primary:     your-primary-color
Destructive: red-500
```

---

## 🔄 Animation Flow

### Opening
```
1. Backdrop fades in (200ms)
2. Dialog scales + fades in (200ms)
3. Content slides up slightly
```

### Tab Switch
```
1. Current tab content fades out (100ms)
2. New tab content fades in (100ms)
3. Tab indicator slides (200ms)
```

### Theme Change
```
1. Button state updates instantly
2. Theme applies immediately
3. All components transition smoothly
```

---

## 📊 Component Sizes

```
Dialog:
- Max width: 672px (2xl)
- Padding: 24px
- Border radius: 8px

Avatar:
- Profile tab: 80px × 80px
- Fallback text: text-xl

Tabs:
- Height: 36px
- Padding: 12px
- Border radius: 6px

Buttons:
- Small: 32px height
- Default: 40px height
- Padding: 12px 16px

Inputs:
- Height: 40px
- Padding: 8px 12px
- Border radius: 6px
```

---

## 🎯 Usage Patterns

### Pattern 1: Open from Dropdown
```tsx
// State
const [settingsOpen, setSettingsOpen] = useState(false);

// Trigger
<DropdownMenuItem onClick={() => setSettingsOpen(true)}>
  Settings
</DropdownMenuItem>

// Dialog
<UserSettingsDialog
  open={settingsOpen}
  onOpenChange={setSettingsOpen}
/>
```

### Pattern 2: Direct Button
```tsx
<UserSettingsDialog
  trigger={<Button>Settings</Button>}
/>
```

### Pattern 3: Programmatic Open
```tsx
const [open, setOpen] = useState(false);

// Open from anywhere
setOpen(true);

<UserSettingsDialog
  open={open}
  onOpenChange={setOpen}
/>
```

---

## ✨ Special Features

### Auto-close on Actions
- Click outside → Close
- Press Escape → Close
- Click X button → Close
- Complete action (future) → Close

### Keyboard Navigation
- Tab → Navigate fields
- Arrow keys → Switch tabs
- Enter → Submit forms (future)
- Escape → Close dialog

### Focus Management
- Auto-focus first tab on open
- Trap focus inside dialog
- Return focus to trigger on close

---

## 🚀 Live Features

### ✅ Working Now
1. Theme switching (instant)
2. Tab navigation
3. User data display
4. Responsive layout
5. Keyboard shortcuts

### 🚧 Coming Soon
1. Profile editing
2. Avatar upload
3. Password change
4. 2FA setup
5. Session management

---

## 💡 Design Tips

1. **Keep it simple**: Don't overcrowd tabs
2. **Group logically**: Related settings together
3. **Show status**: Verified badges, active states
4. **Disable wisely**: Show what's possible
5. **Guide users**: Helper text under inputs
6. **Protect actions**: Danger zone separated

---

## 📸 Screenshots Reference

```
Tab Indicators (Active vs Inactive):
━━━━━━━━━  ────────  ────────
👤 Profile   🛡️ Security  🌐 Prefs
(Active)     (Inactive)   (Inactive)

Button States:
[Enabled Button]   [Disabled Button]
Blue/Primary       Gray/Muted

Input States:
┌──────────────┐  ┌──────────────┐
│ Active       │  │ Disabled     │
└──────────────┘  └──────────────┘
White bg          Gray bg
```

This visual guide shows exactly how the settings dialog looks and behaves! 🎨✨
