# 🗄️ Drizzle ORM Setup with Postgres.js

Complete setup for Drizzle ORM with PostgreSQL using Postgres.js driver.

## 📦 Installed Packages

- `drizzle-orm` - ORM core
- `postgres` - Postgres.js driver (fast & lightweight)
- `drizzle-kit` - CLI for migrations & studio

## 🚀 Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Create Schema Files

Create your schema files in `src/db/schema/`. Example:

```typescript
// src/db/schema/users.ts
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 3. Generate & Run Migrations

```bash
# Generate migration files from schema
bun run db:generate

# Apply migrations to database
bun run db:migrate

# OR push schema directly (development only)
bun run db:push
```

### 4. Use in Your App

```typescript
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

// Query
const allUsers = await db.select().from(users);

// Insert
await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com'
});

// Update
await db.update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, 1));
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run db:generate` | Generate migration files from schema changes |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:push` | Push schema directly to DB (skip migrations) |
| `bun run db:studio` | Open Drizzle Studio (visual DB manager) |
| `bun run db:check` | Check for schema issues |
| `bun run db:drop` | Drop migration files |

## 🏗️ Project Structure

```
src/db/
├── index.ts              # Database connection & client
├── migrate.ts            # Migration runner
├── migrations/           # Generated migration files
└── schema/
    ├── index.ts          # Schema exports
    └── users.example.ts  # Example schema
```

## 🔧 Configuration Files

### `drizzle.config.ts`
Main configuration for Drizzle Kit (migrations, introspection, studio).

### `src/db/index.ts`
Database connection using Postgres.js with connection pooling.

## 🌟 Features

✅ **Connection Pooling** - Optimized with max 10 connections
✅ **Type Safety** - Full TypeScript support with type inference
✅ **Migration System** - Version control for your database
✅ **Drizzle Studio** - Visual database management UI
✅ **Development Logging** - SQL query logging in development

## 📚 Documentation

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Postgres.js Docs](https://github.com/porsager/postgres)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)

## 🔗 Useful Links

- **Drizzle Studio**: Run `bun run db:studio` and open http://localhost:4983
- **PostgreSQL**: http://localhost:5432
- **Docker Container**: `ecertificate-postgres`

## ⚡ Development Workflow

1. **Modify schema** in `src/db/schema/`
2. **Generate migration**: `bun run db:generate`
3. **Review migration** in `src/db/migrations/`
4. **Apply migration**: `bun run db:migrate`
5. **Test changes** with Drizzle Studio

## 🎯 Next Steps

1. Remove `src/db/schema/users.example.ts` (it's just an example)
2. Create your actual schema files in `src/db/schema/`
3. Run `bun run db:generate` to create migrations
4. Run `bun run db:migrate` to apply them
5. Start building your app! 🚀
