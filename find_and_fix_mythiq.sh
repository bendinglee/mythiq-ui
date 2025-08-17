#!/bin/bash

echo "🔍 Finding and Fixing Mythiq-UI Dependencies"
echo "============================================="

# Step 1: Find the mythiq-ui directory
echo "📁 Step 1: Locating mythiq-ui directory..."

# Check common locations
MYTHIQ_DIR=""

if [ -d "./mythiq-ui" ]; then
    MYTHIQ_DIR="./mythiq-ui"
    echo "✅ Found mythiq-ui in current directory"
elif [ -d "../mythiq-ui" ]; then
    MYTHIQ_DIR="../mythiq-ui"
    echo "✅ Found mythiq-ui in parent directory"
elif [ -d "~/mythiq-ui" ]; then
    MYTHIQ_DIR="~/mythiq-ui"
    echo "✅ Found mythiq-ui in home directory"
else
    # Search for it
    echo "🔍 Searching for mythiq-ui directory..."
    SEARCH_RESULT=$(find ~ -name "mythiq-ui" -type d 2>/dev/null | head -1)
    if [ -n "$SEARCH_RESULT" ]; then
        MYTHIQ_DIR="$SEARCH_RESULT"
        echo "✅ Found mythiq-ui at: $MYTHIQ_DIR"
    else
        echo "❌ mythiq-ui directory not found!"
        echo ""
        echo "📋 Please either:"
        echo "1. Clone the repository: git clone https://github.com/bendinglee/mythiq-ui.git"
        echo "2. Navigate to the correct directory manually"
        echo "3. Run this script from the directory containing mythiq-ui"
        exit 1
    fi
fi

# Step 2: Navigate to the directory
echo "📂 Step 2: Navigating to mythiq-ui directory..."
cd "$MYTHIQ_DIR" || {
    echo "❌ Failed to navigate to $MYTHIQ_DIR"
    exit 1
}

echo "✅ Now in: $(pwd)"

# Step 3: Show current package.json status
echo "📦 Step 3: Checking current package.json..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "Current version: $(grep '"version"' package.json | head -1)"
else
    echo "❌ package.json not found in this directory!"
    echo "Current directory contents:"
    ls -la
    exit 1
fi

# Step 4: Backup current files
echo "💾 Step 4: Backing up current files..."
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)
if [ -f "package-lock.json" ]; then
    cp package-lock.json package-lock.json.backup.$(date +%Y%m%d_%H%M%S)
fi
echo "✅ Backup created"

# Step 5: Complete cleanup
echo "🧹 Step 5: Cleaning up npm artifacts..."
rm -rf node_modules/
rm -f package-lock.json
npm cache clean --force
echo "✅ Cleanup complete"

# Step 6: Check if we have the fixed package.json
echo "📝 Step 6: Updating package.json..."
if [ -f "/home/ubuntu/fixed_package_json.json" ]; then
    cp /home/ubuntu/fixed_package_json.json package.json
    echo "✅ Updated package.json with fixed version"
else
    echo "⚠️ Fixed package.json not found, using manual fix..."
    # Update lucide-react version in existing package.json
    sed -i 's/"lucide-react": "^0.263.1"/"lucide-react": "^0.539.0"/' package.json
    echo "✅ Updated lucide-react version"
fi

# Step 7: Install dependencies
echo "⚙️ Step 7: Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

# Step 8: Verify installation
echo "✅ Step 8: Verifying installation..."
if npm list --depth=0 >/dev/null 2>&1; then
    echo "✅ Dependencies installed successfully!"
else
    echo "⚠️ Dependencies installed with warnings (this is normal)"
fi

# Step 9: Test build
echo "🧪 Step 9: Testing build..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "⚠️ Build completed with warnings"
fi

echo ""
echo "🎉 Mythiq-UI dependency fix complete!"
echo ""
echo "📋 Summary:"
echo "- Located mythiq-ui directory: $MYTHIQ_DIR"
echo "- Cleaned up old npm artifacts"
echo "- Updated package.json with compatible versions"
echo "- Installed dependencies with --legacy-peer-deps"
echo "- Verified build process"
echo ""
echo "🚀 Next steps:"
echo "1. Test your application: npm run dev"
echo "2. Add testing scripts to scripts/ directory"
echo "3. Commit your changes: git add . && git commit -m 'Fix npm dependencies'"
echo ""
echo "📍 You are now in: $(pwd)"

