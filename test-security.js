#!/usr/bin/env node

/**
 * Security Verification Test
 * Tests that API credentials are properly secured
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Verification Tests...\n');

let passed = 0;
let failed = 0;

function test(description, condition) {
    if (condition) {
        console.log('✅', description);
        passed++;
    } else {
        console.log('❌', description);
        failed++;
    }
}

// Test 1: app.js should not contain API tokens
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
test('app.js does not contain API token', !appJs.includes('eyJ0eXAiOiJKV1Qi'));
test('app.js does not contain hardcoded shopId in config', !appJs.includes("shopId: 'PablosMerchantStand'"));

// Test 2: server.js should use environment variables
const serverJs = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
test('server.js uses process.env.PRINTIFY_API_TOKEN', serverJs.includes('process.env.PRINTIFY_API_TOKEN'));
test('server.js uses process.env.PRINTIFY_SHOP_ID', serverJs.includes('process.env.PRINTIFY_SHOP_ID'));

// Test 3: .env should be in .gitignore
const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
test('.env is in .gitignore', gitignore.split('\n').includes('.env'));
test('node_modules/ is in .gitignore', gitignore.split('\n').includes('node_modules/'));

// Test 4: .env.example should exist
test('.env.example exists', fs.existsSync(path.join(__dirname, '.env.example')));

// Test 5: package.json should have required dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
test('express is in dependencies', packageJson.dependencies.express !== undefined);
test('dotenv is in dependencies', packageJson.dependencies.dotenv !== undefined);
test('cors is in dependencies', packageJson.dependencies.cors !== undefined);

// Test 6: server.js should define API routes
test('server.js has /api/products endpoint', serverJs.includes("app.get('/api/products'"));
test('server.js has /api/orders endpoint', serverJs.includes("app.post('/api/orders'"));
test('server.js has /api/health endpoint', serverJs.includes("app.get('/api/health'"));

// Test 7: app.js should call backend API
test('app.js calls backend API', appJs.includes("apiBaseUrl:") && appJs.includes("'/api'"));
test('app.js does not directly call Printify API', !appJs.includes('api.printify.com'));

// Test 8: Backend has proper error handling
test('server.js has error handling', serverJs.includes('try') && serverJs.includes('catch'));

console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${passed}`);
console.log(`Tests Failed: ${failed}`);
console.log('='.repeat(50));

if (failed === 0) {
    console.log('\n🎉 All security tests passed!');
    console.log('✅ API credentials are properly secured');
    process.exit(0);
} else {
    console.log('\n⚠️  Some security tests failed!');
    process.exit(1);
}
