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
     * Sanitize text input to prevent command injection
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeText(text) {
        if (typeof text !== 'string') {
            return '';
        }
        // Remove or escape shell special characters
        // Allow alphanumeric, spaces, and basic punctuation
        return text.replace(/[`$\\!"]/g, '\\$&').substring(0, 500);
    }

    /**
     * Validate and sanitize file path to prevent path traversal
     * @param {string} filePath - File path to validate
     * @param {string} baseDir - Base directory that file must be within
     * @returns {string} Validated path
     */
    validateFilePath(filePath, baseDir) {
        const resolvedPath = path.resolve(filePath);
        const resolvedBase = path.resolve(baseDir);

        // Ensure the resolved path is within the base directory
        if (!resolvedPath.startsWith(resolvedBase)) {
            throw new Error('Path traversal detected: file path outside allowed directory');
        }

        return resolvedPath;
    }

    /**
     * Validate numeric input
     * @param {number} value - Value to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @param {number} defaultValue - Default value if invalid
     * @returns {number} Validated number
     */
    validateNumber(value, min, max, defaultValue) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < min || num > max) {
            return defaultValue;
        }
        return num;
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
        } catch {
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
            const { title, products = [] } = config;

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

        // Validate the output path
        const validatedPath = this.validateFilePath(imagePath, this.tempDirectory);

        // Sanitize the text input
        const sanitizedText = this.sanitizeText(slide.text);

        // Validate dimensions
        const safeWidth = this.validateNumber(this.videoWidth, 320, 7680, 1920);
        const safeHeight = this.validateNumber(this.videoHeight, 240, 4320, 1080);

        // Generate image using ImageMagick or fallback to FFmpeg
        try {
            // Try ImageMagick first
            const text = this.wrapText(sanitizedText, 40);
            const command = `convert -size ${safeWidth}x${safeHeight} xc:black \
                -font Arial -pointsize 72 -fill white \
                -gravity center -annotate +0+0 "${text}" \
                "${validatedPath}"`;

            await execAsync(command);
        } catch {
            // Fallback to FFmpeg drawtext filter
            // For FFmpeg, further escape single quotes in text
            const escapedText = sanitizedText.replace(/'/g, "'\\''");
            const command = `ffmpeg -f lavfi -i color=c=black:s=${safeWidth}x${safeHeight}:d=1 \
                -vf "drawtext=text='${escapedText}':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=(h-text_h)/2" \
                -frames:v 1 "${validatedPath}" -y`;

            await execAsync(command);
        }

        return validatedPath;
    }

    /**
     * Create video from images
     * @param {Array<string>} imageFiles - Array of image paths
     * @param {Array<Object>} slides - Slide configurations
     * @param {string} outputPath - Output video path
     */
    async createVideoFromImages(imageFiles, slides, outputPath) {
        // Validate output path
        const validatedOutputPath = this.validateFilePath(outputPath, this.videoDirectory);

        // Create concat file for FFmpeg
        const concatFilePath = path.join(this.tempDirectory, 'concat.txt');
        const validatedConcatPath = this.validateFilePath(concatFilePath, this.tempDirectory);

        let concatContent = '';

        for (let i = 0; i < imageFiles.length; i++) {
            // Validate each image file path
            const validatedImagePath = this.validateFilePath(imageFiles[i], this.tempDirectory);
            concatContent += `file '${validatedImagePath}'\n`;
            concatContent += `duration ${slides[i].duration}\n`;
        }
        // Add last image again for proper duration
        if (imageFiles.length > 0) {
            const lastImagePath = this.validateFilePath(
                imageFiles[imageFiles.length - 1],
                this.tempDirectory
            );
            concatContent += `file '${lastImagePath}'\n`;
        }

        await fs.writeFile(validatedConcatPath, concatContent);

        // Validate FPS
        const safeFps = this.validateNumber(this.fps, 1, 60, 30);

        // Generate video
        const command = `ffmpeg -f concat -safe 0 -i "${validatedConcatPath}" \
            -vf "fps=${safeFps},format=yuv420p" \
            -c:v libx264 -preset fast \
            "${validatedOutputPath}" -y`;

        await execAsync(command);

        // Clean up concat file
        await fs.unlink(validatedConcatPath).catch(() => {});
    }

    /**
     * Generate placeholder video (when FFmpeg is not available)
     * @param {Object} config - Video configuration
     * @param {string} outputPath - Output video path
     */
    async generatePlaceholder(config, outputPath) {
        const { title } = config;

        // Validate output path
        const validatedOutputPath = this.validateFilePath(outputPath, this.videoDirectory);

        // Sanitize title for display in placeholder
        const sanitizedTitle = this.sanitizeText(title);

        // Create a simple text file as a placeholder
        const placeholderText = `
Video Placeholder: ${sanitizedTitle}
========================================

This is a placeholder for the video that would be generated.

To enable automatic video generation, install:
- FFmpeg: sudo apt-get install ffmpeg
- ImageMagick (optional): sudo apt-get install imagemagick

Products:
${config.products.map((p, i) => `${i + 1}. ${this.sanitizeText(p.name)} (${p.url})`).join('\n')}

Description:
${this.sanitizeText(config.description || '')}

Tags: ${config.tags ? config.tags.map((t) => this.sanitizeText(t)).join(', ') : 'N/A'}
`;

        // Validate dimensions
        const safeWidth = this.validateNumber(this.videoWidth, 320, 7680, 1920);
        const safeHeight = this.validateNumber(this.videoHeight, 240, 4320, 1080);

        // Create a minimal valid MP4 file using FFmpeg (if available) or create a marker file
        try {
            // Try to create a minimal black video
            const command = `ffmpeg -f lavfi -i color=c=black:s=${safeWidth}x${safeHeight}:d=5 \
                -c:v libx264 -preset ultrafast "${validatedOutputPath}" -y 2>/dev/null`;
            await execAsync(command);
        } catch {
            // If FFmpeg is not available, create a text placeholder
            await fs.writeFile(validatedOutputPath + '.txt', placeholderText);
            logger.warn('Created text placeholder instead of video', {
                path: validatedOutputPath + '.txt',
            });
        }

        logger.info('Generated placeholder video', { outputPath: validatedOutputPath });
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
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }

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

            // Validate video path
            const validatedVideoPath = this.validateFilePath(videoPath, this.videoDirectory);

            // Generate audio using text-to-speech (requires espeak or festival)
            const audioPath = path.join(this.tempDirectory, `narration-${Date.now()}.wav`);
            const validatedAudioPath = this.validateFilePath(audioPath, this.tempDirectory);

            // Sanitize script input
            const sanitizedScript = this.sanitizeText(script);

            try {
                // Try using espeak for text-to-speech
                // Limit script length to prevent resource exhaustion
                const truncatedScript = sanitizedScript.substring(0, 1000);
                await execAsync(
                    `espeak "${truncatedScript}" -w "${validatedAudioPath}" 2>/dev/null || \
                     echo "${truncatedScript}" | festival --tts -o "${validatedAudioPath}" 2>/dev/null`
                );

                // Combine video with audio
                const outputPath = validatedVideoPath.replace('.mp4', '-narrated.mp4');
                const validatedOutputPath = this.validateFilePath(outputPath, this.videoDirectory);

                await execAsync(
                    `ffmpeg -i "${validatedVideoPath}" -i "${validatedAudioPath}" \
                     -c:v copy -c:a aac -strict experimental \
                     "${validatedOutputPath}" -y`
                );

                // Clean up
                await fs.unlink(validatedAudioPath).catch(() => {});
                await fs.unlink(validatedVideoPath).catch(() => {});

                return validatedOutputPath;
            } catch (error) {
                logger.warn('Could not add narration to video', {
                    error: error.message,
                });
                return validatedVideoPath;
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
