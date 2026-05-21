#!/bin/bash

# ============================================
# Script to push code to GitHub
# ============================================

echo "🚀 Pushing code to GitHub..."

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository"
    exit 1
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "➕ Adding remote origin..."
    git remote add origin https://github.com/enmohsen20111975/the-Gate.git
fi

# Push to GitHub
echo "📤 Pushing to origin main..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Repository: https://github.com/enmohsen20111975/the-Gate"
else
    echo "❌ Failed to push. You may need to authenticate."
    echo ""
    echo "📋 Manual steps:"
    echo "1. Go to GitHub Settings > Developer settings > Personal access tokens"
    echo "2. Create a new token with 'repo' scope"
    echo "3. Run: git push https://YOUR_TOKEN@github.com/enmohsen20111975/the-Gate.git main"
fi
