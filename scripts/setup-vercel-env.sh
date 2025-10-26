#!/bin/bash

# ============================================
# Vercel Environment Variables Setup Script
# ============================================
# This script helps you set environment variables in Vercel
# Usage: ./scripts/setup-vercel-env.sh
# ============================================

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "📦 Install it with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if .env.vercel exists
if [ ! -f ".env.vercel" ]; then
    echo "❌ .env.vercel file not found!"
    echo "Please create it first with your production values"
    exit 1
fi

echo "📋 Found .env.vercel file"
echo ""

# Ask for environment scope
echo "Select environment scope:"
echo "1) Production only"
echo "2) Preview only"
echo "3) Development only"
echo "4) All environments"
read -p "Enter choice (1-4): " scope_choice

case $scope_choice in
    1) ENV_SCOPE="production";;
    2) ENV_SCOPE="preview";;
    3) ENV_SCOPE="development";;
    4) ENV_SCOPE="production,preview,development";;
    *) echo "Invalid choice"; exit 1;;
esac

echo ""
echo "🔧 Setting variables for: $ENV_SCOPE"
echo ""

# Function to set environment variable
set_env_var() {
    local key=$1
    local value=$2
    
    if [ -z "$value" ] || [[ $value == *"your-"* ]] || [[ $value == *"xxxxx"* ]]; then
        echo "⏭️  Skipping $key (placeholder value)"
        return
    fi
    
    echo "📝 Setting $key..."
    echo "$value" | vercel env add "$key" $ENV_SCOPE --force 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ $key set successfully"
    else
        echo "⚠️  Failed to set $key (may already exist or invalid value)"
    fi
}

# Read .env.vercel and set variables
echo "🔄 Processing .env.vercel..."
echo ""

while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ $line =~ ^#.*$ ]] || [ -z "$line" ]; then
        continue
    fi
    
    # Skip section headers
    if [[ $line =~ ^[[:space:]]*$ ]]; then
        continue
    fi
    
    # Parse key=value
    if [[ $line =~ ^([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
        
        set_env_var "$key" "$value"
    fi
done < .env.vercel

echo ""
echo "✨ Environment variables setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Verify variables in Vercel dashboard"
echo "2. Update placeholder values with real credentials"
echo "3. Redeploy your application: vercel --prod"
echo ""
echo "🔍 To view all variables:"
echo "   vercel env ls"
echo ""
