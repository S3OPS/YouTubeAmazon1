#!/bin/bash

# Build-Configure-Test Script with Retry Logic
# This script treats build as a life and death matter, then configures and tests
# If tests fail, the entire workflow is repeated

set -e  # Exit on error (will be handled in our retry logic)

echo "🔥 Build-Configure-Test Workflow"
echo "=================================="
echo "Build as though it was a life and death matter!"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES=3
CURRENT_ATTEMPT=1
SERVER_PORT="${PORT:-3000}"
PID_FILE="./server.pid"
SHUTDOWN_TIMEOUT=10

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

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to perform the build step (CRITICAL - life and death matter!)
build_step() {
    echo ""
    echo "=================================================="
    echo "🔨 STEP 1: BUILD (CRITICAL - Life and Death!)"
    echo "=================================================="
    echo ""
    
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "CRITICAL: Node.js is not installed!"
        return 1
    fi
    print_success "Node.js $(node --version) detected"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "CRITICAL: npm is not installed!"
        return 1
    fi
    print_success "npm $(npm --version) detected"
    
    # Clean install (CRITICAL - ensure clean state)
    print_status "Performing critical dependency installation..."
    if npm ci --prefer-offline --no-audit 2>/dev/null; then
        print_success "Dependencies installed successfully"
    else
        print_error "CRITICAL: Dependency installation failed!"
        print_error "npm ci failed. Please ensure package-lock.json is up to date."
        return 1
    fi
    
    # Verify critical files exist
    print_status "Verifying critical project files..."
    local required_files=("package.json" "server.js" "app.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "CRITICAL: Required file $file is missing!"
            return 1
        fi
    done
    print_success "All critical files verified"
    
    print_success "BUILD STEP COMPLETED SUCCESSFULLY!"
    return 0
}

# Function to perform the configure step
configure_step() {
    echo ""
    echo "=================================================="
    echo "⚙️  STEP 2: CONFIGURE"
    echo "=================================================="
    echo ""
    
    print_status "Configuring environment..."
    
    # Check if .env exists, create from setup wizard or example if not
    if [ ! -f .env ]; then
        print_warning ".env file not found"
        if [ -f "setup.js" ]; then
            print_status "Running setup wizard..."
            if node setup.js; then
                print_success "Setup wizard completed"
            else
                print_error "Setup wizard failed"
                return 1
            fi
        elif [ -f .env.example ]; then
            print_status "Creating .env from .env.example..."
            cp .env.example .env
            print_success ".env file created (please update with your credentials)"
        else
            print_warning "No .env.example found, skipping .env creation"
        fi
    else
        print_success ".env file already exists"
    fi

    if [ ! -f .env ]; then
        print_error ".env file is required for configuration"
        return 1
    fi
    
    # Validate configuration files
    print_status "Validating configuration..."
    if [ -f "eslint.config.js" ]; then
        print_success "ESLint configuration found"
    fi
    
    if [ -f ".prettierrc" ]; then
        print_success "Prettier configuration found"
    fi
    
    print_success "CONFIGURATION STEP COMPLETED!"
    return 0
}

# Function to perform the test step
test_step() {
    echo ""
    echo "=================================================="
    echo "🧪 STEP 3: TEST"
    echo "=================================================="
    echo ""
    
    print_status "Running all tests..."
    
    # Run security tests
    print_status "Running security tests..."
    if npm run test:security; then
        print_success "Security tests passed"
    else
        print_error "Security tests failed!"
        return 1
    fi
    
    # Run integration tests (requires server)
    print_status "Starting server for integration tests..."
    if command -v lsof &> /dev/null; then
        for pid in $(lsof -ti tcp:"$SERVER_PORT" 2>/dev/null); do
            if [ -n "$pid" ]; then
                print_warning "Port $SERVER_PORT in use (PID $pid). Stopping existing process..."
                kill "$pid" 2>/dev/null || true
                local wait_count=0
                while kill -0 "$pid" 2>/dev/null && [ $wait_count -lt $SHUTDOWN_TIMEOUT ]; do
                    sleep 1
                    wait_count=$((wait_count + 1))
                done
                if kill -0 "$pid" 2>/dev/null; then
                    print_warning "Process $pid did not stop gracefully, forcing shutdown..."
                    kill -9 "$pid" 2>/dev/null || true
                fi
            fi
        done
    fi
    npm start &
    SERVER_PID=$!
    echo $SERVER_PID > "$PID_FILE"
    print_status "Server started with PID $SERVER_PID"
    
    # Wait for server to be ready
    print_status "Waiting for server to be ready..."
    local max_wait=30
    local waited=0
    while [ $waited -lt $max_wait ]; do
        if curl -s "http://localhost:${SERVER_PORT}/api/health" > /dev/null 2>&1; then
            print_success "Server is ready!"
            break
        fi
        sleep 2
        waited=$((waited + 2))
        if [ $waited -ge $max_wait ]; then
            print_error "Server failed to start within ${max_wait} seconds"
            if [ -f "$PID_FILE" ]; then
                local pid=$(cat "$PID_FILE" 2>/dev/null)
                if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                    kill "$pid" 2>/dev/null || true
                fi
                rm -f "$PID_FILE"
            fi
            return 1
        fi
    done
    
    # Run integration tests
    print_status "Running integration tests..."
    local test_result=0
    if npm run test:integration; then
        print_success "Integration tests passed"
    else
        print_error "Integration tests failed!"
        test_result=1
    fi

    # Stop the server
    print_status "Stopping server..."
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE" 2>/dev/null)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            local wait_count=0
            while kill -0 "$pid" 2>/dev/null && [ $wait_count -lt $SHUTDOWN_TIMEOUT ]; do
                sleep 1
                wait_count=$((wait_count + 1))
            done
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Server did not stop gracefully, forcing shutdown..."
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        rm -f "$PID_FILE"
    fi
    print_success "Server stopped"
    
    if [ $test_result -ne 0 ]; then
        return 1
    fi
    
    print_success "ALL TESTS PASSED!"
    return 0
}

# Function to perform the code quality step
quality_step() {
    echo ""
    echo "=================================================="
    echo "✅ STEP 4: CODE QUALITY"
    echo "=================================================="
    echo ""

    print_status "Running ESLint..."
    if npm run lint; then
        print_success "Lint checks passed"
    else
        print_error "Lint checks failed!"
        return 1
    fi

    print_status "Checking formatting..."
    if npm run format:check; then
        print_success "Formatting checks passed"
    else
        print_error "Formatting checks failed!"
        return 1
    fi

    print_success "CODE QUALITY CHECKS PASSED!"
    return 0
}

# Main workflow function
run_workflow() {
    local attempt=$1
    
    echo ""
    echo "=================================================="
    echo "🔄 WORKFLOW ATTEMPT $attempt of $MAX_RETRIES"
    echo "=================================================="
    
    # Step 1: Build (CRITICAL)
    if ! build_step; then
        print_error "Build step failed on attempt $attempt"
        return 1
    fi
    
    # Step 2: Configure
    if ! configure_step; then
        print_error "Configure step failed on attempt $attempt"
        return 1
    fi
    
    # Step 3: Test
    if ! test_step; then
        print_error "Test step failed on attempt $attempt"
        return 1
    fi

    # Step 4: Code Quality
    if ! quality_step; then
        print_error "Code quality step failed on attempt $attempt"
        return 1
    fi

    return 0
}

# Main execution with retry logic
main() {
    echo "Starting Build-Configure-Test workflow..."
    echo "Maximum retry attempts: $MAX_RETRIES"
    echo ""
    
    # Cleanup any leftover server processes
    if [ -f "$PID_FILE" ]; then
        print_status "Cleaning up previous server instance..."
        local pid=$(cat "$PID_FILE" 2>/dev/null)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
        rm -f "$PID_FILE"
    fi
    
    while [ $CURRENT_ATTEMPT -le $MAX_RETRIES ]; do
        if run_workflow $CURRENT_ATTEMPT; then
            # Success!
            echo ""
            echo "=================================================="
            echo "✅ SUCCESS - All steps completed!"
            echo "=================================================="
            echo ""
            echo "Build-Configure-Test workflow completed successfully on attempt $CURRENT_ATTEMPT"
            echo ""
            exit 0
        else
            # Failure - check if we should retry
            # Clean up any server that might be running
            if [ -f "$PID_FILE" ]; then
                local pid=$(cat "$PID_FILE" 2>/dev/null)
                if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                    kill "$pid" 2>/dev/null || true
                fi
                rm -f "$PID_FILE"
            fi
            
            if [ $CURRENT_ATTEMPT -lt $MAX_RETRIES ]; then
                print_warning "Workflow failed on attempt $CURRENT_ATTEMPT"
                echo ""
                echo "=================================================="
                echo "🔄 REPEATING WORKFLOW (as per requirements)"
                echo "=================================================="
                CURRENT_ATTEMPT=$((CURRENT_ATTEMPT + 1))
                sleep 2  # Brief pause before retry
            else
                # Max retries reached
                echo ""
                echo "=================================================="
                echo "❌ FAILURE - Maximum retries reached"
                echo "=================================================="
                echo ""
                print_error "Workflow failed after $MAX_RETRIES attempts"
                echo ""
                exit 1
            fi
        fi
    done
}

# Run the main function
main
