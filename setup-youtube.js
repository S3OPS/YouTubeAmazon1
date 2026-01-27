#!/usr/bin/env node

// YouTube Automation Setup Wizard
// Interactive setup for YouTube Amazon Affiliate automation system

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${color}${text}${colors.reset}`;
}

function header(text) {
    console.log('\n' + colorize('='.repeat(60), colors.cyan));
    console.log(colorize(text, colors.bright));
    console.log(colorize('='.repeat(60), colors.cyan) + '\n');
}

function success(text) {
    console.log(colorize('✅ ' + text, colors.green));
}

function info(text) {
    console.log(colorize('ℹ️  ' + text, colors.blue));
}

function warning(text) {
    console.log(colorize('⚠️  ' + text, colors.yellow));
}

function error(text) {
    console.log(colorize('❌ ' + text, colors.red));
}

function question(prompt) {
    return new Promise(resolve => {
        rl.question(colorize(prompt, colors.cyan), answer => {
            resolve(answer.trim());
        });
    });
}

async function setupYouTubeAutomation() {
    header('🎬 YouTube Amazon Affiliate Automation Setup');
    
    console.log('Welcome to the YouTube Automation Setup Wizard!\n');
    console.log('This wizard will help you configure:');
    console.log('  • YouTube API credentials');
    console.log('  • Amazon Affiliate settings');
    console.log('  • Automation schedule');
    console.log('  • Video processing directories\n');

    const config = {};

    // YouTube Configuration
    header('📺 YouTube API Configuration');
    
    console.log('To get YouTube API credentials:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable "YouTube Data API v3"');
    console.log('4. Create OAuth 2.0 credentials');
    console.log('5. Add http://localhost:3000/oauth2callback as redirect URI\n');

    config.YOUTUBE_CLIENT_ID = await question('Enter YouTube Client ID: ');
    config.YOUTUBE_CLIENT_SECRET = await question('Enter YouTube Client Secret: ');
    config.YOUTUBE_REDIRECT_URI = await question('Enter Redirect URI [http://localhost:3000/oauth2callback]: ') 
        || 'http://localhost:3000/oauth2callback';

    info('You will need to authorize the app to get a refresh token.');
    info('After starting the server, visit /api/youtube/auth-url to begin authorization.');
    config.YOUTUBE_REFRESH_TOKEN = await question('Enter YouTube Refresh Token (or leave blank for now): ') 
        || 'your_youtube_refresh_token_here';

    // Amazon Affiliate Configuration
    header('💰 Amazon Affiliate Configuration');
    
    console.log('To get your Amazon Affiliate tag:');
    console.log('1. Sign up at https://affiliate-program.amazon.com/');
    console.log('2. Complete the application');
    console.log('3. Get your affiliate tag from the dashboard\n');

    config.AMAZON_AFFILIATE_TAG = await question('Enter Amazon Affiliate Tag: ');
    config.AMAZON_TRACKING_ID = await question('Enter Amazon Tracking ID [same as tag]: ') 
        || config.AMAZON_AFFILIATE_TAG;

    // Video Processing Configuration
    header('📹 Video Processing Configuration');
    
    config.VIDEO_DIRECTORY = await question('Video directory path [./videos]: ') || './videos';
    config.PROCESSED_VIDEO_DIRECTORY = await question('Processed video directory [./videos/processed]: ') 
        || './videos/processed';

    // Automation Configuration
    header('⚙️  Automation Configuration');
    
    const enableAutoUpload = await question('Enable automatic video uploads? (yes/no) [no]: ');
    config.AUTO_UPLOAD = enableAutoUpload.toLowerCase() === 'yes' || enableAutoUpload.toLowerCase() === 'y' 
        ? 'true' : 'false';

    if (config.AUTO_UPLOAD === 'true') {
        console.log('\nUpload Schedule Examples:');
        console.log('  0 10 * * *   - Daily at 10 AM');
        console.log('  0 14 * * 1-5 - Weekdays at 2 PM');
        console.log('  0 */6 * * *  - Every 6 hours\n');
        
        config.UPLOAD_SCHEDULE = await question('Enter upload schedule [0 10 * * *]: ') || '0 10 * * *';
    } else {
        config.UPLOAD_SCHEDULE = '0 10 * * *';
    }

    config.DEFAULT_PRIVACY_STATUS = await question('Default privacy status (public/unlisted/private) [public]: ') 
        || 'public';

    // Server Configuration
    header('🖥️  Server Configuration');
    
    config.PORT = await question('Server port [3000]: ') || '3000';
    config.NODE_ENV = await question('Environment (development/production) [development]: ') || 'development';
    config.ALLOWED_ORIGINS = await question('Allowed CORS origins [http://localhost:3000]: ') 
        || 'http://localhost:3000';

    // Legacy Printify (optional)
    header('🛍️  Legacy Printify Configuration (Optional)');
    
    const includePrintify = await question('Include Printify configuration? (yes/no) [no]: ');
    if (includePrintify.toLowerCase() === 'yes' || includePrintify.toLowerCase() === 'y') {
        config.PRINTIFY_API_TOKEN = await question('Printify API Token: ') || 'your_api_token_here';
        config.PRINTIFY_SHOP_ID = await question('Printify Shop ID: ') || 'your_shop_id_here';
        config.PRINTIFY_API_BASE_URL = await question('Printify API Base URL [https://api.printify.com/v1]: ') 
            || 'https://api.printify.com/v1';
    }

    // Generate .env file
    header('💾 Generating Configuration');
    
    const envContent = generateEnvContent(config);
    const envPath = path.join(__dirname, '.env');

    if (fs.existsSync(envPath)) {
        const overwrite = await question('.env file already exists. Overwrite? (yes/no) [no]: ');
        if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
            info('Skipping .env file creation');
            const backupPath = path.join(__dirname, '.env.new');
            fs.writeFileSync(backupPath, envContent);
            success(`Configuration saved to ${backupPath}`);
        } else {
            fs.writeFileSync(envPath, envContent);
            success('.env file created successfully!');
        }
    } else {
        fs.writeFileSync(envPath, envContent);
        success('.env file created successfully!');
    }

    // Create directories
    header('📁 Creating Directories');
    
    try {
        if (!fs.existsSync(config.VIDEO_DIRECTORY)) {
            fs.mkdirSync(config.VIDEO_DIRECTORY, { recursive: true });
            success(`Created ${config.VIDEO_DIRECTORY}`);
        } else {
            info(`${config.VIDEO_DIRECTORY} already exists`);
        }

        if (!fs.existsSync(config.PROCESSED_VIDEO_DIRECTORY)) {
            fs.mkdirSync(config.PROCESSED_VIDEO_DIRECTORY, { recursive: true });
            success(`Created ${config.PROCESSED_VIDEO_DIRECTORY}`);
        } else {
            info(`${config.PROCESSED_VIDEO_DIRECTORY} already exists`);
        }
    } catch (err) {
        error(`Failed to create directories: ${err.message}`);
    }

    // Final instructions
    header('🎉 Setup Complete!');
    
    console.log('Next steps:\n');
    
    if (config.YOUTUBE_REFRESH_TOKEN === 'your_youtube_refresh_token_here') {
        console.log('1. Start the server:');
        console.log(colorize('   npm start', colors.green));
        console.log('\n2. Get YouTube authorization:');
        console.log(colorize('   Visit http://localhost:3000/api/youtube/auth-url', colors.green));
        console.log('   Follow the authorization flow');
        console.log('   Copy the refresh token to your .env file\n');
    } else {
        console.log('1. Start the server:');
        console.log(colorize('   npm start', colors.green));
        console.log('');
    }

    console.log('2. Add your AI-generated videos:');
    console.log(colorize(`   Place videos in ${config.VIDEO_DIRECTORY}`, colors.green));
    console.log('');

    console.log('3. Create video configuration files (optional):');
    console.log(colorize('   video-name.json with title, description, products', colors.green));
    console.log('');

    if (config.AUTO_UPLOAD === 'true') {
        console.log('4. Videos will be automatically processed and uploaded');
        console.log(colorize(`   Schedule: ${config.UPLOAD_SCHEDULE}`, colors.green));
        console.log('');
    } else {
        console.log('4. Manually trigger uploads:');
        console.log(colorize('   POST http://localhost:3000/api/automation/trigger', colors.green));
        console.log('');
    }

    console.log('📚 Documentation:');
    console.log('   • YOUTUBE_AUTOMATION.md - Complete usage guide');
    console.log('   • README.md - General overview');
    console.log('   • .env.example - Configuration reference\n');

    console.log(colorize('Happy automating! 🚀', colors.bright));

    rl.close();
}

function generateEnvContent(config) {
    return `# YouTube Amazon Affiliate Automation System
