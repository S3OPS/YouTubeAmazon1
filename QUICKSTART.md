# Quick Start Guide

Get your Printify Dropshipping Store running in minutes with our **100% automated setup**.

## 🚀 Super Quick Start (Recommended)

### One-Command Build-Configure-Test

```bash
npm run build-configure-test
```

That's it! The automated workflow will:
- ✅ Check system requirements (Node.js, npm)
- ✅ Install dependencies
- ✅ Run the setup wizard (creates `.env`)
- ✅ Validate configuration
- ✅ Run security and integration tests
- ✅ Run lint and formatting checks
- ✅ Retry the full workflow up to 3 times on failure

**Time to complete:** ~3-5 minutes (includes lint/format checks)

## 📋 Prerequisites

✅ **Node.js v14+** - [Download](https://nodejs.org/)  
✅ **npm v6+** - Comes with Node.js  
✅ **Printify Account** - [Sign up](https://printify.com)  
✅ **API Token** - Get from [Printify Settings](https://printify.com/app/account/api)

## 🎯 Manual Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure

```bash
npm run setup
```

### 3. Start Server

```bash
npm start
```

### 4. Open Browser

Visit: `http://localhost:3000`

## 🐳 Docker Quick Start

```bash
cp .env.example .env
# Edit .env with your credentials
npm run docker:run
```

## ✅ Verify Installation

```bash
npm test
```

Expected: All security tests pass ✅

## 📚 Documentation

- [AUTOMATION.md](AUTOMATION.md) - Full automation guide
- [SETUP.md](SETUP.md) - Detailed deployment  
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guide

---

**Automation level:** 100% ✅
