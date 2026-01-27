// Video Processing Module
// Handles AI-generated video processing and affiliate link injection

const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const amazonAffiliate = require('./amazon-affiliate');

class VideoProcessor {
    constructor() {
        this.videoDirectory = process.env.VIDEO_DIRECTORY || './videos';
        this.processedDirectory = process.env.PROCESSED_VIDEO_DIRECTORY || './videos/processed';
    }

    /**
     * Initialize video processor
     */
    async initialize() {
        try {
            // Create directories if they don't exist
            await fs.mkdir(this.videoDirectory, { recursive: true });
            await fs.mkdir(this.processedDirectory, { recursive: true });
            logger.info('Video processor initialized', {
                videoDirectory: this.videoDirectory,
                processedDirectory: this.processedDirectory
            });
        } catch (error) {
            logger.error('Failed to initialize video processor', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Process video metadata and add affiliate links
     * @param {Object} video - Video object
     * @param {string} video.filePath - Path to video file
     * @param {string} video.title - Video title
     * @param {string} video.description - Base description
     * @param {Array<Object>} video.products - Products to link
     * @param {Array<string>} video.tags - Video tags
     * @returns {Promise<Object>} Processed video metadata
     */
    async processVideo(video) {
        try {
            const {
                filePath,
                title,
                description = '',
                products = [],
                tags = []
            } = video;

            logger.info('Processing video', { title, filePath });

            // Verify video file exists
            try {
                await fs.access(filePath);
            } catch {
                throw new Error(`Video file not found: ${filePath}`);
            }

            // Create description with affiliate links
            const affiliateDescription = amazonAffiliate.createDescription({
                title: description,
                products,
                disclaimer: '* As an Amazon Associate, I earn from qualifying purchases.'
            });

            // Add affiliate-related tags
            const enhancedTags = [
                ...tags,
                'amazon',
                'affiliate',
                'product review',
                'recommendations'
            ];

            // Create processed metadata
            const processedMetadata = {
                filePath,
                title,
                description: affiliateDescription,
                tags: enhancedTags,
                products,
                processedAt: new Date().toISOString()
            };

            // Save metadata
            const metadataPath = path.join(
                this.processedDirectory,
                `${path.basename(filePath, path.extname(filePath))}-metadata.json`
            );
            await fs.writeFile(metadataPath, JSON.stringify(processedMetadata, null, 2));

            logger.info('Video processed successfully', {
                title,
                metadataPath,
                productCount: products.length
            });

            return processedMetadata;
        } catch (error) {
            logger.error('Failed to process video', {
                error: error.message,
                video: video.title
            });
            throw error;
        }
    }

    /**
     * Scan video directory for unprocessed videos
     * @returns {Promise<Array<string>>} Array of video file paths
     */
    async scanForVideos() {
        try {
            const files = await fs.readdir(this.videoDirectory);
            const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
            
            const videoFiles = files
                .filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return videoExtensions.includes(ext);
                })
                .map(file => path.join(this.videoDirectory, file));

            logger.info('Scanned for videos', {
                directory: this.videoDirectory,
                count: videoFiles.length
            });

            return videoFiles;
        } catch (error) {
            logger.error('Failed to scan for videos', {
                error: error.message,
                directory: this.videoDirectory
            });
            throw error;
        }
    }

    /**
     * Get video metadata
     * @param {string} filePath - Path to video file
     * @returns {Promise<Object>} Video metadata
     */
    async getVideoMetadata(filePath) {
        try {
            const stats = await fs.stat(filePath);
            const filename = path.basename(filePath);
            const extension = path.extname(filePath);

            return {
                filePath,
                filename,
                extension,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            };
        } catch (error) {
            logger.error('Failed to get video metadata', {
                error: error.message,
                filePath
            });
            throw error;
        }
    }

    /**
     * Load processed metadata
     * @param {string} videoFilePath - Path to video file
     * @returns {Promise<Object|null>} Processed metadata or null
     */
    async loadProcessedMetadata(videoFilePath) {
        try {
            const metadataPath = path.join(
                this.processedDirectory,
                `${path.basename(videoFilePath, path.extname(videoFilePath))}-metadata.json`
            );

            const data = await fs.readFile(metadataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // File doesn't exist or can't be read
            return null;
        }
    }

    /**
     * Mark video as uploaded
     * @param {string} videoFilePath - Path to video file
     * @param {string} videoId - YouTube video ID
     * @param {string} videoUrl - YouTube video URL
     * @returns {Promise<void>}
     */
    async markAsUploaded(videoFilePath, videoId, videoUrl) {
        try {
            const metadata = await this.loadProcessedMetadata(videoFilePath);
            if (metadata) {
                metadata.uploaded = true;
                metadata.uploadedAt = new Date().toISOString();
                metadata.videoId = videoId;
                metadata.videoUrl = videoUrl;

                const metadataPath = path.join(
                    this.processedDirectory,
                    `${path.basename(videoFilePath, path.extname(videoFilePath))}-metadata.json`
                );
                await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

                logger.info('Marked video as uploaded', {
                    videoFilePath,
                    videoId,
                    videoUrl
                });
            }
        } catch (error) {
            logger.error('Failed to mark video as uploaded', {
                error: error.message,
                videoFilePath
            });
        }
    }

    /**
     * Clean up old processed files
     * @param {number} daysOld - Number of days old to keep
     * @returns {Promise<number>} Number of files deleted
     */
    async cleanupOldFiles(daysOld = 30) {
        try {
            const files = await fs.readdir(this.processedDirectory);
            const now = Date.now();
            const cutoff = daysOld * 24 * 60 * 60 * 1000;
            let deleted = 0;

            for (const file of files) {
                const filePath = path.join(this.processedDirectory, file);
                const stats = await fs.stat(filePath);
                
                if (now - stats.mtime.getTime() > cutoff) {
                    await fs.unlink(filePath);
                    deleted++;
                }
            }

            logger.info('Cleaned up old files', {
                daysOld,
                deleted
            });

            return deleted;
        } catch (error) {
            logger.error('Failed to cleanup old files', {
                error: error.message
            });
            throw error;
        }
    }
}

// Export singleton instance
module.exports = new VideoProcessor();
