#!/bin/bash

echo ""
echo "🤖 Stealth AI System - Live Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This demo shows the complete workflow without APIs configured."
echo ""

# Clean start
echo "📦 Step 1: Clean slate..."
rm -rf data/ logs/
echo "   ✅ Cleaned"
echo ""

# Generate content
echo "🎯 Step 2: Generate micro-content with products..."
echo "   Running: node index.js generate B08DEMO1 B08DEMO2 B08DEMO3"
echo ""
node index.js generate B08DEMO1 B08DEMO2 B08DEMO3 2>&1 | grep -E "(Generating|Generated|Added|✅)"
echo ""

# Show status
echo "📊 Step 3: Check system status..."
echo ""
node index.js status 2>&1 | tail -n +4
echo ""

# Show what was generated
echo "📝 Step 4: View generated content..."
echo ""
echo "Sample from queue (compressed signals):"
cat data/queue.json | grep -A 1 "title" | head -6
echo ""

# Test post
echo "🚀 Step 5: Test posting (dry run)..."
echo ""
node index.js post 2>&1 | grep -E "(Would post|Posted|📝|✅)"
echo ""

# Final status
echo "✅ Step 6: Final queue status..."
echo ""
node index.js status 2>&1 | grep "Queue Size"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Demo complete!"
echo ""
echo "💡 Key concepts demonstrated:"
echo "   • Micro-content generation"
echo "   • Signal compression (notice compressed titles)"
echo "   • Queue management"
echo "   • Stealth posting"
echo ""
echo "📖 Next steps:"
echo "   • Read README.md for full overview"
echo "   • Read QUICKSTART.md for setup guide"
echo "   • Run: npm run setup"
echo ""
