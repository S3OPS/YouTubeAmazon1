# Video Generation System

## Overview

The Video Generation System automatically creates videos from product configurations using free, open-source tools. This eliminates the need to manually create or obtain AI-generated videos, making the entire workflow 100% automated from video creation to YouTube upload.

## 🎬 Features

### Core Capabilities
- ✅ **Automatic Video Generation**: Create videos from JSON configurations
- ✅ **Product Slide Generation**: Automatically generate slides for each product
- ✅ **Text-to-Speech Narration** (optional): Add voice narration to videos
- ✅ **Customizable Templates**: Configure video dimensions, duration, and styling
- ✅ **Batch Processing**: Generate multiple videos from all JSON configs
- ✅ **Integration**: Seamlessly integrates with existing YouTube automation

### Free Tools Used
- **FFmpeg**: Video composition and encoding (required)
- **ImageMagick**: High-quality text rendering (optional)
- **espeak/Festival**: Text-to-speech narration (optional)

## 🚀 Quick Start

### 1. Installation

Run the setup script to install dependencies:

```bash
bash setup-video-generation.sh
```

This will:
- Check for and install FFmpeg (required)
- Check for ImageMagick (optional, improves quality)
- Check for espeak (optional, enables narration)
- Create necessary directories

### Manual Installation

If automatic setup doesn't work, install manually:

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg imagemagick espeak
```

**macOS:**
```bash
brew install ffmpeg imagemagick espeak
```

**Windows:**
- Download FFmpeg from: https://ffmpeg.org/download.html
- Download ImageMagick from: https://imagemagick.org/script/download.php
- Download espeak from: http://espeak.sourceforge.net/

### 2. Configure Environment

Update `.env` file with video generation settings:

```env
# Video Generation Settings
TEMP_DIRECTORY=./temp
VIDEO_WIDTH=1920
VIDEO_HEIGHT=1080
VIDEO_FPS=30
SLIDE_DURATION=3
```

### 3. Create Product Configurations

Create JSON files in the `videos/` directory:

```json
{
  "title": "Amazing Tech Gadgets 2024",
  "description": "Check out these incredible products!",
  "products": [
    {
      "name": "Wireless Earbuds with ANC",
      "url": "B08C4KWM9T"
    },
    {
      "name": "Smart Watch Pro",
      "url": "B0B8KJF123"
    }
  ],
  "tags": ["tech", "gadgets", "review"]
}
```

### 4. Generate Videos

#### Using API:

**Generate from all JSON configs:**
```bash
curl -X POST http://localhost:3000/api/videos/generate-from-configs
```

**Generate single video:**
```bash
curl -X POST http://localhost:3000/api/videos/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Product Review",
    "description": "Amazing products!",
    "products": [
      {"name": "Product 1", "url": "B08XXXXX"}
    ],
    "tags": ["review", "tech"]
  }'
```

**Generate with narration:**
```bash
curl -X POST http://localhost:3000/api/videos/generate-with-narration \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Product Review",
    "script": "Welcome to my review! Today I will show you amazing products.",
    "products": [
      {"name": "Product 1", "url": "B08XXXXX"}
    ]
  }'
```

#### Using Node.js:

```javascript
const videoGenerator = require('./video-generator');

// Initialize
await videoGenerator.initialize();

// Generate from config
const videoPath = await videoGenerator.generateVideo({
  title: "My Video",
  description: "Description here",
  products: [
    { name: "Product", url: "B08XXXXX" }
  ],
  tags: ["tag1", "tag2"]
});

// Generate from all JSON files
const videos = await videoGenerator.generateFromConfigs();
```

## 📖 How It Works

### Video Generation Process

1. **Input**: JSON configuration with title, products, and metadata
2. **Slide Creation**: 
   - Intro slide with video title
   - One slide per product with product name
   - Outro slide with call-to-action
3. **Image Generation**: Creates PNG images for each slide with text
4. **Video Composition**: Uses FFmpeg to combine slides into video
5. **Output**: MP4 video file + companion JSON config

### Video Structure

```
Intro Slide (3 seconds)
  ↓
Product 1 Slide (3 seconds)
  ↓
Product 2 Slide (3 seconds)
  ↓
...
  ↓
Outro Slide (3 seconds)
```

### File Generation

For a video titled "Tech Review", the system creates:
- `tech-review-1234567890.mp4` - The video file
- `tech-review-1234567890.json` - Configuration file

## 🔧 Configuration

### Environment Variables

```env
# Video dimensions
VIDEO_WIDTH=1920          # Width in pixels (default: 1920)
VIDEO_HEIGHT=1080         # Height in pixels (default: 1080)

