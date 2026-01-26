#!/usr/bin/env node

/**
 * Automation Validation Script
 *
 * Validates that all automation infrastructure is properly configured
 * and functional. This script performs comprehensive checks on:
 * - GitHub Actions workflows
 * - Configuration files
 * - Automation scripts
 * - Testing infrastructure
 * - Pre-commit hooks
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    bold: '\x1b[1m',
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;

console.log('═══════════════════════════════════════════════════════════════');
console.log('🔍 AUTOMATION VALIDATION');
console.log('═══════════════════════════════════════════════════════════════\n');

/**
 * Check if a file exists
 */
function checkFile(filePath, description, critical = true) {
    totalChecks++;
    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
        console.log(`${colors.green}✅${colors.reset} ${description}`);
        passedChecks++;
        return true;
    } else {
        if (critical) {
            console.log(`${colors.red}❌${colors.reset} ${description} (missing: ${filePath})`);
            failedChecks++;
        } else {
            console.log(`${colors.yellow}⚠️ ${colors.reset} ${description} (missing: ${filePath})`);
            warnings++;
        }
        return false;
    }
}

/**
 * Check if file contains specific content
 */
function checkFileContent(filePath, pattern, description, critical = true) {
    totalChecks++;
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        if (critical) {
            console.log(
                `${colors.red}❌${colors.reset} ${description} (file not found: ${filePath})`
            );
            failedChecks++;
        } else {
            console.log(
                `${colors.yellow}⚠️ ${colors.reset} ${description} (file not found: ${filePath})`
            );
            warnings++;
        }
        return false;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const regex = new RegExp(pattern);

    if (regex.test(content)) {
        console.log(`${colors.green}✅${colors.reset} ${description}`);
        passedChecks++;
        return true;
    } else {
        if (critical) {
            console.log(`${colors.red}❌${colors.reset} ${description}`);
            failedChecks++;
        } else {
            console.log(`${colors.yellow}⚠️ ${colors.reset} ${description}`);
            warnings++;
        }
        return false;
    }
}

/**
 * Validate GitHub Actions Workflows
 */
console.log(`${colors.blue}━━━ GitHub Actions Workflows ━━━${colors.reset}`);

const workflows = [
    'setup.yml',
    'codeql.yml',
    'deploy.yml',
    'release.yml',
    'health-check.yml',
    'performance.yml',
    'auto-deploy.yml',
    'rollback.yml',
    'secret-validation.yml',
    'dependency-auto-merge.yml',
    'backup.yml',
];

workflows.forEach((workflow) => {
    checkFile(`.github/workflows/${workflow}`, `GitHub Workflow: ${workflow}`);
});

console.log('');

/**
 * Validate Workflow Content
 */
console.log(`${colors.blue}━━━ Workflow Configuration Validation ━━━${colors.reset}`);

checkFileContent('.github/workflows/setup.yml', 'lint-and-format', 'CI/CD has linting job');

checkFileContent('.github/workflows/setup.yml', 'security-audit', 'CI/CD has security audit job');

checkFileContent(
    '.github/workflows/setup.yml',
    'integration-tests',
    'CI/CD has integration tests job'
);

checkFileContent('.github/workflows/codeql.yml', 'schedule:', 'CodeQL has scheduled runs');

checkFileContent(
    '.github/workflows/health-check.yml',
    'schedule:',
    'Health check has scheduled runs'
);

checkFileContent(
    '.github/workflows/auto-deploy.yml',
    'push:',
    'Auto-deploy triggers on push to main'
);

console.log('');

/**
 * Validate Configuration Files
 */
console.log(`${colors.blue}━━━ Configuration Files ━━━${colors.reset}`);

checkFile('package.json', 'Package configuration');
checkFile('.env.example', 'Environment template');
checkFile('.gitignore', 'Git ignore rules');
checkFile('.dockerignore', 'Docker ignore rules');
checkFile('Dockerfile', 'Docker configuration');
checkFile('docker-compose.yml', 'Docker Compose configuration');
checkFile('eslint.config.js', 'ESLint configuration');
checkFile('.prettierrc', 'Prettier configuration');
checkFile('.github/dependabot.yml', 'Dependabot configuration');

console.log('');

/**
 * Validate Automation Scripts
 */
console.log(`${colors.blue}━━━ Automation Scripts ━━━${colors.reset}`);

checkFile('build-configure-test.sh', 'Build-configure-test script');
checkFile('monitor.sh', 'Monitoring script');
checkFile('setup.js', 'Setup wizard');
checkFile('automation-dashboard.sh', 'Automation dashboard');
checkFile('validate-automation.js', 'Automation validator');

