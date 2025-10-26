#!/bin/bash

# ============================================
# 🚀 Vercel DB Migration Script
# ============================================
# Push Drizzle schema to Vercel Postgres
# ============================================

echo "🚀 Drizzle → Vercel Postgres Migration"
echo "======================================"
echo ""

# Check if .env.production.local exists
if [ ! -f ".env.production.local" ]; then
    echo "❌ .env.production.local not found!"
    echo ""
    echo "📝 Create it with:"
    echo "   DATABASE_URL=postgresql://..."
    echo "   DIRECT_DATABASE_URL=postgresql://..."
    echo ""
    echo "Get these from: Vercel Dashboard → Storage → Postgres"
    exit 1
fi

echo "✅ Found .env.production.local"
echo ""

# Load production environment
export $(cat .env.production.local | grep -v '^#' | xargs)

echo "🔄 Pushing schema to Vercel Postgres..."
echo ""

# Run Drizzle push
bun run db:push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration successful!"
    echo ""
    echo "🔍 Verify with: bun run db:studio"
    echo "🗑️  Clean up: rm .env.production.local"
else
    echo ""
    echo "❌ Migration failed!"
    echo "Check your connection string and try again"
    exit 1
fi
