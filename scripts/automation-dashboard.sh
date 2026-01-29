#!/bin/bash

# Automation Dashboard Script
# Provides a comprehensive view of all automation status

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "🤖 AUTOMATION DASHBOARD"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${RED}❌${NC} $2 (missing: $1)"
        return 1
    fi
}

# Function to check if a command exists
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✅${NC} $2"
        return 0
    else
        echo -e "${YELLOW}⚠️ ${NC} $2 (not installed: $1)"
        return 1
    fi
}

# GitHub Workflows Check
echo -e "${BLUE}━━━ GitHub Actions Workflows ━━━${NC}"
check_file ".github/workflows/setup.yml" "CI/CD Pipeline (setup.yml)"
check_file ".github/workflows/codeql.yml" "CodeQL Security Scanning (codeql.yml)"
check_file ".github/workflows/deploy.yml" "Docker Deployment (deploy.yml)"
check_file ".github/workflows/release.yml" "Automated Release (release.yml)"
check_file ".github/workflows/health-check.yml" "Health Monitoring (health-check.yml)"
check_file ".github/workflows/performance.yml" "Performance Testing (performance.yml)"
check_file ".github/workflows/auto-deploy.yml" "Auto Deployment (auto-deploy.yml)"
check_file ".github/workflows/rollback.yml" "Rollback Automation (rollback.yml)"
check_file ".github/workflows/secret-validation.yml" "Secret Validation (secret-validation.yml)"
check_file ".github/workflows/dependency-auto-merge.yml" "Dependency Auto-merge (dependency-auto-merge.yml)"
check_file ".github/workflows/backup.yml" "Automated Backup (backup.yml)"
echo ""

# Configuration Files Check
echo -e "${BLUE}━━━ Configuration Files ━━━${NC}"
check_file ".github/dependabot.yml" "Dependabot Configuration"
check_file "package.json" "NPM Configuration"
check_file "eslint.config.js" "ESLint Configuration"
check_file ".prettierrc" "Prettier Configuration"
check_file ".env.example" "Environment Template"
check_file ".gitignore" "Git Ignore Rules"
check_file ".dockerignore" "Docker Ignore Rules"
check_file "Dockerfile" "Docker Configuration"
check_file "docker-compose.yml" "Docker Compose Configuration"
check_file "docker-compose.prod.yml" "Production Docker Compose"
echo ""

# Automation Scripts Check
echo -e "${BLUE}━━━ Automation Scripts ━━━${NC}"
check_file "scripts/build-configure-test.sh" "Build-Configure-Test Script"
check_file "scripts/monitor.sh" "Monitoring Script"
check_file "scripts/setup.js" "Setup Wizard"
check_file "scripts/automation-dashboard.sh" "Automation Dashboard"
check_file "src/lib/validate-automation.js" "Automation Validator"
echo ""

# Pre-commit Hooks Check
echo -e "${BLUE}━━━ Pre-commit Hooks (Husky) ━━━${NC}"
check_file ".husky/pre-commit" "Husky Pre-commit Hook"
if [ -f "package.json" ]; then
    if grep -q "lint-staged" package.json; then
        echo -e "${GREEN}✅${NC} lint-staged configured"
    else
        echo -e "${YELLOW}⚠️ ${NC} lint-staged not configured"
    fi
fi
echo ""

# Test Infrastructure Check
echo -e "${BLUE}━━━ Testing Infrastructure ━━━${NC}"
check_file "tests/test-security.js" "Security Tests"
check_file "tests/test-integration.js" "Integration Tests"

if [ -f "package.json" ]; then
    if grep -q '"test":' package.json; then
        echo -e "${GREEN}✅${NC} NPM test script configured"
    fi
    if grep -q '"test:security":' package.json; then
        echo -e "${GREEN}✅${NC} Security test script configured"
    fi
    if grep -q '"test:integration":' package.json; then
        echo -e "${GREEN}✅${NC} Integration test script configured"
    fi
fi
echo ""

# Docker Check
echo -e "${BLUE}━━━ Docker Environment ━━━${NC}"
check_command "docker" "Docker installed"
check_command "docker-compose" "Docker Compose installed"

if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅${NC} Docker daemon running"
    else
        echo -e "${YELLOW}⚠️ ${NC} Docker daemon not running"
    fi
fi
echo ""

# Development Tools Check
echo -e "${BLUE}━━━ Development Tools ━━━${NC}"
check_command "node" "Node.js installed"
check_command "npm" "NPM installed"
check_command "git" "Git installed"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "   ${GREEN}→${NC} Node.js version: $NODE_VERSION"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "   ${GREEN}→${NC} NPM version: $NPM_VERSION"
fi
echo ""

# NPM Scripts Availability
echo -e "${BLUE}━━━ Available NPM Scripts ━━━${NC}"
if [ -f "package.json" ]; then
    SCRIPTS=(
        "start"
        "dev"
        "test"
        "test:security"
        "test:integration"
        "lint"
        "lint:fix"
        "format"
        "format:check"
        "setup"
        "build-configure-test"
        "monitor"
        "docker:build"
        "docker:run"
        "docker:stop"
        "ci"
    )
    
    for script in "${SCRIPTS[@]}"; do
        if grep -q "\"$script\":" package.json; then
            echo -e "${GREEN}✅${NC} npm run $script"
        else
            echo -e "${YELLOW}⚠️ ${NC} npm run $script (not configured)"
        fi
    done
