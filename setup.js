#!/usr/bin/env node

/**
 * Setup Script for Printify Dropshipping Store
 *
 * This script helps users configure their environment variables
 * by copying .env.example to .env and providing guidance on
 * where to get API credentials.
 */

const fs = require('fs');

const ENV_EXAMPLE = '.env.example';
const ENV_FILE = '.env';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function print(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function printBanner() {
    console.log('\n' + colors.bright + colors.blue + '═'.repeat(60) + colors.reset);
    print('  🛍️  Printify Dropshipping Store - Setup Wizard', 'bright');
    console.log(colors.bright + colors.blue + '═'.repeat(60) + colors.reset + '\n');
}

function checkEnvExample() {
    if (!fs.existsSync(ENV_EXAMPLE)) {
        print('❌ Error: .env.example file not found!', 'red');
        print('   Please make sure you are in the correct directory.', 'red');
        process.exit(1);
    }
}

function copyEnvFile() {
    print('📋 Step 1: Creating environment configuration file...', 'cyan');

    if (fs.existsSync(ENV_FILE)) {
        print('⚠️  Warning: .env file already exists!', 'yellow');
        print('   Your existing configuration will be preserved.', 'yellow');
        return false;
    }

    try {
        fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
        print('✅ Successfully created .env file', 'green');
        return true;
    } catch (error) {
        print('❌ Error copying .env.example to .env:', 'red');
        print('   ' + error.message, 'red');
        process.exit(1);
    }
}

function validateEnvFile() {
    print('\n🔍 Step 2: Validating environment configuration...', 'cyan');

    try {
        const envContent = fs.readFileSync(ENV_FILE, 'utf8');
        const lines = envContent.split('\n');

        let hasPlaceholders = false;
        const issues = [];

        for (const line of lines) {
            if (line.includes('your_api_token_here')) {
                issues.push('PRINTIFY_API_TOKEN needs to be replaced with your actual API token');
                hasPlaceholders = true;
            }
            if (line.includes('your_shop_id_here')) {
                issues.push('PRINTIFY_SHOP_ID needs to be replaced with your actual shop ID');
                hasPlaceholders = true;
            }
        }

        if (hasPlaceholders) {
            print('⚠️  Configuration incomplete - placeholder values detected:', 'yellow');
            issues.forEach((issue) => print('   • ' + issue, 'yellow'));
            return false;
        } else {
            print('✅ Environment configuration looks good!', 'green');
            return true;
        }
    } catch (error) {
        print('❌ Error reading .env file:', 'red');
        print('   ' + error.message, 'red');
        return false;
    }
}

function printInstructions() {
    print('\n📝 Step 3: Configuration Instructions', 'cyan');
    console.log('');
    print('To complete the setup, you need to configure your .env file:', 'bright');
    console.log('');

    print('1. Get your Printify API Token:', 'yellow');
    print('   • Log in to your Printify account', 'reset');
    print('   • Go to: https://printify.com/app/account/api', 'blue');
    print('   • Click "Generate Token" or use an existing token', 'reset');
    print('   • Copy the token (it starts with "eyJ...")', 'reset');
    console.log('');

    print('2. Find your Shop ID:', 'yellow');
    print('   • In your Printify dashboard, go to "My Shops"', 'reset');
    print('   • Click on your shop name', 'reset');
    print('   • The Shop ID is in your shop settings', 'reset');
    console.log('');

    print('3. Edit the .env file:', 'yellow');
    print('   • Open .env in your text editor', 'reset');
    print('   • Replace "your_api_token_here" with your API token', 'reset');
    print('   • Replace "your_shop_id_here" with your Shop ID', 'reset');
    print('   • Save the file', 'reset');
    console.log('');
}

function printNextSteps(isConfigured) {
    print('🚀 Next Steps:', 'cyan');
    console.log('');

    if (!isConfigured) {
        print('1. Edit the .env file with your Printify credentials', 'yellow');
        print('2. Install dependencies: npm install', 'reset');
        print('3. Start the server: npm start', 'reset');
        print('4. Open your browser: http://localhost:3000', 'reset');
    } else {
        print('1. Install dependencies (if not done): npm install', 'reset');
        print('2. Start the server: npm start', 'reset');
        print('3. Open your browser: http://localhost:3000', 'reset');
    }

    console.log('');
    print('📚 For more information, see:', 'cyan');
    print('   • README.md - Full documentation', 'reset');
    print('   • SETUP.md - Detailed setup guide', 'reset');
    print('   • QUICKSTART.md - Quick reference', 'reset');
    console.log('');
}

function printSecurityWarning() {
    console.log(colors.bright + colors.yellow + '⚠️  SECURITY REMINDER:' + colors.reset);
    print('   • NEVER commit your .env file to version control', 'yellow');
    print('   • Keep your API token secret and secure', 'yellow');
    print('   • The .env file is already in .gitignore', 'yellow');
    console.log('');
}

function main() {
    printBanner();

    // Check if .env.example exists
    checkEnvExample();

    // Copy .env.example to .env
    copyEnvFile();

    // Validate the .env file
    const isConfigured = validateEnvFile();

    // Print configuration instructions
    if (!isConfigured) {
        printInstructions();
    }

    // Print security warning
    printSecurityWarning();

    // Print next steps
    printNextSteps(isConfigured);

    // Final message
    if (isConfigured) {
        print('✨ Setup complete! Your store is ready to use.', 'green');
    } else {
        print('⏳ Setup incomplete. Please configure your .env file.', 'yellow');
    }

    console.log('');
}

// Run the setup
main();
