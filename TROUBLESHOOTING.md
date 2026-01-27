# Troubleshooting Guide

## Common Issues and Solutions

### YouTube API Authentication Error

**Symptom:**
```
Error: YouTube API error: 401 - Unauthorized
```

**Root Cause:**
The 401 authentication error typically occurs when:
1. No `.env` file exists in the project
2. The `.env` file has placeholder values for YouTube credentials
3. The OAuth2 refresh token is invalid or expired
4. YouTube Data API v3 is not enabled in Google Cloud Console

**Solution:**

1. **Create a `.env` file** if it doesn't exist:
   ```bash
   cp .env.example .env
   ```

2. **Get your YouTube API credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project and enable YouTube Data API v3
   - Create OAuth 2.0 credentials
   - Get Client ID and Client Secret

3. **Run the YouTube setup wizard:**
   ```bash
   npm run setup:youtube
   ```
   
   This will:
   - Guide you through OAuth2 authentication
   - Generate and save your refresh token
   - Validate your configuration

4. **Update your `.env` file** with real credentials:
   ```env
   YOUTUBE_CLIENT_ID=your_actual_client_id
   YOUTUBE_CLIENT_SECRET=your_actual_client_secret
   YOUTUBE_REFRESH_TOKEN=your_refresh_token_from_setup
   AMAZON_AFFILIATE_TAG=your_affiliate_tag
   ```

5. **Restart the server:**
   ```bash
   npm start
   ```

6. **Verify the configuration:**
   - Check the startup logs for configuration status
   - Test the health endpoint: `curl http://localhost:3000/api/health`

**Prevention:**
- Never commit your `.env` file to version control
- Re-run setup wizard if OAuth tokens expire
- Ensure YouTube Data API v3 remains enabled

### API Not Configured Error

**Symptom:**
```json
{
  "error": "YouTube API not configured",
  "message": "Please configure YouTube credentials in .env file"
}
```

**Root Cause:**
The server detected that YouTube credentials are missing or set to placeholder values.

**Solution:**
Run the setup wizard to configure your credentials:
```bash
npm run setup:youtube
```

### Amazon Affiliate Links Not Working

**Symptom:**
Video descriptions don't include affiliate links or links are malformed.

**Root Cause:**
1. `AMAZON_AFFILIATE_TAG` not set in `.env`
2. Invalid product ASINs in video configuration
3. Product URLs incorrectly formatted

**Solution:**

1. **Verify affiliate tag:**
   ```env
   AMAZON_AFFILIATE_TAG=yourtag-20
   ```

2. **Test affiliate link generation:**
   ```bash
   curl -X POST http://localhost:3000/api/affiliate/generate \
     -H "Content-Type: application/json" \
     -d '{"url": "B08XXXXX"}'
   ```

3. **Check video config format:**
   ```json
   {
     "products": [
       { "name": "Product Name", "url": "B08XXXXX" }
     ]
   }
   ```

### Videos Not Uploading

**Symptom:**
Automation runs but videos aren't appearing on YouTube.

**Root Cause:**
1. Video files not in correct directory
2. Unsupported video format
3. YouTube API quota exceeded
4. Scheduler not enabled

**Solution:**

1. **Check video directory:**
   ```bash
   ls -la ./videos/*.mp4
   ```

2. **Verify supported formats:**
   - Supported: .mp4, .mov, .avi, .mkv, .webm
   - Recommended: .mp4 (H.264)

3. **Check API quota:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Check YouTube Data API v3 quota usage
   - Daily quota: 10,000 units (1 upload = ~1,600 units)

4. **Enable scheduler:**
   ```env
   AUTO_UPLOAD=true
   UPLOAD_SCHEDULE=0 10 * * *
   ```

5. **Manually trigger upload:**
   ```bash
   curl -X POST http://localhost:3000/api/automation/trigger
   ```

### Scheduler Not Running

**Symptom:**
Server starts but scheduled uploads don't occur.

**Root Cause:**
1. `AUTO_UPLOAD` not set to `true`
2. Invalid cron schedule format
3. Server not running continuously

**Solution:**

1. **Enable automation:**
   ```env
   AUTO_UPLOAD=true
   ```

2. **Verify cron format:**
   ```env
   # Valid examples:
   UPLOAD_SCHEDULE=0 10 * * *      # Daily at 10 AM
   UPLOAD_SCHEDULE=0 14 * * 1-5    # Weekdays at 2 PM
   UPLOAD_SCHEDULE=0 */6 * * *     # Every 6 hours
   ```

3. **Check server logs:**
   ```bash
   npm start
   # Look for: "Automation scheduler initialized"
   ```

4. **Test automation status:**
   ```bash
   curl http://localhost:3000/api/automation/status
   ```

## Getting Help

If you continue to experience issues:

1. Check the server logs for detailed error messages
2. Verify your YouTube API credentials in [Google Cloud Console](https://console.cloud.google.com/)
3. Ensure your `.env` file is in the project root directory
4. Review the [SETUP.md](SETUP.md) guide for detailed setup instructions
5. Check the [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) for automation details
6. Review the [README.md](README.md) for general information

## Security Notes

- ✅ Never expose API tokens in client-side code
- ✅ Keep your `.env` file out of version control (already in `.gitignore`)
- ✅ Use different credentials for development and production
- ✅ Rotate OAuth tokens if compromised
- ✅ The server handles all API calls securely server-side

## Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Amazon Associates Help](https://affiliate-program.amazon.com/help)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
