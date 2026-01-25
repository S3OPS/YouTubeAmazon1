# Security Policy

## Supported Versions

This is a reference implementation for educational purposes. Use in production requires additional security measures.

## Security Recommendations

### For Development
- Never commit API tokens to version control
- Use environment variables for sensitive data
- Test with demo/sandbox accounts first

### For Production
- **DO NOT** expose API tokens in client-side code
- Implement a backend server to handle API requests
- Use HTTPS for all communications
- Implement rate limiting
- Add authentication for admin functions
- Use environment variables for configuration
- Implement proper error handling
- Add logging and monitoring
- Regular security audits

### API Security
- Store API tokens securely (use secret management)
- Rotate API tokens regularly
- Use least-privilege access
- Monitor API usage

## Reporting a Vulnerability

If you discover a security vulnerability:
1. Do NOT open a public issue
2. Contact the repository owner directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## Known Limitations

- Current implementation stores API token in client-side code (development only)
- No authentication/authorization system
- No rate limiting
- Basic input validation
- Requires backend for production use

## Best Practices

1. **Never expose credentials**: Use environment variables
2. **Validate input**: Sanitize all user input
3. **Use HTTPS**: Encrypt data in transit
4. **Implement CSP**: Add Content Security Policy headers
5. **Regular updates**: Keep dependencies updated
6. **Audit logs**: Track all transactions
7. **Backup data**: Regular backups of order data
8. **Monitor API**: Track API usage and errors
