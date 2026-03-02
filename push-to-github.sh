#!/bin/bash

# Smart Admin Dashboard - Push to GitHub Script
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME

if [ "$#" -ne 2 ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME"
    echo "Example: ./push-to-github.sh johndoe smart-admin-dashboard"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "🚀 Setting up GitHub repository..."
echo "Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo ""

# Add remote
echo "📡 Adding remote origin..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Rename branch to main
echo "🔄 Renaming branch to main..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your project is now on GitHub!"
echo "🔗 Visit: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
