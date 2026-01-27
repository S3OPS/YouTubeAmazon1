# Troubleshooting Guide

## Common Issues and Solutions

### 401 Authentication Error from Printify API

**Symptom:**
```
Error: Printify API error: 401 - {}
```

**Root Cause:**
The 401 authentication error typically occurs when:
1. No `.env` file exists in the project
2. The `.env` file has placeholder values (`your_api_token_here`, `your_shop_id_here`)
3. The API token is invalid or expired

**Solution:**

1. **Create a `.env` file** if it doesn't exist:
   ```bash
   cp .env.example .env
   ```

2. **Get your Printify API credentials:**
   - API Token: Visit [Printify API Settings](https://printify.com/app/account/api)
   - Shop ID: Find it in your Printify shop settings

3. **Update your `.env` file** with real credentials:
   ```env
   PRINTIFY_API_TOKEN=your_actual_api_token_from_printify
   PRINTIFY_SHOP_ID=your_actual_shop_id_from_printify
   ```

4. **Restart the server:**
   ```bash
   npm start
   ```

5. **Verify the configuration:**
   - Check the startup logs for `✅ Printify API configured`
   - Test the health endpoint: `curl http://localhost:3000/api/health`
   - The response should show `"configured": true`

**Prevention:**
- Never commit your `.env` file to version control
- Rotate your API tokens regularly
- Use environment-specific credentials for development and production

### API Not Configured Error

**Symptom:**
```json
{
  "error": "Printify API not configured",
  "message": "Please configure PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID in .env file",
  "demo": true,
  "data": []
}
```

**Root Cause:**
The server detected that credentials are missing or set to placeholder values.

**Solution:**
Follow the steps in the "401 Authentication Error" section above to configure your credentials.

### Server Running in Demo Mode

**Symptom:**
Server startup shows:
```
⚠️  Running in DEMO mode - configure .env file for real API access
```

**Root Cause:**
The server is running without valid Printify API credentials.

**Solution:**
This is expected behavior when credentials are not configured. The server will continue to function but won't be able to make real API calls to Printify. To enable full functionality, configure your credentials as described above.

**Note:** Demo mode is useful for:
- Testing the frontend without API access
- Development when you don't need live data
- CI/CD environments where API access is not needed

## Getting Help

If you continue to experience issues:

1. Check the server logs for detailed error messages
2. Verify your API token is valid at [Printify API Settings](https://printify.com/app/account/api)
3. Ensure your `.env` file is in the project root directory
4. Review the [SETUP.md](SETUP.md) guide for detailed setup instructions
5. Check the [README.md](README.md) for general information

## Security Notes

- ✅ Never expose API tokens in client-side code
- ✅ Keep your `.env` file out of version control (already in `.gitignore`)
- ✅ Use different credentials for development and production
- ✅ Rotate API tokens regularly for security
- ✅ The server proxies all API calls to keep credentials secure
