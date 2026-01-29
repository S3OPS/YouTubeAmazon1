// YouTube API Integration Module
// Handles video uploads and metadata management

const { google } = require('googleapis');
const fs = require('fs');
const logger = require('./logger');

class YouTubeAPI {
    constructor() {
        this.youtube = null;
        this.oauth2Client = null;
        this.initialized = false;
    }

    /**
     * Initialize YouTube API with OAuth2 credentials
     */
    async initialize() {
        try {
            const clientId = process.env.YOUTUBE_CLIENT_ID;
            const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
            const redirectUri =
                process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';
            const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

            if (!clientId || !clientSecret || !refreshToken) {
                throw new Error(
                    'Missing required YouTube API credentials. Check YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN environment variables.'
                );
            }

            // Create OAuth2 client
            this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

            // Set refresh token
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken,
            });

            // Initialize YouTube API
            this.youtube = google.youtube({
                version: 'v3',
                auth: this.oauth2Client,
            });

            this.initialized = true;
            logger.info('YouTube API initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize YouTube API', { error: error.message });
            throw error;
        }
    }

    /**
     * Upload video to YouTube
     * @param {Object} options - Upload options
     * @param {string} options.filePath - Path to video file
     * @param {string} options.title - Video title
     * @param {string} options.description - Video description (includes affiliate links)
     * @param {Array<string>} options.tags - Video tags
     * @param {string} options.categoryId - YouTube category ID (default: 22 for People & Blogs)
     * @param {string} options.privacyStatus - Privacy status (public, private, unlisted)
     * @returns {Promise<Object>} Upload result with video ID
     */
    async uploadVideo(options) {
        if (!this.initialized) {
            await this.initialize();
        }

        const {
            filePath,
            title,
            description,
            tags = [],
            categoryId = '22', // People & Blogs
            privacyStatus = 'public',
        } = options;

        try {
            logger.info('Starting video upload', { title, filePath });

            // Verify file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`Video file not found: ${filePath}`);
            }

            // Upload video
            const response = await this.youtube.videos.insert({
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title,
                        description,
                        tags,
                        categoryId,
                        defaultLanguage: 'en',
                        defaultAudioLanguage: 'en',
                    },
                    status: {
                        privacyStatus,
                        selfDeclaredMadeForKids: false,
                    },
                },
                media: {
                    body: fs.createReadStream(filePath),
                },
            });

            const videoId = response.data.id;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            logger.info('Video uploaded successfully', {
                videoId,
                videoUrl,
                title,
            });

            return {
                success: true,
                videoId,
                videoUrl,
                data: response.data,
            };
        } catch (error) {
            logger.error('Failed to upload video', {
                error: error.message,
                title,
            });
            throw error;
        }
    }

    /**
     * Update video metadata
     * @param {string} videoId - YouTube video ID
     * @param {Object} updates - Metadata to update
     * @returns {Promise<Object>} Update result
     */
    async updateVideo(videoId, updates) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const response = await this.youtube.videos.update({
                part: 'snippet,status',
                requestBody: {
                    id: videoId,
                    ...updates,
                },
            });

            logger.info('Video updated successfully', { videoId });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            logger.error('Failed to update video', {
                error: error.message,
                videoId,
            });
            throw error;
        }
    }

    /**
     * Get video details
     * @param {string} videoId - YouTube video ID
     * @returns {Promise<Object>} Video details
     */
    async getVideo(videoId) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const response = await this.youtube.videos.list({
                part: 'snippet,status,statistics',
                id: videoId,
            });

            if (!response.data.items || response.data.items.length === 0) {
                throw new Error('Video not found');
            }

            return {
                success: true,
                data: response.data.items[0],
            };
        } catch (error) {
            logger.error('Failed to get video', {
                error: error.message,
                videoId,
            });
            throw error;
        }
    }

    /**
     * Delete video from YouTube
     * @param {string} videoId - YouTube video ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteVideo(videoId) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            await this.youtube.videos.delete({
                id: videoId,
            });

            logger.info('Video deleted successfully', { videoId });
            return {
                success: true,
                videoId,
            };
        } catch (error) {
            logger.error('Failed to delete video', {
                error: error.message,
                videoId,
            });
            throw error;
        }
    }

    /**
     * Generate OAuth2 authorization URL
     * @returns {string} Authorization URL
     */
    getAuthUrl() {
        if (!this.oauth2Client) {
            const clientId = process.env.YOUTUBE_CLIENT_ID;
            const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
            const redirectUri =
                process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

            this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        }

        const scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.force-ssl',
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
        });
    }

    /**
     * Exchange authorization code for tokens
     * @param {string} code - Authorization code from OAuth2 callback
     * @returns {Promise<Object>} Tokens including refresh token
     */
    async getTokensFromCode(code) {
        if (!this.oauth2Client) {
            const clientId = process.env.YOUTUBE_CLIENT_ID;
            const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
            const redirectUri =
                process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

            this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        }

        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }
}

// Export singleton instance
module.exports = new YouTubeAPI();
