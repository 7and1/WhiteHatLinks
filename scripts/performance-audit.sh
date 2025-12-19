#!/bin/bash

# Performance Audit Script for WhiteHatLinks
# This script performs a comprehensive performance audit using Lighthouse

set -e

echo "🔍 WhiteHatLinks Performance Audit"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}⚠️  Lighthouse CLI not found. Installing...${NC}"
    npm install -g lighthouse
fi

# Check if production build exists
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}⚠️  No production build found. Building...${NC}"
    npm run build
fi

# Create reports directory
mkdir -p lighthouse-reports

echo ""
echo -e "${GREEN}📊 Starting Performance Audit${NC}"
echo ""

# Pages to audit
PAGES=(
    "http://localhost:3000/"
    "http://localhost:3000/inventory"
    "http://localhost:3000/pricing"
    "http://localhost:3000/contact"
)

PAGE_NAMES=(
    "homepage"
    "inventory"
    "pricing"
    "contact"
)

# Start Next.js server in background
echo -e "${YELLOW}🚀 Starting production server...${NC}"
npm run start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to be ready..."
sleep 5

# Run Lighthouse for each page
for i in "${!PAGES[@]}"; do
    PAGE="${PAGES[$i]}"
    NAME="${PAGE_NAMES[$i]}"

    echo ""
    echo -e "${GREEN}🔍 Auditing: $NAME${NC}"
    echo "URL: $PAGE"

    lighthouse "$PAGE" \
        --output=html \
        --output=json \
        --output-path="./lighthouse-reports/$NAME" \
        --chrome-flags="--headless --no-sandbox" \
        --quiet \
        --only-categories=performance,accessibility,best-practices,seo

    echo -e "${GREEN}✅ Completed: $NAME${NC}"
done

# Kill the Next.js server
echo ""
echo -e "${YELLOW}🛑 Stopping production server...${NC}"
kill $SERVER_PID

echo ""
echo -e "${GREEN}✅ Performance Audit Complete!${NC}"
echo ""
echo "📁 Reports saved to: ./lighthouse-reports/"
echo ""
echo "Open reports:"
for i in "${!PAGE_NAMES[@]}"; do
    NAME="${PAGE_NAMES[$i]}"
    echo "  - lighthouse-reports/${NAME}.report.html"
done
echo ""

# Calculate average scores (from JSON reports)
echo -e "${GREEN}📈 Performance Summary${NC}"
echo "======================="
echo ""

for i in "${!PAGE_NAMES[@]}"; do
    NAME="${PAGE_NAMES[$i]}"
    if [ -f "./lighthouse-reports/${NAME}.report.json" ]; then
        PERF=$(jq -r '.categories.performance.score * 100' "./lighthouse-reports/${NAME}.report.json")
        A11Y=$(jq -r '.categories.accessibility.score * 100' "./lighthouse-reports/${NAME}.report.json")
        BP=$(jq -r '.categories["best-practices"].score * 100' "./lighthouse-reports/${NAME}.report.json")
        SEO=$(jq -r '.categories.seo.score * 100' "./lighthouse-reports/${NAME}.report.json")

        echo "$NAME:"
        echo "  Performance: ${PERF}%"
        echo "  Accessibility: ${A11Y}%"
        echo "  Best Practices: ${BP}%"
        echo "  SEO: ${SEO}%"
        echo ""
    fi
done

echo -e "${GREEN}✨ Done! Open the HTML reports to see detailed results.${NC}"
