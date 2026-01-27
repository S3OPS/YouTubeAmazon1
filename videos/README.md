# Example Video Configurations

This directory contains AI-generated videos and their configuration files.

## Directory Structure

```
videos/
├── example-tech-review.json        # Example config for tech gadgets video
├── example-home-office.json        # Example config for home office video
├── example-kitchen-gadgets.json    # Example config for kitchen gadgets video
├── your-video.mp4                  # Your AI-generated video
├── your-video.json                 # Configuration for your-video.mp4
└── processed/                      # Metadata for processed videos
    └── your-video-metadata.json    # Processing metadata
```

## Video File Naming

Video files should have a companion JSON configuration file with the same base name:
- `my-video.mp4` → `my-video.json`
- `product-review.mp4` → `product-review.json`

## Configuration File Format

```json
{
  "title": "Your Video Title",
  "description": "Video description text",
  "products": [
    {
      "name": "Product Name",
      "url": "B08XXXXX"
    }
  ],
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Supported Video Formats

- `.mp4` (recommended)
- `.mov`
- `.avi`
- `.mkv`
- `.webm`

## Usage

### Manual Upload

Place your video and config file in this directory, then trigger upload:

```bash
curl -X POST http://localhost:3000/api/automation/trigger
```

### Automatic Upload

With `AUTO_UPLOAD=true` in `.env`, videos are automatically processed based on your `UPLOAD_SCHEDULE`.

### Without Config File

If no JSON config exists, the system will:
- Use the filename as the title (formatted)
- Use a default description
- Upload without product links

## Tips

- Use clear, descriptive titles
- Include relevant keywords in tags
- Keep descriptions concise but informative
- Use actual Amazon ASINs for better tracking
- Test with one video before batch processing
