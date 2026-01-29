// Video Generation Module
// Automatically generates videos from product configurations using free tools

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const logger = require('./logger');

const execAsync = promisify(exec);

class VideoGenerator {
    constructor() {
        this.videoDirectory = process.env.VIDEO_DIRECTORY || './videos';
        this.tempDirectory = process.env.TEMP_DIRECTORY || './temp';
        this.videoWidth = parseInt(process.env.VIDEO_WIDTH || '1920', 10);
        this.videoHeight = parseInt(process.env.VIDEO_HEIGHT || '1080', 10);
        this.fps = parseInt(process.env.VIDEO_FPS || '30', 10);
        this.slideDuration = parseInt(process.env.SLIDE_DURATION || '3', 10); // seconds per slide
    }

    /**
     * Initialize video generator
     */
    async initialize() {
        try {
            // Create directories if they don't exist
            await fs.mkdir(this.videoDirectory, { recursive: true });
            await fs.mkdir(this.tempDirectory, { recursive: true });

            // Check if FFmpeg is installed
            await this.checkFFmpeg();

            logger.info('Video generator initialized', {
                videoDirectory: this.videoDirectory,
                tempDirectory: this.tempDirectory,
            });
        } catch (error) {
            logger.error('Failed to initialize video generator', {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Check if FFmpeg is installed
     */
    async checkFFmpeg() {
        try {
            await execAsync('ffmpeg -version');
            logger.info('FFmpeg is available');
            return true;
        } catch (error) {
            logger.warn('FFmpeg is not installed. Video generation will use fallback method.');
            return false;
        }
    }

    /**
     * Generate video from configuration
     * @param {Object} config - Video configuration
     * @param {string} config.title - Video title
     * @param {string} config.description - Video description
     * @param {Array<Object>} config.products - Products to feature
     * @param {Array<string>} config.tags - Video tags
     * @returns {Promise<string>} Path to generated video file
     */
    async generateVideo(config) {
        try {
            const { title, description, products = [], tags = [] } = config;

            logger.info('Starting video generation', { title, productCount: products.length });

            // Generate unique filename
            const timestamp = Date.now();
            const safeTitle = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .substring(0, 50);
            const videoFileName = `${safeTitle}-${timestamp}.mp4`;
            const videoPath = path.join(this.videoDirectory, videoFileName);

            // Generate video using available method
            const ffmpegAvailable = await this.checkFFmpeg();
            
            if (ffmpegAvailable) {
                await this.generateWithFFmpeg(config, videoPath);
            } else {
                await this.generatePlaceholder(config, videoPath);
            }

            // Create companion JSON configuration file
            const jsonPath = path.join(
                this.videoDirectory,
                `${path.basename(videoPath, '.mp4')}.json`
            );
            await fs.writeFile(jsonPath, JSON.stringify(config, null, 2));

            logger.info('Video generated successfully', {
                title,
                videoPath,
                jsonPath,
            });

            return videoPath;
        } catch (error) {
            logger.error('Failed to generate video', {
                error: error.message,
                title: config.title,
            });
            throw error;
        }
    }

    /**
     * Generate video using FFmpeg
     * @param {Object} config - Video configuration
     * @param {string} outputPath - Output video path
     */
    async generateWithFFmpeg(config, outputPath) {
        try {
            const { title, products = [] } = config;

            // Create slides for intro, products, and outro
            const slides = [];

            // Intro slide
            slides.push({
                text: title,
                duration: 3,
            });

            // Product slides
            products.forEach((product, index) => {
                slides.push({
                    text: `${index + 1}. ${product.name}`,
                    duration: this.slideDuration,
                });
            });

            // Outro slide
            slides.push({
                text: 'Check the description for links!',
                duration: 3,
            });

            // Generate image slides
            const imageFiles = [];
            for (let i = 0; i < slides.length; i++) {
                const imagePath = await this.generateSlideImage(slides[i], i);
                imageFiles.push(imagePath);
            }

            // Create video from images using FFmpeg
            await this.createVideoFromImages(imageFiles, slides, outputPath);

            // Clean up temporary images
            for (const imagePath of imageFiles) {
                await fs.unlink(imagePath).catch(() => {});
            }

            logger.info('Video generated with FFmpeg', { outputPath });
        } catch (error) {
            logger.error('Failed to generate video with FFmpeg', {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Generate a slide image
     * @param {Object} slide - Slide configuration
     * @param {number} index - Slide index
     * @returns {Promise<string>} Path to generated image
     */
    async generateSlideImage(slide, index) {
        const imagePath = path.join(this.tempDirectory, `slide-${index}.png`);

        // Generate image using ImageMagick or fallback to FFmpeg
        try {
            // Try ImageMagick first
            const text = this.wrapText(slide.text, 40);
            const command = `convert -size ${this.videoWidth}x${this.videoHeight} xc:black \
                -font Arial -pointsize 72 -fill white \
                -gravity center -annotate +0+0 "${text}" \
                "${imagePath}"`;
            
            await execAsync(command);
        } catch (error) {
            // Fallback to FFmpeg drawtext filter
            const command = `ffmpeg -f lavfi -i color=c=black:s=${this.videoWidth}x${this.videoHeight}:d=1 \
                -vf "drawtext=text='${slide.text}':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=(h-text_h)/2" \
                -frames:v 1 "${imagePath}" -y`;
            
            await execAsync(command);
        }

        return imagePath;
    }

    /**
     * Create video from images
     * @param {Array<string>} imageFiles - Array of image paths
     * @param {Array<Object>} slides - Slide configurations
     * @param {string} outputPath - Output video path
     */
    async createVideoFromImages(imageFiles, slides, outputPath) {
        // Create concat file for FFmpeg
        const concatFilePath = path.join(this.tempDirectory, 'concat.txt');
        let concatContent = '';

        for (let i = 0; i < imageFiles.length; i++) {
            concatContent += `file '${path.resolve(imageFiles[i])}'\n`;
            concatContent += `duration ${slides[i].duration}\n`;
        }
        // Add last image again for proper duration
        if (imageFiles.length > 0) {
            concatContent += `file '${path.resolve(imageFiles[imageFiles.length - 1])}'\n`;
        }

        await fs.writeFile(concatFilePath, concatContent);

        // Generate video
        const command = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" \
            -vf "fps=${this.fps},format=yuv420p" \
            -c:v libx264 -preset fast \
            "${outputPath}" -y`;

        await execAsync(command);

        // Clean up concat file
        await fs.unlink(concatFilePath).catch(() => {});
    }

    /**
     * Generate placeholder video (when FFmpeg is not available)
     * @param {Object} config - Video configuration
     * @param {string} outputPath - Output video path
     */
    async generatePlaceholder(config, outputPath) {
        const { title } = config;

        // Create a simple text file as a placeholder
        const placeholderText = `
Video Placeholder: ${title}
========================================

This is a placeholder for the video that would be generated.

To enable automatic video generation, install:
- FFmpeg: sudo apt-get install ffmpeg
- ImageMagick (optional): sudo apt-get install imagemagick

Products:
${config.products.map((p, i) => `${i + 1}. ${p.name} (${p.url})`).join('\n')}

Description:
${config.description}

Tags: ${config.tags ? config.tags.join(', ') : 'N/A'}
`;

        // Create a minimal valid MP4 file using FFmpeg (if available) or create a marker file
        try {
            // Try to create a minimal black video
            const command = `ffmpeg -f lavfi -i color=c=black:s=${this.videoWidth}x${this.videoHeight}:d=5 \
                -c:v libx264 -preset ultrafast "${outputPath}" -y 2>/dev/null`;
            await execAsync(command);
        } catch {
            // If FFmpeg is not available, create a text placeholder
            await fs.writeFile(outputPath + '.txt', placeholderText);
            logger.warn('Created text placeholder instead of video', {
                path: outputPath + '.txt',
            });
        }

        logger.info('Generated placeholder video', { outputPath });
    }

    /**
     * Wrap text to specified width
     * @param {string} text - Text to wrap
     * @param {number} width - Maximum line width
     * @returns {string} Wrapped text
     */
    wrapText(text, width) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length <= width) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);

        return lines.join('\\n');
    }

    /**
     * Generate videos from all JSON configurations in the videos directory
     * @returns {Promise<Array<string>>} Array of generated video paths
     */
    async generateFromConfigs() {
        try {
            const files = await fs.readdir(this.videoDirectory);
            const jsonFiles = files.filter((file) => path.extname(file) === '.json');

            const generatedVideos = [];

            for (const jsonFile of jsonFiles) {
                const jsonPath = path.join(this.videoDirectory, jsonFile);
                const configData = await fs.readFile(jsonPath, 'utf8');
                const config = JSON.parse(configData);

                // Check if video already exists
                const videoBaseName = path.basename(jsonFile, '.json');
                const possibleVideoFiles = files.filter(
                    (file) =>
                        path.extname(file) === '.mp4' &&
                        path.basename(file, '.mp4').startsWith(videoBaseName)
                );

                if (possibleVideoFiles.length === 0) {
                    // Generate video
                    const videoPath = await this.generateVideo(config);
                    generatedVideos.push(videoPath);
                } else {
                    logger.info('Video already exists for config', {
                        jsonFile,
                        videoFile: possibleVideoFiles[0],
                    });
                }
            }

            logger.info('Generated videos from configs', {
                count: generatedVideos.length,
            });

            return generatedVideos;
        } catch (error) {
            logger.error('Failed to generate videos from configs', {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Generate video with synthetic voice narration
     * @param {Object} config - Video configuration
     * @param {string} script - Narration script
     * @returns {Promise<string>} Path to generated video with audio
     */
    async generateWithNarration(config, script) {
        try {
            // First generate the base video
            const videoPath = await this.generateVideo(config);

            // Generate audio using text-to-speech (requires espeak or festival)
            const audioPath = path.join(this.tempDirectory, `narration-${Date.now()}.wav`);

            try {
                // Try using espeak for text-to-speech
                await execAsync(
                    `espeak "${script}" -w "${audioPath}" 2>/dev/null || \
                     echo "${script}" | festival --tts -o "${audioPath}" 2>/dev/null`
                );

                // Combine video with audio
                const outputPath = videoPath.replace('.mp4', '-narrated.mp4');
                await execAsync(
                    `ffmpeg -i "${videoPath}" -i "${audioPath}" \
                     -c:v copy -c:a aac -strict experimental \
                     "${outputPath}" -y`
                );

                // Clean up
                await fs.unlink(audioPath).catch(() => {});
                await fs.unlink(videoPath).catch(() => {});

                return outputPath;
            } catch (error) {
                logger.warn('Could not add narration to video', {
                    error: error.message,
                });
                return videoPath;
            }
        } catch (error) {
            logger.error('Failed to generate video with narration', {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Clean up temporary files
     */
    async cleanup() {
        try {
            const files = await fs.readdir(this.tempDirectory);
            for (const file of files) {
                const filePath = path.join(this.tempDirectory, file);
                await fs.unlink(filePath);
            }
            logger.info('Cleaned up temporary files');
        } catch (error) {
            logger.error('Failed to cleanup temporary files', {
                error: error.message,
            });
        }
    }
}

// Export singleton instance
module.exports = new VideoGenerator();
