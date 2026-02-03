#!/bin/bash

echo "🧪 Testing Stealth AI System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Help
echo "✓ Test 1: Help command"
node index.js > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Help command works"
else
    echo "  ❌ Help command failed"
    exit 1
fi

# Test 2: Content generation
echo "✓ Test 2: Content generation"
node index.js generate TEST1 TEST2 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Content generation works"
else
    echo "  ❌ Content generation failed"
    exit 1
fi

# Test 3: Status check
echo "✓ Test 3: Status check"
node index.js status > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Status check works"
else
    echo "  ❌ Status check failed"
    exit 1
fi

# Test 4: Queue exists
echo "✓ Test 4: Queue persistence"
if [ -f "data/queue.json" ]; then
    echo "  ✅ Queue file created"
else
    echo "  ❌ Queue file not found"
    exit 1
fi

# Test 5: Post command (dry run)
echo "✓ Test 5: Post command"
node index.js post > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Post command works"
else
    echo "  ❌ Post command failed"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests passed!"
echo ""
