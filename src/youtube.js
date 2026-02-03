/**
 * YouTube API Manager
 * Handles YouTube authentication and video posting
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class YouTubeManager {
  constructor(credentials) {
    this.credentials = credentials;
    this.oauth2Client = null;
    this.youtube = null;
    this.initializeClient();
  }

  /**
   * Initialize OAuth2 client
   */
  initializeClient() {
    this.oauth2Client = new google.auth.OAuth2(
      this.credentials.clientId,
      this.credentials.clientSecret,
      this.credentials.redirectUri
    );

    if (this.credentials.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: this.credentials.refreshToken
      });
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  /**
   * Get OAuth2 authorization URL
   */
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Set refresh token
   */
  async setRefreshToken(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens.refresh_token;
  }

  /**
   * Upload video to YouTube (text-only post for stealth mode)
   */
  async createPost(content) {
    try {
      // In stealth mode, we create a community post or short
      // For now, we'll simulate this by creating a playlist item or comment
      console.log('📝 Creating stealth post:', content.title);
      
      // Simulate post creation (in production, use Community Posts API when available)
      const result = {
        success: true,
        type: 'stealth_post',
        title: content.title,
        description: content.description,
        timestamp: new Date().toISOString(),
        contentId: `stealth-${Date.now()}`
      };

      return result;
    } catch (error) {
      console.error('Error creating post:', error.message);
      throw error;
    }
  }

  /**
   * Upload actual video file
   */
  async uploadVideo(videoPath, metadata) {
    try {
      const fileSize = (await fs.stat(videoPath)).size;
      
      const response = await this.youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags || [],
            categoryId: '28' // Science & Technology
          },
          status: {
            privacyStatus: 'public',
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: require('fs').createReadStream(videoPath)
        }
      });

      return {
        success: true,
        videoId: response.data.id,
        url: `https://youtube.com/watch?v=${response.data.id}`
      };
    } catch (error) {
      console.error('Error uploading video:', error.message);
      throw error;
    }
  }

  /**
   * Check if authenticated
   */
  isAuthenticated() {
    return this.oauth2Client && this.oauth2Client.credentials.refresh_token;
  }
}

module.exports = YouTubeManager;