# Video settings
VIDEO_FPS=30              # Frames per second (default: 30)
SLIDE_DURATION=3          # Seconds per slide (default: 3)

# Directories
TEMP_DIRECTORY=./temp     # Temporary files directory
VIDEO_DIRECTORY=./videos  # Output video directory
```

### Video Quality Presets

**High Quality (1080p):**
```env
VIDEO_WIDTH=1920
VIDEO_HEIGHT=1080
VIDEO_FPS=30
```

**Standard Quality (720p):**
```env
VIDEO_WIDTH=1280
VIDEO_HEIGHT=720
VIDEO_FPS=30
```

**YouTube Shorts (Vertical):**
```env
VIDEO_WIDTH=1080
VIDEO_HEIGHT=1920
VIDEO_FPS=30
```

**Fast Generation (Lower Quality):**
```env
VIDEO_WIDTH=1280
VIDEO_HEIGHT=720
VIDEO_FPS=24
SLIDE_DURATION=2
```

## 📡 API Reference

### POST `/api/videos/generate`

Generate a single video from configuration.

**Request Body:**
```json
{
  "title": "Video Title",
  "description": "Video description",
  "products": [
    {"name": "Product Name", "url": "ASIN"}
  ],
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "success": true,
  "videoPath": "./videos/video-title-123456.mp4",
  "message": "Video generated successfully"
}
```

### POST `/api/videos/generate-from-configs`

Generate videos from all JSON files in videos directory.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "videos": [
    "./videos/video1.mp4",
    "./videos/video2.mp4",
    "./videos/video3.mp4"
  ],
  "message": "Generated 3 video(s) successfully"
}
```

### POST `/api/videos/generate-with-narration`

Generate video with text-to-speech narration.

**Request Body:**
```json
{
  "title": "Video Title",
  "script": "Welcome to my video. Today I will show you...",
  "description": "Description",
  "products": [...],
  "tags": [...]
}
```

**Response:**
```json
{
  "success": true,
  "videoPath": "./videos/video-title-narrated.mp4",
  "message": "Video with narration generated successfully"
}
```

## 🔄 Integration with Automation

### Automatic Video Generation + Upload

The video generator integrates seamlessly with the existing automation system:

1. **Create JSON configs** in videos/ directory
2. **Generate videos**: `POST /api/videos/generate-from-configs`
3. **Automatic processing**: Videos are picked up by automation scheduler
4. **Upload to YouTube**: Videos are automatically uploaded per schedule

### Complete Workflow Example

```bash
# 1. Create product configs (do this once)
cat > videos/example-product.json << 'EOF'
{
  "title": "Top 5 Products You Need",
  "description": "Amazing products for you!",
  "products": [
    {"name": "Product 1", "url": "B08XXXXX"},
    {"name": "Product 2", "url": "B08YYYYY"}
  ],
  "tags": ["review", "products"]
}
EOF

# 2. Generate videos
curl -X POST http://localhost:3000/api/videos/generate-from-configs

# 3. Trigger automation (or wait for scheduled upload)
curl -X POST http://localhost:3000/api/automation/trigger
```

## 🎨 Customization

### Custom Slide Templates

To customize the appearance of slides, modify the `generateSlideImage()` method in `video-generator.js`:

```javascript
// Example: Change colors and font size
const command = `convert -size ${this.videoWidth}x${this.videoHeight} xc:#1a1a1a \
    -font Arial-Bold -pointsize 96 -fill #ffffff \
    -gravity center -annotate +0+0 "${text}" \
    "${imagePath}"`;
```

### Custom Video Duration

Adjust slide duration per video:

```javascript
const slides = [
  { text: "Intro", duration: 5 },        // 5 seconds
  { text: "Product 1", duration: 4 },    // 4 seconds
  { text: "Product 2", duration: 4 },
  { text: "Outro", duration: 3 }
];
```

### Adding Background Music

To add background music to generated videos:

```bash
ffmpeg -i video.mp4 -i music.mp3 -c copy -map 0:v:0 -map 1:a:0 -shortest output.mp4
```

## 🐛 Troubleshooting

### FFmpeg Not Found

**Error:** `FFmpeg is not installed`

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Low Quality Text

**Problem:** Text appears blurry or pixelated

**Solution:** Install ImageMagick for better text rendering:
```bash
sudo apt-get install imagemagick  # Ubuntu/Debian
brew install imagemagick          # macOS
```

### Video Generation Slow

**Solutions:**
1. Reduce video dimensions: Set `VIDEO_WIDTH=1280` and `VIDEO_HEIGHT=720`
2. Lower FPS: Set `VIDEO_FPS=24`
3. Reduce slide duration: Set `SLIDE_DURATION=2`
4. Use FFmpeg hardware acceleration (if available)