// Check if scripts are executable
const scripts = ['build-configure-test.sh', 'monitor.sh', 'automation-dashboard.sh'];
scripts.forEach((script) => {
    const fullPath = path.join(process.cwd(), script);
    if (fs.existsSync(fullPath)) {
        totalChecks++;
        try {
            fs.accessSync(fullPath, fs.constants.X_OK);
            console.log(`${colors.green}✅${colors.reset} ${script} is executable`);
            passedChecks++;
        } catch {
            console.log(
                `${colors.yellow}⚠️ ${colors.reset} ${script} is not executable (run: chmod +x ${script})`
            );
            warnings++;
        }
    }
});

console.log('');

/**
 * Validate NPM Scripts
 */
console.log(`${colors.blue}━━━ NPM Scripts ━━━${colors.reset}`);

const requiredScripts = [
    'start',
    'test',
    'test:security',
    'test:integration',
    'lint',
    'lint:fix',
    'format',
    'format:check',
    'setup',
    'build-configure-test',
    'ci',
];

requiredScripts.forEach((script) => {
    checkFileContent('package.json', `"${script}":`, `NPM script: ${script}`);
});

console.log('');

/**
 * Validate Testing Infrastructure
 */
console.log(`${colors.blue}━━━ Testing Infrastructure ━━━${colors.reset}`);

checkFile('test-security.js', 'Security tests');
checkFile('test-integration.js', 'Integration tests');

console.log('');

/**
 * Validate Pre-commit Hooks
 */
console.log(`${colors.blue}━━━ Pre-commit Hooks ━━━${colors.reset}`);

checkFile('.husky/pre-commit', 'Husky pre-commit hook', false);
checkFileContent('package.json', 'lint-staged', 'lint-staged configuration');
checkFileContent('package.json', '"prepare".*husky', 'Husky prepare script');

console.log('');

/**
 * Validate Security Configuration
 */
console.log(`${colors.blue}━━━ Security Configuration ━━━${colors.reset}`);

checkFileContent('.gitignore', '\\.env', '.env is in .gitignore');

checkFileContent(
    'server.js',
    'process\\.env\\.PRINTIFY_API_TOKEN',
    'Server uses env vars for API token'
);

checkFileContent('server.js', 'helmet', 'Server uses Helmet for security headers');

checkFileContent('server.js', 'rate.*limit', 'Server has rate limiting', false);

totalChecks++;
if (!fs.existsSync('.env')) {
    console.log(`${colors.green}✅${colors.reset} .env file not in repository (good!)`);
    passedChecks++;
} else {
    console.log(
        `${colors.red}❌${colors.reset} .env file found in repository (should not be committed!)`
    );
    failedChecks++;
}

console.log('');

/**
 * Validate Documentation
 */
console.log(`${colors.blue}━━━ Documentation ━━━${colors.reset}`);

checkFile('README.md', 'README documentation');
checkFile('AUTOMATION.md', 'Automation guide');
checkFile('SETUP.md', 'Setup instructions', false);
checkFile('SECURITY.md', 'Security documentation', false);
checkFile('CONTRIBUTING.md', 'Contributing guide', false);

console.log('');

/**
 * Validate Docker Configuration
 */
console.log(`${colors.blue}━━━ Docker Configuration ━━━${colors.reset}`);

checkFileContent('Dockerfile', 'HEALTHCHECK', 'Dockerfile has health check');

checkFileContent('Dockerfile', 'USER', 'Dockerfile uses non-root user');

checkFileContent('docker-compose.yml', 'healthcheck:', 'Docker Compose has health check');

console.log('');

/**
 * Summary
 */
console.log('═══════════════════════════════════════════════════════════════');
console.log(`${colors.bold}VALIDATION SUMMARY${colors.reset}`);
console.log('═══════════════════════════════════════════════════════════════\n');

console.log(`Total Checks:    ${totalChecks}`);
console.log(`${colors.green}✅ Passed:       ${passedChecks}${colors.reset}`);
console.log(`${colors.red}❌ Failed:       ${failedChecks}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings:     ${warnings}${colors.reset}\n`);

const successRate = ((passedChecks / totalChecks) * 100).toFixed(1);
console.log(`Success Rate:    ${successRate}%\n`);

if (failedChecks === 0) {
    console.log(`${colors.green}${colors.bold}🎉 ALL CRITICAL CHECKS PASSED!${colors.reset}`);
    console.log(
        `${colors.green}Automation infrastructure is properly configured.${colors.reset}\n`
    );
    process.exit(0);
} else {
    console.log(`${colors.red}${colors.bold}⚠️  SOME CHECKS FAILED${colors.reset}`);
    console.log(`${colors.red}Please fix the failed checks above.${colors.reset}\n`);
    process.exit(1);
}
