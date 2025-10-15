#!/bin/bash

echo "======================================"
echo "  Raintree.wiki Plan Tracker Setup  "
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

cd ..

echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Set up Supabase (see SETUP_GUIDE.md)"
echo "2. Update client/.env with your Supabase credentials"
echo "3. Run: npm run dev"
echo ""
echo "For quick start, see QUICKSTART.md"
echo ""

chmod +x "$0"
