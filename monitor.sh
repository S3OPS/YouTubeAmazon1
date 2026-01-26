#!/bin/bash

# Automated Monitoring Script
# Continuously monitors the application health and performance

set -e

# Configuration
HEALTH_ENDPOINT="http://localhost:3000/api/health"
PRODUCTS_ENDPOINT="http://localhost:3000/api/products"
CHECK_INTERVAL=60  # seconds
LOG_FILE="monitoring.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check health
check_health() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_ENDPOINT" 2>/dev/null)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓${NC}"
        log "Health check: OK"
        return 0
    else
        echo -e "${RED}✗${NC}"
        log "Health check: FAILED (HTTP $response)"
        return 1
    fi
}

# Function to check response time
check_response_time() {
    local start=$(date +%s%N)
    curl -s "$HEALTH_ENDPOINT" > /dev/null 2>&1
    local end=$(date +%s%N)
    local duration=$(( (end - start) / 1000000 ))
    
    if [ $duration -lt 100 ]; then
        echo -e "${GREEN}${duration}ms${NC}"
    elif [ $duration -lt 500 ]; then
        echo -e "${YELLOW}${duration}ms${NC}"
    else
        echo -e "${RED}${duration}ms${NC}"
    fi
    
    log "Response time: ${duration}ms"
}

# Function to check API
check_api() {
    local response=$(curl -s "$PRODUCTS_ENDPOINT" 2>/dev/null)
    if echo "$response" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
        log "Products API: OK"
        return 0
    else
        echo -e "${RED}✗${NC}"
        log "Products API: FAILED"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    local pid=$(pgrep -f "node.*server.js" | head -n1)
    if [ -n "$pid" ]; then
        local mem=$(ps -o rss= -p "$pid" 2>/dev/null || echo "0")
        local mem_mb=$((mem / 1024))
        
        if [ $mem_mb -lt 300 ]; then
            echo -e "${GREEN}${mem_mb}MB${NC}"
        elif [ $mem_mb -lt 500 ]; then
            echo -e "${YELLOW}${mem_mb}MB${NC}"
        else
            echo -e "${RED}${mem_mb}MB${NC}"
        fi
        
        log "Memory usage: ${mem_mb}MB"
    else
        echo -e "${RED}N/A${NC}"
        log "Server process not found"
    fi
}

# Main monitoring loop
echo "🔍 Starting Automated Monitoring"
echo "================================"
echo "Monitoring interval: ${CHECK_INTERVAL} seconds"
echo "Log file: $LOG_FILE"
echo ""
echo "Press Ctrl+C to stop"
echo ""

log "Monitoring started"

while true; do
    clear
    echo "🔍 Application Health Monitor"
    echo "=============================="
    echo ""
    echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    printf "Health Endpoint:  "
    check_health
    
    printf "Response Time:    "
    check_response_time
    
    printf "Products API:     "
    check_api
    
    printf "Memory Usage:     "
    check_memory
    
    echo ""
    echo "Next check in ${CHECK_INTERVAL} seconds..."
    echo "(Press Ctrl+C to stop)"
    
    sleep "$CHECK_INTERVAL"
done
