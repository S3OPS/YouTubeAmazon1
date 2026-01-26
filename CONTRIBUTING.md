# Contributing Guide

Thank you for your interest in contributing to the Printify Dropshipping Store! This guide will help you get started with contributing to this fully automated project.

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/666.git
   cd 666
   ```

2. **Run the automated setup**
   ```bash
   ./quick-start.sh
   ```
   
   Or manually:
   ```bash
   npm install
   npm run setup
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

### Pre-commit Automation

This project uses **Husky** for pre-commit hooks. Every commit automatically:
- ✅ Runs ESLint to check code quality
- ✅ Formats code with Prettier
- ✅ Prevents commits with errors

You don't need to manually run linting - it happens automatically!

### Making Changes

1. **Write your code**
   - Follow existing code style
   - Add comments for complex logic
   - Keep changes focused and minimal

2. **Test your changes**
   ```bash
   # Start the server
   npm start
   
   # In another terminal, run tests
   npm test
   
   # Run linting manually (optional, pre-commit does this)
   npm run lint
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "type: description"
   ```
   
   Commit message types:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks
   - `ci:` CI/CD changes

### Code Quality Standards

Our automated systems enforce:

- **ESLint Rules**
  - No unused variables
  - Curly braces for conditionals
  - No console.log in production code
  - Security best practices

- **Prettier Formatting**
  - 2-space indentation
  - Single quotes
  - Semicolons
  - Trailing commas

- **Security Requirements**
  - No hardcoded secrets
  - No exposed API tokens
  - Safe DOM manipulation (no innerHTML)
  - Input validation on all user data

## 🧪 Testing

### Running Tests Locally

```bash
# All tests
npm test

# Security tests only
npm run test:security

# Integration tests only
npm run test:integration
```

### Writing Tests

1. **Security Tests** (`test-security.js`)
   - Verify no credentials in code
   - Check .gitignore entries
   - Validate security headers

2. **Integration Tests** (`test-integration.js`)
   - Test API endpoints
   - Verify HTTP responses
   - Check server functionality

## 📦 Docker Development

### Local Docker Testing

```bash
# Build the image
npm run docker:build

# Run in development mode
npm run docker:run

# View logs
npm run docker:logs

# Stop containers
npm run docker:stop
```

### Production Docker Testing

```bash
# Test production configuration
npm run docker:prod
```

## 🔄 CI/CD Pipeline

When you create a pull request, the following automated checks run:

1. **Linting** - ESLint and Prettier validation
2. **Security** - npm audit and security tests
3. **Integration Tests** - API and server tests
4. **Docker Build** - Container build verification
5. **CodeQL Scan** - Security vulnerability detection (on main branch)

All checks must pass before merging.

## 📝 Pull Request Process

1. **Ensure all tests pass locally**
   ```bash
   npm run ci
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

4. **Address review feedback**
   - Make requested changes
   - Push updates to your branch
   - CI/CD will re-run automatically

5. **Merge**
   - Maintainers will merge once approved
   - Automated deployment will handle the rest

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security concerns to the maintainers
2. Include detailed description
3. Provide steps to reproduce
4. Suggest a fix if possible

### Security Best Practices

- Never commit `.env` files
- Keep API tokens in environment variables
- Use server-side API calls only
- Validate all user input
- Follow OWASP guidelines

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Verify you're using the latest version
3. Test with minimal configuration

### Creating a Bug Report

Include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, npm version
- **Logs**: Relevant error messages

## 💡 Feature Requests

### Suggesting Features

1. Check existing issues/PRs
2. Create a new issue with "Feature Request" label
3. Describe:
   - The problem it solves
   - Proposed solution
   - Alternative solutions
   - Additional context

## 📊 Monitoring & Health Checks

### Local Monitoring

```bash
# Start continuous monitoring
npm run monitor
```

This runs automated health checks every 60 seconds.

### Production Monitoring

The repository includes automated health monitoring:
- Runs every 6 hours via GitHub Actions
- Creates issues automatically on failures
- Tracks response times and memory usage

## 🔧 Troubleshooting

### Common Issues

**Pre-commit hooks not running:**
```bash
# Reinstall Husky
npm run prepare
```

**Tests failing:**
```bash
# Ensure server is running for integration tests
npm start
# In another terminal
npm run test:integration
```

**Docker build fails:**
```bash
# Clear Docker cache
docker system prune -a
npm run docker:build
```

## 📚 Resources

- **Documentation**
  - [AUTOMATION.md](AUTOMATION.md) - Full automation guide
  - [SETUP.md](SETUP.md) - Setup instructions
  - [SECURITY.md](SECURITY.md) - Security guidelines
  - [README.md](README.md) - Project overview

- **External Resources**
  - [Printify API Docs](https://developers.printify.com/)
  - [Express.js Guide](https://expressjs.com/)
  - [ESLint Rules](https://eslint.org/docs/rules/)
  - [Prettier Options](https://prettier.io/docs/en/options.html)

## 🎯 Code Review Checklist

Before submitting, verify:

- [ ] Code follows project style
- [ ] All tests pass locally
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Comments explain complex logic
- [ ] Security best practices followed
- [ ] Documentation updated if needed
- [ ] Commit messages are descriptive
- [ ] Branch is up to date with main

## 🙏 Questions?

- Create a GitHub issue
- Tag with "question" label
- Provide context and background

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC).

---

**Thank you for contributing!** 🎉

Your contributions help make this project better for everyone.