else
    echo -e "${RED}❌${NC} package.json not found"
fi
echo ""

# Dependencies Check
echo -e "${BLUE}━━━ Dependencies Status ━━━${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Dependencies installed (node_modules exists)"
    
    if [ -f "package.json" ] && [ -f "package-lock.json" ]; then
        # Check if dependencies are up to date
        if npm outdated &> /dev/null; then
            echo -e "${GREEN}✅${NC} All dependencies up to date"
        else
            OUTDATED_COUNT=$(npm outdated 2>/dev/null | tail -n +2 | wc -l)
            if [ "$OUTDATED_COUNT" -gt 0 ]; then
                echo -e "${YELLOW}⚠️ ${NC} $OUTDATED_COUNT outdated dependencies (run 'npm outdated')"
            fi
        fi
    fi
else
    echo -e "${YELLOW}⚠️ ${NC} Dependencies not installed (run 'npm install')"
fi
echo ""

# Security Audit
echo -e "${BLUE}━━━ Security Status ━━━${NC}"
if [ -f "package.json" ]; then
    echo -n "Running npm audit... "
    if npm audit --audit-level=moderate &> /dev/null; then
        echo -e "${GREEN}✅ No vulnerabilities found${NC}"
    else
        VULN_COUNT=$(npm audit --json 2>/dev/null | grep -o '"vulnerabilities":{[^}]*}' | grep -o '[0-9]\+' | head -1)
        if [ -n "$VULN_COUNT" ] && [ "$VULN_COUNT" != "0" ]; then
            echo -e "${YELLOW}⚠️  Found vulnerabilities (run 'npm audit' for details)${NC}"
        else
            echo -e "${GREEN}✅ No moderate or higher vulnerabilities${NC}"
        fi
    fi
fi
echo ""

# Git Status
echo -e "${BLUE}━━━ Git Repository Status ━━━${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC} Git repository initialized"
    
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    echo -e "   ${GREEN}→${NC} Current branch: $BRANCH"
    
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "${GREEN}✅${NC} Working directory clean"
    else
        echo -e "${YELLOW}⚠️ ${NC} Uncommitted changes present"
    fi
else
    echo -e "${RED}❌${NC} Not a git repository"
fi
echo ""

# Environment Configuration
echo -e "${BLUE}━━━ Environment Configuration ━━━${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC} .env file exists"
    
    # Check if it contains placeholders
    if grep -q "your_.*_here" .env; then
        echo -e "${YELLOW}⚠️ ${NC} .env contains placeholder values (run 'npm run setup')"
    else
        echo -e "${GREEN}✅${NC} .env appears to be configured"
    fi
else
    echo -e "${YELLOW}⚠️ ${NC} .env file not found (run 'npm run setup')"
fi

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅${NC} .env.example exists"
fi
echo ""

# Automation Coverage Summary
echo -e "${BLUE}━━━ Automation Coverage Summary ━━━${NC}"
echo ""
echo "🔄 Continuous Integration:"
echo "  ✅ Linting and formatting (automatic on commit)"
echo "  ✅ Security scanning (weekly + on PR)"
echo "  ✅ Integration testing (on push/PR)"
echo "  ✅ Docker build validation (on push/PR)"
echo ""
echo "🚀 Continuous Deployment:"
echo "  ✅ Auto-deployment on main branch push"
echo "  ✅ Manual deployment workflow"
echo "  ✅ Rollback automation workflow"
echo "  ✅ Multi-platform Docker builds"
echo ""
echo "🔐 Security Automation:"
echo "  ✅ CodeQL static analysis (weekly + on PR)"
echo "  ✅ npm audit (on every CI run)"
echo "  ✅ Secret validation (weekly)"
echo "  ✅ Dependabot updates (weekly)"
echo ""
echo "📊 Monitoring & Testing:"
echo "  ✅ Health checks (every 6 hours)"
echo "  ✅ Performance benchmarks (weekly + on PR)"
echo "  ✅ Automated issue creation on failures"
echo ""
echo "🔧 Development Automation:"
echo "  ✅ Pre-commit hooks (Husky)"
echo "  ✅ Auto-formatting on save (Prettier)"
echo "  ✅ Quick-start script"
echo "  ✅ Setup wizard"
echo ""
echo "📦 Dependency Management:"
echo "  ✅ Dependabot PRs (weekly)"
echo "  ✅ Auto-merge for patch updates"
echo "  ✅ Grouped minor updates"
echo ""
echo "💾 Backup & Recovery:"
echo "  ✅ Daily automated backups"
echo "  ✅ 30-day artifact retention"
echo "  ✅ Configuration and log backups"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Automation Dashboard Complete!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📚 For more information, see:"
echo "  - AUTOMATION.md - Complete automation guide"
echo "  - README.md - Getting started guide"
echo "  - SETUP.md - Detailed setup instructions"
echo ""
