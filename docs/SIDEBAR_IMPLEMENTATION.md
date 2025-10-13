# Sidebar Implementation Guide

## Overview
The dashboard now uses the shadcn sidebar component for a modern, collapsible navigation experience with keyboard shortcuts and mobile support.

## What Changed

### New Files Created
- **`src/components/layout/app-sidebar.tsx`**: Main sidebar component with navigation menu

### Modified Files
- **`src/app/dashboard/layout.tsx`**: Updated to use SidebarProvider and layout structure
- **`src/app/dashboard/page.tsx`**: Enhanced dashboard with statistics cards

## Features

### Sidebar Features
- ✅ **Collapsible**: Can collapse to icon-only view (desktop)
- ✅ **Mobile Responsive**: Sheet overlay on mobile devices
- ✅ **Keyboard Shortcut**: Toggle with `Cmd/Ctrl + B`
- ✅ **Persistent State**: Remembers collapsed state via cookies
- ✅ **Active Link Highlighting**: Shows current page in navigation
- ✅ **Tooltips**: Shows labels when sidebar is collapsed

### Navigation Items
1. **Dashboard** - Main overview page
2. **Certificates** - Manage certificates
3. **Templates** - Certificate templates
4. **Recipients** - Recipient management
5. **Documentation** - Project docs

### User Profile Menu (Footer)
The user profile is displayed in the sidebar footer with a dropdown menu containing:
- **Dashboard** - Quick link to dashboard
- **Settings** - Opens user settings dialog (password change, profile management, etc.)
- **Log out** - Sign out from the application

### Layout Structure
```
SidebarProvider
├── AppSidebar (left side, collapsible)
│   ├── SidebarHeader (logo & branding)
│   ├── SidebarContent (navigation menu)
│   └── SidebarFooter (user profile)
└── SidebarInset (main content area)
    ├── Header (trigger button + mode toggle)
    └── Main (page content)
```

## Usage

### Adding New Navigation Items
Edit `src/components/layout/app-sidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items
  {
    title: "New Page",
    url: "/dashboard/new-page",
    icon: IconComponent, // from lucide-react
  },
];
```

### Customizing Sidebar Behavior
The sidebar accepts these props on `SidebarProvider`:
- `defaultOpen`: Initial state (default: `true`)
- `open`: Controlled state
- `onOpenChange`: Callback for state changes

### Using in Nested Layouts
The sidebar is defined in the dashboard layout, so all pages under `/dashboard/*` automatically include it.

## Keyboard Shortcuts
- **`Cmd/Ctrl + B`**: Toggle sidebar visibility

## Mobile Experience
- Sidebar appears as an overlay sheet
- Swipe to close or tap outside
- Trigger button always visible in header

## Styling
The sidebar uses CSS custom properties for theming:
- `--sidebar-width`: Desktop width (16rem)
- `--sidebar-width-icon`: Collapsed width (3rem)
- `--sidebar-width-mobile`: Mobile width (18rem)

## Best Practices
1. **Keep menu items focused**: Don't add too many top-level items
2. **Use semantic icons**: Choose icons that clearly represent the page
3. **Group related items**: Use SidebarGroup for logical sections
4. **Active state**: URLs are matched exactly for active highlighting

## Future Enhancements
- [ ] Add submenu support for nested navigation
- [ ] Add search functionality
- [ ] Add recent pages tracking
- [ ] Add sidebar themes/customization
- [ ] Add badge notifications for menu items

## Troubleshooting

### Sidebar not showing
- Ensure user is authenticated (sidebar only shows for logged-in users)
- Check that `getCurrentUser()` returns a valid user

### Active state not working
- Verify the URL in `menuItems` matches the page route exactly
- Use `usePathname()` for dynamic active state if needed

### Mobile overlay issues
- Check z-index conflicts with other components
- Ensure Sheet component is properly imported from `@/components/ui/sheet`

## Technical Details

### Dependencies
- `@radix-ui/react-slot`: For asChild pattern
- `lucide-react`: Icons
- Custom `useIsMobile` hook: Mobile detection

### State Management
- Cookie-based persistence (`sidebar_state`)
- React Context for sharing state
- 7-day cookie expiration

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Semantic HTML structure
