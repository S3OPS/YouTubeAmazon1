#!/bin/bash
# Setup script for video generation dependencies

set -e

echo "========================================="
echo "Video Generation Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    OS="unknown"
fi

echo "Detected OS: $OS"
echo ""

# Check and install FFmpeg
echo "Checking FFmpeg..."
if command_exists ffmpeg; then
    echo -e "${GREEN}✓ FFmpeg is already installed${NC}"
    ffmpeg -version | head -1
else
    echo -e "${YELLOW}⚠ FFmpeg is not installed${NC}"
    echo "Installing FFmpeg..."
    
    if [[ "$OS" == "linux" ]]; then
        if command_exists apt-get; then
            sudo apt-get update
            sudo apt-get install -y ffmpeg
        elif command_exists yum; then
            sudo yum install -y ffmpeg
        else
            echo -e "${RED}✗ Could not install FFmpeg automatically${NC}"
            echo "Please install FFmpeg manually: https://ffmpeg.org/download.html"
        fi
    elif [[ "$OS" == "mac" ]]; then
        if command_exists brew; then
            brew install ffmpeg
        else
            echo -e "${RED}✗ Homebrew not found${NC}"
            echo "Please install Homebrew first: https://brew.sh/"
            echo "Then run: brew install ffmpeg"
        fi
    else
        echo -e "${YELLOW}⚠ Please install FFmpeg manually${NC}"
        echo "Download from: https://ffmpeg.org/download.html"
    fi
fi
echo ""

# Check and install ImageMagick (optional)
echo "Checking ImageMagick (optional)..."
if command_exists convert; then
    echo -e "${GREEN}✓ ImageMagick is already installed${NC}"
    convert -version | head -1
else
    echo -e "${YELLOW}⚠ ImageMagick is not installed (optional)${NC}"
    echo "ImageMagick provides better text rendering. Install it for improved quality."
    
    if [[ "$OS" == "linux" ]]; then
        if command_exists apt-get; then
            echo "Install with: sudo apt-get install imagemagick"
        elif command_exists yum; then
            echo "Install with: sudo yum install ImageMagick"
        fi
    elif [[ "$OS" == "mac" ]]; then
        echo "Install with: brew install imagemagick"
    else
        echo "Download from: https://imagemagick.org/script/download.php"
    fi
fi
echo ""

# Check and install espeak (optional for text-to-speech)
echo "Checking espeak (optional for narration)..."
if command_exists espeak; then
    echo -e "${GREEN}✓ espeak is already installed${NC}"
else
    echo -e "${YELLOW}⚠ espeak is not installed (optional)${NC}"
    echo "espeak enables text-to-speech narration for videos."
    
    if [[ "$OS" == "linux" ]]; then
        if command_exists apt-get; then
            echo "Install with: sudo apt-get install espeak"
        elif command_exists yum; then
            echo "Install with: sudo yum install espeak"
        fi
    elif [[ "$OS" == "mac" ]]; then
        echo "Install with: brew install espeak"
    else
        echo "Download from: http://espeak.sourceforge.net/"
    fi
fi
echo ""

# Create necessary directories
echo "Creating directories..."
mkdir -p videos
mkdir -p videos/processed
mkdir -p temp
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Verify Node.js dependencies
echo "Checking Node.js dependencies..."
if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install
    fi
    echo -e "${GREEN}✓ Node.js dependencies ready${NC}"
else
    echo -e "${RED}✗ package.json not found${NC}"
fi
echo ""

# Summary
echo "========================================="
echo "Setup Summary"
echo "========================================="
echo ""

if command_exists ffmpeg; then
    echo -e "${GREEN}✓ FFmpeg: Installed${NC}"
else
    echo -e "${RED}✗ FFmpeg: Not installed${NC}"
fi

if command_exists convert; then
    echo -e "${GREEN}✓ ImageMagick: Installed${NC}"
else
    echo -e "${YELLOW}⚠ ImageMagick: Not installed (optional)${NC}"
fi

if command_exists espeak; then
    echo -e "${GREEN}✓ espeak: Installed${NC}"
else
    echo -e "${YELLOW}⚠ espeak: Not installed (optional)${NC}"
fi

echo ""
echo "========================================="
echo "Video Generation is ready!"
echo "========================================="
echo ""
echo "Usage:"
echo "  1. Create video configurations in the videos/ directory"
echo "  2. Generate videos: POST /api/videos/generate-from-configs"
echo "  3. Or use the API to generate individual videos"
echo ""
echo "Documentation: See VIDEO_GENERATION.md for details"
echo ""