# Generated by setup wizard on ${new Date().toISOString()}

# ===========================================
# YouTube API Configuration
# ===========================================
YOUTUBE_CLIENT_ID=${config.YOUTUBE_CLIENT_ID}
YOUTUBE_CLIENT_SECRET=${config.YOUTUBE_CLIENT_SECRET}
YOUTUBE_REDIRECT_URI=${config.YOUTUBE_REDIRECT_URI}
YOUTUBE_REFRESH_TOKEN=${config.YOUTUBE_REFRESH_TOKEN}

# ===========================================
# Amazon Affiliate Configuration
# ===========================================
AMAZON_AFFILIATE_TAG=${config.AMAZON_AFFILIATE_TAG}
AMAZON_TRACKING_ID=${config.AMAZON_TRACKING_ID}

# ===========================================
# Video Processing Configuration
# ===========================================
VIDEO_DIRECTORY=${config.VIDEO_DIRECTORY}
PROCESSED_VIDEO_DIRECTORY=${config.PROCESSED_VIDEO_DIRECTORY}

# ===========================================
# Automation Configuration
# ===========================================
AUTO_UPLOAD=${config.AUTO_UPLOAD}
UPLOAD_SCHEDULE=${config.UPLOAD_SCHEDULE}
DEFAULT_PRIVACY_STATUS=${config.DEFAULT_PRIVACY_STATUS}

# ===========================================
# Server Configuration
# ===========================================
PORT=${config.PORT}
NODE_ENV=${config.NODE_ENV}
ALLOWED_ORIGINS=${config.ALLOWED_ORIGINS}

${config.PRINTIFY_API_TOKEN ? `
# ===========================================
# Legacy Printify Configuration (Optional)
# ===========================================
PRINTIFY_API_TOKEN=${config.PRINTIFY_API_TOKEN}
PRINTIFY_SHOP_ID=${config.PRINTIFY_SHOP_ID}
PRINTIFY_API_BASE_URL=${config.PRINTIFY_API_BASE_URL}
` : ''}`;
}

// Run setup
setupYouTubeAutomation().catch(err => {
    error(`Setup failed: ${err.message}`);
    rl.close();
    process.exit(1);
});
