#!/bin/bash

# BharatGPT Deployment Script for Puch.ai Hackathon
# This script automates the deployment process to Cloudflare Workers

set -e

echo "🚀 Starting BharatGPT deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in to Cloudflare
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "Please login to Cloudflare:"
    wrangler auth login
fi

# Check if PUCH_API_KEY secret is set
echo "🔑 Checking API key configuration..."
if ! wrangler secret list | grep -q "PUCH_API_KEY"; then
    echo "⚠️  PUCH_API_KEY secret not found."
    echo "Please set your Puch.ai API key:"
    wrangler secret put PUCH_API_KEY
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Cloudflare Workers
echo "🌍 Deploying to Cloudflare Workers..."
npm run deploy

echo ""
echo "✅ BharatGPT deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test your deployment at the URL shown above"
echo "2. Submit to Puch.ai Hackathon leaderboard:"
echo "   /hackathon submission add bharatgpt-server https://github.com/<yourusername>/bharatgpt"
echo ""
echo "🧪 Test your API:"
echo 'curl -X POST <your-worker-url>/ask \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"prompt":"Tell me about government schemes for farmers","location":"Punjab","language":"English"}'"'"''
echo ""
echo "Happy hacking! 🇮🇳"