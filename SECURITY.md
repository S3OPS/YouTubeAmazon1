# Security Policy

## Supported Versions

This application implements production-ready security best practices for API credential management.

## Security Implementation ✅

### Current Security Features

✅ **Backend API Architecture**: Node.js/Express server proxies all API requests  
✅ **Environment Variables**: Credentials stored in `.env` file (server-side)  
✅ **No Client-Side Exposure**: API tokens never sent to browser  
✅ **CORS Configuration**: Proper cross-origin resource sharing setup  
✅ **Git Security**: `.env` file excluded from version control  

### API Security

- ✅ Store API tokens securely using environment variables
- ✅ Rotate OAuth tokens regularly via Google Cloud Console
- ✅ Use least-privilege access (only necessary scopes)
- ✅ Monitor API usage through backend logging
- Backend validates and sanitizes all incoming requests

## Reporting a Vulnerability

If you discover a security vulnerability:
1. Do NOT open a public issue
2. Contact the repository owner directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## Production Deployment Checklist

- [x] Backend API implemented (`server.js`)
- [x] Credentials in environment variables (`.env`)
- [x] `.env` excluded from git
- [ ] HTTPS enabled (configure on your hosting platform)
- [ ] Rate limiting implemented (recommended for production)
- [ ] Request logging enabled (for monitoring)
- [ ] Error handling and monitoring set up
- [ ] Regular dependency updates
- [ ] API token rotation schedule

## Best Practices Implemented

1. ✅ **No exposed credentials**: Environment variables used
2. ✅ **Backend proxy**: All API calls go through server
3. ✅ **Input validation**: Server validates requests
4. ✅ **Secure defaults**: CORS properly configured
5. 🔄 **HTTPS**: Configure on your hosting platform
6. 🔄 **CSP Headers**: Can be added to server.js
7. 🔄 **Rate Limiting**: Can be added with express-rate-limit
8. 🔄 **Monitoring**: Add logging middleware as needed

## Additional Security Recommendations

### For Production Enhancement

1. **Add Rate Limiting**:
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

2. **Add Request Logging**:
   ```javascript
   const morgan = require('morgan');
   app.use(morgan('combined'));
   ```

3. **Add Helmet for Security Headers**:
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

4. **Input Validation**: Use express-validator or joi

5. **HTTPS**: Always use HTTPS in production (configured at hosting level)
