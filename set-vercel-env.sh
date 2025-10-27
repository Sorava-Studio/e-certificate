#!/bin/bash
# Set NEXT_PUBLIC_APP_URL in Vercel

echo "Setting NEXT_PUBLIC_APP_URL in Vercel..."
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://e-certificate-peach.vercel.app"
vercel env add NEXT_PUBLIC_APP_URL preview <<< "https://e-certificate-peach.vercel.app"

echo "Done! Redeploy your project for changes to take effect."
