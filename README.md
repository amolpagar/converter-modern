# DevToolBox — Free Online Developer Tools

A modern, fast, and privacy-first suite of developer tools built with Next.js 14, TypeScript, and Tailwind CSS. Designed for Vercel deployment.

## Features

### Converters
- **XML ↔ JSON** — Bidirectional conversion with attribute handling
- **YAML ↔ JSON** — Full YAML 1.2 support including anchors/aliases
- **HTML ↔ Pug** — Convert between HTML and Pug (Jade) templates
- **JSON → JSON Schema** — Generate Draft-07 schemas from sample data
- **JSON → ION** — Convert to Amazon ION text format
- **Text → JSON** — Parse key-value mappings with auto type detection

### Formatters
- **JSON** — Format, beautify, validate, and minify
- **XML** — Pretty-print with customizable indentation
- **HTML** — Clean up messy HTML markup
- **CSS** — Format stylesheets with proper structure
- **JavaScript** — Beautify minified JS code

### Decoders
- **Base64** — Encode/decode with full UTF-8 support
- **JWT** — Decode tokens, inspect headers/payloads/claims

### Utilities
- **Code Compare** — Side-by-side diff with highlighted changes

## Architecture

```
src/
├── app/              # Next.js App Router pages
│   ├── [tool]/       # Dynamic route for all tools (SSG)
│   ├── api/          # Server-side API routes
│   └── ...           # Static pages (about, contact, faq)
├── components/       # React components
│   ├── layout/       # Header, Footer
│   ├── editor/       # CodeMirror editor wrapper
│   ├── converter/    # Tool layout components
│   └── ads/          # Ad banner placeholders
├── lib/              # Core logic
│   ├── converters/   # All conversion functions
│   ├── formatters/   # All formatting functions
│   ├── tools.ts      # Tool configuration registry
│   ├── logger.ts     # Structured logging
│   ├── rate-limit.ts # API rate limiting
│   └── utils.ts      # Utility functions
└── middleware.ts      # Security headers, CORS
```

### Key Design Decisions

1. **Client-side first**: Most conversions run in the browser (zero API cost, instant results, full privacy). Only Pug ↔ HTML requires server-side processing.

2. **Data-driven tools**: All tools are defined in `src/lib/tools.ts`. Adding a new tool means adding an entry to the config + implementing the conversion function. The dynamic `[tool]` route handles rendering.

3. **SEO optimized**: Static generation, JSON-LD structured data, FAQ schema, dynamic sitemap, legacy URL redirects, comprehensive meta tags.

4. **Vercel-ready**: Zero-config deployment. Serverless API routes with rate limiting. Security headers via middleware.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables (see `.env.example`)
4. Deploy — that's it!

## Monetization

The app is monetized through ads and affiliate marketing:

### 1. Google AdSense
- Ad banner component (`AdBanner`) with horizontal, vertical, and rectangle formats
- Placeholders on homepage and tool pages
- Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in environment variables

### 2. Google Analytics
- Ready-to-activate GA4 integration in `layout.tsx`
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in environment variables

### 3. Affiliate Marketing
- Recommendations for developer tools (Vercel, Postman, GitHub Copilot, etc.)
- Replace URLs with your affiliate links

### 4. Newsletter
- Email collection in the footer
- Connect to Mailchimp, ConvertKit, or Resend for email marketing

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense publisher ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_APP_URL` | Production URL (for SEO/sitemap) |
| `RATE_LIMIT_RPM` | API rate limit (requests per minute, default: 60) |
| `LOG_LEVEL` | Logging level: debug, info, warn, error |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: CodeMirror 6
- **Icons**: Lucide React
- **Toasts**: Sonner
- **Theme**: next-themes (dark/light)
- **Deployment**: Vercel

## Legacy Migration

This project is a complete rewrite of the original Express.js application. All legacy URLs (`/xmltojson`, `/jsontoxml`, etc.) are automatically redirected to the new clean URLs (`/xml-to-json`, `/json-to-xml`) via permanent 301 redirects configured in `next.config.mjs`.

## License

MIT
