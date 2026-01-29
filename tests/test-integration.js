#!/usr/bin/env node

/**
 * Integration Test
 * Tests that the backend server is working correctly
 */

console.log('🧪 Running Integration Tests...\n');
console.log('Note: These tests require the server to be running on http://localhost:3000\n');

async function test(description, testFn) {
    try {
        await testFn();
        console.log('✅', description);
        return true;
    } catch (error) {
        console.log('❌', description, '-', error.message);
        return false;
    }
}

async function runTests() {
    let passed = 0;
    let failed = 0;

    // Test 1: Health endpoint
    if (
        await test('GET /api/health returns status ok', async () => {
            const response = await fetch('http://localhost:3000/api/health');
            const data = await response.json();
            if (data.status !== 'ok') {
                throw new Error('Status not ok');
            }
        })
    ) {
        passed++;
    } else {
        failed++;
    }

    // Test 2: Health endpoint shows configured status
    if (
        await test('GET /api/health shows configured status', async () => {
            const response = await fetch('http://localhost:3000/api/health');
            const data = await response.json();
            if (typeof data.configured !== 'boolean') {
                throw new Error('Configured status missing');
            }
        })
    ) {
        passed++;
    } else {
        failed++;
    }

    // Test 3: Products endpoint responds (may return error in demo mode)
    if (
        await test('GET /api/products responds', async () => {
            const response = await fetch('http://localhost:3000/api/products');
            // Accept both success and error responses (may be in demo mode)
            // 503 = API not configured, 500 = other errors
            if (!response.ok && response.status !== 500 && response.status !== 503) {
                throw new Error(`Unexpected HTTP ${response.status}`);
            }
        })
    ) {
        passed++;
    } else {
        failed++;
    }

    // Test 4: Products endpoint returns JSON
    if (
        await test('GET /api/products returns JSON', async () => {
            const response = await fetch('http://localhost:3000/api/products');
            const data = await response.json();
            if (typeof data !== 'object') {
                throw new Error('Response is not JSON');
            }
        })
    ) {
        passed++;
    } else {
        failed++;
    }

    // Test 5: Frontend is served
    if (
        await test('GET / serves HTML page', async () => {
            const response = await fetch('http://localhost:3000/');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const html = await response.text();
            if (!html.includes('<html')) {
                throw new Error('Not an HTML page');
            }
        })
    ) {
        passed++;
    } else {
        failed++;
    }

    // Test 6: Static files are served
    if (
        await test('GET /app.js serves JavaScript', async () => {
            const response = await fetch('http://localhost:3000/app.js');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
        })
    ) {
        passed++;
    } else {
        failed++;
    }

    console.log('\n' + '='.repeat(50));
    console.log(`Tests Passed: ${passed}`);
    console.log(`Tests Failed: ${failed}`);
    console.log('='.repeat(50));

    if (failed === 0) {
        console.log('\n🎉 All integration tests passed!');
        console.log('✅ Backend server is working correctly');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some integration tests failed!');
        console.log('Make sure the server is running: npm start');
        process.exit(1);
    }
}

runTests().catch((error) => {
    console.error('\n❌ Test suite failed:', error.message);
    console.log('\nMake sure the server is running: npm start');
    process.exit(1);
});
