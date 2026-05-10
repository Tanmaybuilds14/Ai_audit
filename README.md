# AI Spend Auditor

A free web app that audits your AI tool spend and provides defensible recommendations for optimization.

## Features
- **Instant Audit**: Hardcoded logic for per-tool optimizations.
- **AI Summary**: Personalized analysis generated via Anthropic Claude.
- **Lead Capture**: Secure email capture for full reports.
- **Shareable Reports**: Unique URLs for sharing audit results.
- **Modern UI**: Clean, responsive, high-contrast interface.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS.
- **Backend**: Node.js, Express, Anthropic SDK.

## Setup

### Prerequisites
- Node.js (v18+)
- Anthropic API Key (optional, fallback provided)

### Installation

1. Install dependencies for both client and server:
   ```bash
   npm install --prefix client
   npm install --prefix server
   ```

2. Configure environment variables:
   - Create a `server/.env` file based on `server/.env.example`.
   - Add your `ANTHROPIC_API_KEY`.

### Running the App

1. Start the backend:
   ```bash
   npm run dev --prefix server
   ```

2. Start the frontend:
   ```bash
   npm run dev --prefix client
   ```

3. Open your browser to `http://localhost:5173`.

## Audit Logic
The audit engine evaluates:
- **Plan Fit**: Are you on the right tier for your team size?
- **Redundancy**: Are you paying for Enterprise features when Pro suffices?
- **Alternatives**: Is there a cheaper tool that fits your specific use case?

Pricing data is verified as of May 2026 and documented in `PRICING_DATA.md`.
Prompts used for AI generation are in `PROMPTS.md`.