### Narration Not Working

**Problem:** Text-to-speech narration fails

**Solution:** Install espeak:
```bash
sudo apt-get install espeak  # Ubuntu/Debian
brew install espeak          # macOS
```

### Permission Denied

**Error:** `EACCES: permission denied`

**Solution:**
```bash
chmod +x setup-video-generation.sh
chmod -R 755 videos/
chmod -R 755 temp/
```

## 📊 Performance

### Generation Speed

Approximate generation time per video:
- **Simple slides** (text only): 5-10 seconds
- **With ImageMagick**: 10-15 seconds
- **With narration**: 15-30 seconds

Factors affecting speed:
- Video resolution
- Number of slides
- CPU performance
- Storage speed

### Optimization Tips

1. **Batch Generation**: Generate multiple videos at once
2. **Async Processing**: Run generation in background
3. **Cache Slides**: Reuse common slides across videos
4. **Hardware Acceleration**: Use GPU encoding if available

## 🔐 Security

### Best Practices

- ✅ Validate input configurations
- ✅ Sanitize filenames and paths
- ✅ Limit video dimensions and duration
- ✅ Clean up temporary files after generation
- ✅ Rate limit video generation API endpoints

### Resource Limits

Set reasonable limits in production:

```javascript
// Max video dimensions
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

// Max slides per video
const MAX_SLIDES = 20;

// Max generation time
const GENERATION_TIMEOUT = 60000; // 60 seconds
```

## 📚 Examples

### Example 1: Product Review Video

```json
{
  "title": "Top 5 Gaming Accessories 2024",
  "description": "Best gaming gear for serious gamers",
  "products": [
    {"name": "Gaming Mouse RGB", "url": "B08XXXXX"},
    {"name": "Mechanical Keyboard", "url": "B08YYYYY"},
    {"name": "Gaming Headset 7.1", "url": "B08ZZZZZ"},
    {"name": "Mouse Pad XXL", "url": "B08AAAAA"},
    {"name": "Webcam 4K", "url": "B08BBBBB"}
  ],
  "tags": ["gaming", "accessories", "review", "tech"]
}
```

### Example 2: Home Products

```json
{
  "title": "Must-Have Kitchen Gadgets",
  "description": "Revolutionary kitchen tools",
  "products": [
    {"name": "Air Fryer XL", "url": "B08XXXXX"},
    {"name": "Instant Pot Duo", "url": "B08YYYYY"},
    {"name": "Electric Kettle", "url": "B08ZZZZZ"}
  ],
  "tags": ["kitchen", "gadgets", "home", "cooking"]
}
```

### Example 3: With Narration

```javascript
await videoGenerator.generateWithNarration({
  title: "Best Budget Smartphones 2024",
  description: "Affordable phones that don't compromise",
  products: [
    {"name": "Phone A", "url": "B08XXXXX"},
    {"name": "Phone B", "url": "B08YYYYY"}
  ],
  tags: ["smartphone", "budget", "tech"]
}, "Welcome to my smartphone review. Today I'll show you the best budget phones of 2024.");
```

## 🚀 Advanced Usage

### Scheduled Video Generation

Integrate with automation scheduler:

```javascript
// In automation-scheduler.js
async function generateAndUpload() {
  // Generate videos
  await videoGenerator.generateFromConfigs();
  
  // Upload to YouTube
  await this.triggerNow();
}
```

### Custom Video Pipeline

Create custom video generation pipeline:

```javascript
const videoGenerator = require('./video-generator');

async function customPipeline() {
  // 1. Generate videos
  const videos = await videoGenerator.generateFromConfigs();
  
  // 2. Process with affiliate links
  for (const videoPath of videos) {
    await videoProcessor.processVideo({...});
  }
  
  // 3. Upload to YouTube
  for (const video of processedVideos) {
    await youtubeApi.uploadVideo({...});
  }
}
```

## 📈 Future Enhancements

Potential improvements:
- [ ] Support for images/video clips in slides
- [ ] Background music integration
- [ ] Advanced text animations
- [ ] Multiple language support
- [ ] Custom fonts and themes
- [ ] Video templates library
- [ ] AI-generated voiceovers
- [ ] Dynamic product images from Amazon
- [ ] Video effects and transitions

## 🤝 Contributing

To improve the video generation system:

1. Test with different configurations
2. Report bugs and issues
3. Suggest new features
4. Improve documentation
5. Add new templates

## 📄 License

Part of YouTube Amazon Affiliate Automation System. See main LICENSE file.

---

**Built for 100% Automated Video Generation & YouTube Marketing** 🎬💰
