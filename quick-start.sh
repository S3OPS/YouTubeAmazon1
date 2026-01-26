#!/bin/bash

# Automated Quick Start Script
# This script automates the entire setup and deployment process

set -e  # Exit on error

echo "🚀 Printify Dropshipping Store - Automated Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi
print_success "Node.js $(node --version) detected"

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi
print_success "npm $(npm --version) detected"

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Run setup wizard
print_status "Running setup wizard..."
npm run setup
print_success "Setup completed"

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not created. Please run setup manually: npm run setup"
    exit 1
fi

# Run tests
print_status "Running tests..."
if npm test; then
    print_success "All tests passed"
else
    print_error "Tests failed. Please fix the issues before continuing."
    exit 1
fi

# Run linter
print_status "Running code quality checks..."
if npm run lint; then
    print_success "Code quality checks passed"
else
    print_error "Linting failed. Attempting auto-fix..."
    npm run lint:fix
    print_success "Auto-fix completed"
fi

# Start the server
echo ""
echo "=================================================="
echo "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "Then visit http://localhost:3000 in your browser"
echo ""
echo "For deployment options, see SETUP.md"
echo "For automation details, see AUTOMATION.md"
echo ""
