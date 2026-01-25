# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-25

### Added
- **Security Enhancements**
  - Helmet.js middleware for security headers (CSP, X-Frame-Options, etc.)
  - Express-rate-limit for API rate limiting (100 requests per 15 minutes)
  - Input validation using express-validator on order creation endpoint
  - CORS whitelist configuration for production environments
  - Environment-based security (strict mode in production)
  
- **Code Quality & Automation**
  - ESLint configuration for code quality checks
  - Prettier for consistent code formatting
  - Husky and lint-staged for pre-commit hooks
  - Comprehensive npm scripts (lint, format, test)
  
- **XSS Protection**
  - Replaced innerHTML with safe DOM manipulation methods
  - Added HTML escaping helper function
  - Secure rendering of user-generated content
  
- **Financial Precision**
  - Replaced floating-point arithmetic with cents-based calculations
  - Proper conversion between dollars and cents for precise money handling
  
- **Form Validation**
  - Client-side validation for checkout form
  - Email format validation
  - Required field validation
  - Zip code validation
  
- **CI/CD Improvements**
  - Multi-job GitHub Actions pipeline (lint, security, tests, docker build)
  - Automated security audits with npm audit
  - Separate jobs for linting, security, and integration tests
  - Docker image building in CI pipeline
  
- **Containerization**
  - Dockerfile with multi-stage build for production
  - Docker Compose configuration
  - Non-root user in container for security
  - Health checks in Docker configuration
  
- **Dependency Management**
  - Dependabot configuration for automated dependency updates
  - Weekly scheduled updates for npm and GitHub Actions
  - Grouped minor/patch updates
  
- **Configuration**
  - Extended .env.example with production settings
  - NODE_ENV support for environment-specific behavior
  - ALLOWED_ORIGINS for CORS configuration
  - Comprehensive .gitignore and .prettierignore
  
- **Documentation**
  - This CHANGELOG.md file
  - Better error messages for users
  - Inline code comments for security features

### Changed
- Server now exits with error in production if API credentials not configured
- Console logs limited to development environment only
- Error messages show stack traces only in development mode
- Improved error handling with structured error responses
- Updated package.json with new scripts and dependencies

### Fixed
- XSS vulnerability from unsafe innerHTML usage
- Floating-point precision errors in price calculations
- Missing input validation on checkout form
- Missing security headers
- Unprotected API endpoints (no rate limiting)
- Missing CORS whitelist
- Console logs in production code

### Security
- Fixed XSS vulnerability (CVE-potential)
- Added rate limiting to prevent DoS attacks
- Added input sanitization and validation
- Added security headers via Helmet.js
- Improved CORS configuration

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Printify API integration
- Backend API proxy server
- Frontend shopping cart
- Product catalog display
- Checkout functionality
- Security tests
- Integration tests
- GitHub Actions CI/CD

[1.1.0]: https://github.com/S3OPS/666/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/S3OPS/666/releases/tag/v1.0.0
