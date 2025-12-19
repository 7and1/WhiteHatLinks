# WhiteHatLinks - Premium Backlink Acquisition Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload-3.63-purple)](https://payloadcms.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-orange)](https://workers.cloudflare.com/)

**Production-ready SaaS platform for high-authority backlink acquisition with transparent metrics and white-hat SEO practices.**

---

## 🚀 Features

### Core Functionality
- **16,000+ Vetted Sites**: Browse high-quality guest post opportunities
- **Advanced Filtering**: 8 filter criteria (niche, DR, price, spam score, traffic, link type, region)
- **Real-Time Inventory**: Live availability with transparent metrics
- **Inquiry System**: Automated email notifications with Resend integration
- **Content Management**: Payload CMS with D1 database

### SEO & Performance
- **Comprehensive SEO**: 7 Schema.org types, dynamic sitemap, OG images
- **Smart Caching**: ISR strategy with intelligent revalidation
- **Edge Deployment**: Cloudflare Workers with global CDN
- **Type-Safe**: 100% TypeScript with zero `any` types
- **Security**: CSP nonce-based scripts, rate limiting, honeypot protection

### Developer Experience
- **Modern Stack**: Next.js 15, React 19, TypeScript 5.7
- **Testing**: Vitest + Testing Library with 100% critical path coverage
- **CI/CD**: GitHub Actions with automated deployment
- **Monitoring**: Structured logging ready for Sentry integration

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Quick Start

### Prerequisites

- **Node.js**: >= 20.9.0
- **pnpm**: ^9 || ^10
- **Cloudflare Account**: For D1 and R2
- **Resend Account**: For email notifications

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/whitehatlinks.git
cd whitehatlinks

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your secrets

# Run database migrations
pnpm payload migrate

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the app.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.4 (App Router, RSC)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4 + Custom Components
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)
- **Validation**: Zod 4.2

### Backend
- **CMS**: Payload CMS 3.63
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Email**: Resend
- **Deployment**: Cloudflare Workers + OpenNext.js

### Development
- **Language**: TypeScript 5.7
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm

---

## 📁 Project Structure

```
WhiteHatLinks/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (frontend)/           # Public-facing routes
│   │   │   ├── (marketing)/      # Landing, services, pricing
│   │   │   ├── (shop)/           # Inventory browsing
│   │   │   ├── (content)/        # Blog, FAQ, industries
│   │   │   └── (legal)/          # Terms, privacy
│   │   ├── (payload)/            # CMS admin routes
│   │   ├── api/                  # API endpoints
│   │   │   ├── inquire/          # Inquiry submission
│   │   │   └── contact/          # Contact form
│   │   ├── og/                   # Dynamic OG images
│   │   ├── robots.ts             # SEO robots.txt
│   │   └── sitemap.ts            # Dynamic sitemap
│   ├── collections/              # Payload collections
│   │   ├── Inventory.ts          # Backlink inventory
│   │   ├── Posts.ts              # Blog articles
│   │   ├── Pages.ts              # Static pages
│   │   ├── Media.ts              # File uploads
│   │   └── Users.ts              # Admin auth
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── seo/                  # Schema.org components
│   │   ├── inventory/            # Inventory-specific
│   │   └── ErrorBoundary.tsx     # Error handling
│   ├── lib/
│   │   ├── inventory-source.ts   # Inventory data layer
│   │   ├── validation.ts         # Zod schemas
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── email.ts              # Email service
│   │   └── error-tracking.ts     # Error monitoring
│   ├── data/
│   │   └── industries.ts         # Industry metadata
│   ├── migrations/               # D1 migrations
│   ├── test/                     # Test utilities
│   ├── middleware.ts             # CSP & security headers
│   └── payload.config.ts         # CMS configuration
├── public/                       # Static assets
├── .github/workflows/            # CI/CD pipelines
├── vitest.config.ts              # Test configuration
├── next.config.ts                # Next.js config
├── open-next.config.ts           # Cloudflare adapter
├── tailwind.config.ts            # Styling config
├── tsconfig.json                 # TypeScript config
└── wrangler.jsonc.example        # Cloudflare config template
```

---

## ⚙️ Environment Setup

### Required Environment Variables

```bash
# Payload CMS (Required)
PAYLOAD_SECRET="<generate with: openssl rand -hex 32>"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"

# Email Service (Required for production)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"

# Cloudflare (Set via wrangler secrets in production)
# D1_DATABASE_ID - auto-configured via wrangler.jsonc
# R2_BUCKET_NAME - auto-configured via wrangler.jsonc
```

