# Partner Dashboard Implementation

## Overview
This document describes the complete partner-side implementation for the e-certificate platform. Partners can now accept certification orders and create certifications for walk-in customers.

## Features Implemented

### 1. Database Schema Updates
**File**: `src/db/schema/tables/certification.ts`

Added partner assignment fields to the certification table:
- `partnerId`: References user.id (the partner handling this certification)
- `assignedAt`: Timestamp when certification was assigned to partner
- Added partner relation to certification relations

**Migration**: Generated and ready to apply with `npm run db:push`

### 2. Middleware Protection
**File**: `src/middleware.ts`

Added role-based access control for partner routes:
- Created `partnerRoutes` array for `/dashboard/partner` paths
- Partners and admins can access partner dashboard
- Regular users are redirected to main dashboard
- Unauthenticated users redirected to login
- Refactored middleware to reduce complexity

### 3. Partner Dashboard
**Route**: `/dashboard/partner`
**File**: `src/app/dashboard/partner/page.tsx`

Main partner dashboard showing:
- Statistics cards:
  - Available orders (unassigned)
  - Orders assigned to partner
  - Active certifications in progress
  - Completed certifications
- Quick action buttons
- Partner account information

### 4. Available Orders Page
**Route**: `/dashboard/partner/orders`
**File**: `src/app/dashboard/partner/orders/page.tsx`

Lists all pending certification orders that are unassigned:
- Grid view of available orders
- Shows object details, service type, price
- Customer information
- Links to order detail page
- Empty state when no orders available

### 5. Order Detail & Accept Flow
**Route**: `/dashboard/partner/orders/[id]`
**Files**:
- `src/app/dashboard/partner/orders/[id]/page.tsx`
- `src/app/actions/partner.ts`
- `src/components/partner/AcceptOrderButton.tsx`

Detailed view of certification order with:
- Customer information
- Complete object details
- Service type and pricing breakdown
- Status and assignment information
- Photo gallery if available
- Accept order button (server action)

When partner accepts an order:
- Certification is assigned to partner
- `partnerId` and `assignedAt` fields updated
- Status changed to "en_attente"
- Partner redirected to their certifications page

### 6. My Active Certifications
**Route**: `/dashboard/partner/my-certifications`
**File**: `src/app/dashboard/partner/my-certifications/page.tsx`

Shows certifications assigned to the partner:
- Filters: en_attente, verifie, certifie statuses
- Grid view with certification cards
- Status badges
- Customer information
- Assignment date
- Empty state with link to available orders

### 7. Walk-in Customer Registration
**Route**: `/dashboard/partner/walk-in`
**File**: `src/app/dashboard/partner/walk-in/page.tsx`

Placeholder page for registering walk-in customers:
- Currently shows "coming soon" message
- Will allow partners to create certifications for customers who visit their shop
- Future implementation will include certification creation form

### 8. Updated Sidebar Navigation
**File**: `src/components/layout/app-sidebar.tsx`

Added conditional "Partner Tools" section for partners and admins:
- Partner Dashboard
- Available Orders
- My Certifications
- Walk-in Customer

Icons added: Briefcase, Package, Building

## Database Changes

### Certification Table
```sql
ALTER TABLE certification
ADD COLUMN partner_id TEXT REFERENCES user(id) ON DELETE SET NULL,
ADD COLUMN assigned_at TIMESTAMP;
```

### Status Flow
1. **enregistre** - Initial status when user creates certification
2. **en_attente** - Partner accepts the order
3. **verifie** - Partner verifies the object
4. **certifie** - Certification process complete
5. **authentifie** - Final authenticated status

## Server Actions

### acceptCertificationOrder
**File**: `src/app/actions/partner.ts`

Server action to assign certification to partner:
- Validates partner role
- Checks certification exists and is unassigned
- Updates partnerId, assignedAt, and status
- Revalidates relevant paths
- Returns success/error response

## Access Control

### Protected Routes
All `/dashboard/partner/*` routes require:
- User must be authenticated
- User must have `partner` or `admin` role
- Otherwise redirected to `/dashboard`

### Role Hierarchy
- **admin**: Full access to everything
- **partner**: Access to partner dashboard and tools
- **user**: Access to regular dashboard only

## UI Components

### AcceptOrderButton
**File**: `src/components/partner/AcceptOrderButton.tsx`

Client component for accepting orders:
- Shows "Accept Order" button
- Loading state while processing
- Error display if acceptance fails
- Disabled state if already assigned
- Redirects to my-certifications on success

## Usage

### For Partners
1. Log in with partner role account
2. Navigate to Partner Dashboard (sidebar)
3. View available orders
4. Click on order to see details
5. Accept order to start working on it
6. View assigned certifications in "My Certifications"

### For Admins
- Full access to all partner features
- Can view and accept orders like partners
- Can access both user and partner dashboards

## Next Steps

### Walk-in Customer Form
Implement full certification creation form for walk-in customers:
- User account creation/lookup
- Object details entry
- Photo upload
- Service selection
- Automatic partner assignment
- Payment processing (optional)

### Certification Processing Workflow
- Update certification status
- Add inspection reports
- Upload additional documentation
- Mark as complete
- Notify customer

### Partner Analytics
- Performance metrics
- Revenue tracking
- Processing times
- Customer satisfaction

### Communication
- In-app messaging with customers
- Status update notifications
- Email notifications for new orders

## Testing Checklist

- [ ] Run database migration: `npm run db:push`
- [ ] Create test user with `partner` role
- [ ] Create test certification (unassigned)
- [ ] Log in as partner
- [ ] Verify partner menu items appear in sidebar
- [ ] Navigate to Partner Dashboard
- [ ] View Available Orders
- [ ] Click on an order to view details
- [ ] Accept an order
- [ ] Verify it appears in My Certifications
- [ ] Test with admin role
- [ ] Test access denied for regular users

## Files Created/Modified

### Created
- `src/app/dashboard/partner/page.tsx`
- `src/app/dashboard/partner/orders/page.tsx`
- `src/app/dashboard/partner/orders/[id]/page.tsx`
- `src/app/dashboard/partner/my-certifications/page.tsx`
- `src/app/dashboard/partner/walk-in/page.tsx`
- `src/app/actions/partner.ts`
- `src/components/partner/AcceptOrderButton.tsx`

### Modified
- `src/db/schema/tables/certification.ts`
- `src/middleware.ts`
- `src/components/layout/app-sidebar.tsx`

## Environment Variables
No new environment variables required.

## Dependencies
No new dependencies required. Uses existing stack:
- Next.js
- Drizzle ORM
- Better Auth
- Lucide React icons
- shadcn/ui components
