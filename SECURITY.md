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
✅ **Rate Limiting**: 100 requests per 15 minutes per IP (express-rate-limit)  
✅ **Security Headers**: Helmet middleware with Content Security Policy  
✅ **Input Validation**: express-validator for request sanitization  
✅ **Structured Logging**: Winston logger with request tracking  
✅ **Non-root Docker**: Application runs as unprivileged user (youtubebot)  

### API Security

- ✅ Store API tokens securely using environment variables
- ✅ Rotate OAuth tokens regularly via Google Cloud Console
- ✅ Use least-privilege access (only necessary scopes)
- ✅ Monitor API usage through backend logging
- ✅ Backend validates and sanitizes all incoming requests
- ✅ Request IDs for tracking and debugging

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
- [x] Rate limiting implemented (100 req/15min/IP)
- [x] Request logging enabled (Winston with request IDs)
- [x] Error handling and monitoring set up
- [x] Security headers (Helmet with CSP)
- [x] Input validation (express-validator)
- [ ] HTTPS enabled (configure on your hosting platform)
- [ ] Regular dependency updates
- [ ] API token rotation schedule

## Best Practices Implemented

1. ✅ **No exposed credentials**: Environment variables used
2. ✅ **Backend proxy**: All API calls go through server
3. ✅ **Input validation**: express-validator for all endpoints
4. ✅ **Secure defaults**: CORS properly configured
5. ✅ **CSP Headers**: Helmet middleware with Content Security Policy
6. ✅ **Rate Limiting**: express-rate-limit (100 req/15min/IP)
7. ✅ **Monitoring**: Winston structured logging with request tracking
8. 🔄 **HTTPS**: Configure on your hosting platform

## Current Implementation Details

### Rate Limiting (Implemented)

```javascript
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);
```

### Request Logging (Implemented)

```javascript
app.use((req, res, next) => {
    req.id = randomUUID();
    res.setHeader('X-Request-ID', req.id);
    // Request logged on finish with duration, status, etc.
});
```

### Security Headers (Implemented)

```javascript
const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
        },
    },
}));
```

### Input Validation (Implemented)

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/orders', [
    body('external_id').notEmpty().trim(),
    body('line_items').isArray({ min: 1 }),
    body('address_to.email').isEmail().normalizeEmail(),
    body('address_to.country').isISO31661Alpha2(),
], async (req, res) => { ... });
```

## Additional Security Recommendations

### For Future Enhancement

1. **Add CSRF Protection**: Consider adding for form submissions
2. **Implement Request Signing**: Sign outgoing API requests
3. **Add Circuit Breaker**: Protect against cascading failures
4. **API Key Rotation**: Automated key rotation system
5. **HTTPS**: Always use HTTPS in production (configured at hosting level)