### Setting Production Secrets

```bash
# Set Payload secret
wrangler secret put PAYLOAD_SECRET

# Set Resend API key
wrangler secret put RESEND_API_KEY
```

### Cloudflare Configuration

Copy and configure wrangler settings:

```bash
cp wrangler.jsonc.example wrangler.jsonc
# Edit wrangler.jsonc with your:
# - account_id
# - database_id (from `wrangler d1 create`)
# - bucket_name (from `wrangler r2 bucket create`)
```

---

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm preview          # Preview Cloudflare Workers build

# Database
pnpm payload migrate  # Run migrations
pnpm payload          # Payload CLI

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # Coverage report

# Code Quality
pnpm lint             # ESLint check
pnpm tsc --noEmit     # Type check

# Deployment
pnpm deploy           # Deploy to Cloudflare (DB + App)
pnpm deploy:app       # Deploy app only
pnpm deploy:database  # Deploy database only
```

### Local Development Workflow

1. **Start dev server**: `pnpm dev`
2. **Access admin**: `http://localhost:3000/admin`
3. **Create admin user**: Follow Payload CMS setup
4. **Seed data**: Import inventory via admin panel
5. **Test locally**: Run `pnpm test`

### Hot Reload

- ✅ Components: Auto-reload
- ✅ API routes: Auto-reload
- ✅ Middleware: Auto-reload
- ⚠️ Payload config: Requires restart

---

## 🚢 Deployment

### GitHub Actions (Recommended)

Automated deployment on push to `main`:

```yaml
# .github/workflows/deploy.yml
- Checkout code
- Install dependencies
- Generate wrangler config
- Build with OpenNext
- Deploy to Cloudflare Workers
```

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `PAYLOAD_SECRET`
- `RESEND_API_KEY`

### Manual Deployment

```bash
# 1. Build the application
pnpm build

# 2. Run database migrations
pnpm deploy:database

# 3. Deploy to Cloudflare Workers
pnpm deploy:app
```

### Post-Deployment Checklist

- [ ] Verify DNS settings
- [ ] Test all API endpoints
- [ ] Check email delivery (Resend)
- [ ] Verify D1 database access
- [ ] Test R2 file uploads
- [ ] Run Lighthouse audit
- [ ] Monitor error rates

---

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Validation, utilities, helpers
- **Component Tests**: UI components, forms
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user flows

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Specific file
pnpm test src/lib/validation.test.ts
```

### Writing Tests

```typescript
// src/lib/example.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from './example'

describe('myFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected)
  })
})
```

---

## 📚 API Documentation

### POST `/api/inquire`

Submit inventory inquiry.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "url": "https://example.com",
  "message": "Interested in DR 70+ sites",
  "budget": "3000-5000",
  "itemId": "123",
  "source": "inventory"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Your request has been received..."
}
```

**Rate Limit**: 5 requests/minute per IP

### POST `/api/contact`

Submit contact form.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Partnership inquiry",
  "message": "I'd like to discuss..."
}
```

**Rate Limit**: 3 requests/minute per IP

---

## 🔒 Security

- **CSP**: Nonce-based script execution
- **Rate Limiting**: Per-IP request throttling
- **Honeypot**: Bot prevention on forms
- **Input Validation**: Zod schema validation
- **HTTPS Only**: Enforced via Cloudflare
- **Headers**: Security headers via middleware

---

## 🎨 Customization

### Styling

Modify Tailwind configuration:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b5bdb', // Change brand color
      },
    },
  },
}
```

### Email Templates

Edit email templates in `/src/lib/email.ts`:

```typescript
function generateInquiryEmailHTML(data: InquiryEmailData): string {
  // Customize HTML template
}
```

---

## 📊 Monitoring

### Recommended Tools

- **Error Tracking**: Sentry (integration ready)
- **Analytics**: Cloudflare Web Analytics
- **Performance**: Vercel Speed Insights
- **Uptime**: UptimeRobot

### Structured Logging

```typescript
import { logError } from '@/lib/error-tracking'

logError('API_ERROR', error, { context: 'user-action' })
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Payload CMS](https://payloadcms.com/) - Headless CMS
- [Cloudflare](https://workers.cloudflare.com/) - Edge deployment
- [Resend](https://resend.com/) - Email API

---

## 📞 Support

- **Email**: hello@whitehatlink.org
- **Documentation**: [docs.whitehatlink.org](#)
- **Issues**: [GitHub Issues](https://github.com/your-org/whitehatlinks/issues)

---

**Made with 💙 by the WhiteHatLinks Team**
