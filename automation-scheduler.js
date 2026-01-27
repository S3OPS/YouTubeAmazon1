// Automation Scheduler
// Manages automatic video processing and uploading

const cron = require('node-cron');
const logger = require('./logger');
const videoProcessor = require('./video-processor');
const youtubeApi = require('./youtube-api');

class AutomationScheduler {
    constructor() {
        this.jobs = [];
        this.isRunning = false;
        this.uploadSchedule = process.env.UPLOAD_SCHEDULE || '0 10 * * *'; // Default: 10 AM daily
        this.autoUpload = process.env.AUTO_UPLOAD === 'true';
    }

    /**
     * Initialize automation scheduler
     */
    async initialize() {
        try {
            await videoProcessor.initialize();
            
            if (this.autoUpload) {
                await youtubeApi.initialize();
            }

            logger.info('Automation scheduler initialized', {
                autoUpload: this.autoUpload,
                uploadSchedule: this.uploadSchedule
            });
        } catch (error) {
            logger.error('Failed to initialize automation scheduler', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Start automated scheduling
     */
    start() {
        if (this.isRunning) {
            logger.warn('Automation scheduler already running');
            return;
        }

        if (!this.autoUpload) {
            logger.info('Auto-upload disabled, scheduler not started');
            return;
        }

        // Schedule automatic video processing and upload
        const uploadJob = cron.schedule(this.uploadSchedule, async () => {
            logger.info('Running scheduled video upload task');
            await this.processAndUploadVideos();
        });

        this.jobs.push(uploadJob);

        // Schedule cleanup task (weekly on Sunday at 2 AM)
        const cleanupJob = cron.schedule('0 2 * * 0', async () => {
            logger.info('Running scheduled cleanup task');
            await videoProcessor.cleanupOldFiles(30);
        });

        this.jobs.push(cleanupJob);

        this.isRunning = true;
        logger.info('Automation scheduler started', {
            uploadSchedule: this.uploadSchedule,
            jobCount: this.jobs.length
        });
    }

    /**
     * Stop automated scheduling
     */
    stop() {
        if (!this.isRunning) {
            logger.warn('Automation scheduler not running');
            return;
        }

        this.jobs.forEach(job => job.stop());
        this.jobs = [];
        this.isRunning = false;

        logger.info('Automation scheduler stopped');
    }

    /**
     * Process and upload videos
     * @returns {Promise<Object>} Processing results
     */
    async processAndUploadVideos() {
        try {
            const results = {
                scanned: 0,
                processed: 0,
                uploaded: 0,
                errors: [],
                videos: []
            };

            // Scan for videos
            const videoFiles = await videoProcessor.scanForVideos();
            results.scanned = videoFiles.length;

            logger.info('Found videos to process', { count: videoFiles.length });

            // Process each video
            for (const videoFile of videoFiles) {
                try {
                    // Check if already uploaded
                    const existingMetadata = await videoProcessor.loadProcessedMetadata(videoFile);
                    if (existingMetadata && existingMetadata.uploaded) {
                        logger.info('Video already uploaded, skipping', { videoFile });
                        continue;
                    }

                    // Load video configuration
                    const videoConfig = await this.loadVideoConfig(videoFile);
                    
                    // Process video
                    const processedMetadata = await videoProcessor.processVideo(videoConfig);
                    results.processed++;

                    // Upload to YouTube if auto-upload is enabled
                    if (this.autoUpload) {
                        const uploadResult = await youtubeApi.uploadVideo({
                            filePath: processedMetadata.filePath,
                            title: processedMetadata.title,
                            description: processedMetadata.description,
                            tags: processedMetadata.tags,
                            privacyStatus: process.env.DEFAULT_PRIVACY_STATUS || 'public'
                        });

                        if (uploadResult.success) {
                            await videoProcessor.markAsUploaded(
                                videoFile,
                                uploadResult.videoId,
                                uploadResult.videoUrl
                            );
                            results.uploaded++;
                            results.videos.push({
                                file: videoFile,
                                videoId: uploadResult.videoId,
                                videoUrl: uploadResult.videoUrl
                            });
                        }
                    }

                } catch (error) {
                    logger.error('Failed to process video', {
                        error: error.message,
                        videoFile
                    });
                    results.errors.push({
                        file: videoFile,
                        error: error.message
                    });
                }
            }

            logger.info('Video processing completed', results);
            return results;

        } catch (error) {
            logger.error('Failed to process and upload videos', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Load video configuration
     * @param {string} videoFile - Path to video file
     * @returns {Promise<Object>} Video configuration
     */
    async loadVideoConfig(videoFile) {
        // Check for companion JSON config file
        const configPath = videoFile.replace(/\.[^.]+$/, '.json');
        
        try {
            const fs = require('fs').promises;
            const configData = await fs.readFile(configPath, 'utf8');
            const config = JSON.parse(configData);
            
            return {
                filePath: videoFile,
                ...config
            };
        } catch {
            // No config file, use defaults
            const path = require('path');
            const filename = path.basename(videoFile, path.extname(videoFile));
            
            return {
                filePath: videoFile,
                title: this.formatTitle(filename),
                description: 'Check out these amazing products!',
                products: [],
                tags: ['products', 'review', 'recommendations']
            };
        }
    }

    /**
     * Format filename as title
     * @param {string} filename - Filename
     * @returns {string} Formatted title
     */
    formatTitle(filename) {
        return filename
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    /**
     * Manually trigger processing and upload
     * @returns {Promise<Object>} Processing results
     */
    async triggerNow() {
        logger.info('Manually triggering video processing');
        return await this.processAndUploadVideos();
    }

    /**
     * Get scheduler status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            running: this.isRunning,
            autoUpload: this.autoUpload,
            uploadSchedule: this.uploadSchedule,
            activeJobs: this.jobs.length
        };
    }
}

// Export singleton instance
module.exports = new AutomationScheduler();
