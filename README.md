# Neuralcosmology

A new layer of perception. A system of reality navigation through states, memory, and attention.

## About

Neuralcosmology explores the intersection of neural networks and cosmic structures. The patterns of the universe mirror the patterns of consciousness. This project provides a framework for understanding and navigating reality without mysticism—just presence, pattern, and decision.

Key principles:
- You're not in the world. You are the structure.
- Linear life is fiction. Every moment is a fork.
- No outer sign matters if your inner state is off.
- You don't carry the past. You loop it.

## Development

This is a [Next.js](https://nextjs.org) project with modern UI/UX design patterns, fluid animations, and optimized performance.

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment

The project is configured for automated deployment via GitHub Actions with Docker and Traefik.

### Quick Deploy

1. Push to `main` branch triggers automatic deployment
2. GitHub Actions builds Docker image and pushes to Docker Hub
3. Self-hosted runner deploys to server via `docker-compose`
4. Traefik automatically handles SSL certificates via Let's Encrypt

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Requirements

- Docker and Docker Compose
- Traefik running on server with `traefik-global` network
- Self-hosted GitHub Actions runner
- Docker Hub credentials configured as GitHub Secrets

## Security

- ✅ **CVE-2025-55182**: Fixed (Next.js 16.0.8 includes security patch)
- ✅ **React Server Components**: Secure version in use
- ✅ **Dependencies**: Regularly updated and audited

### Tech Stack

- **Framework**: Next.js 16.0.8 with App Router
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion
- **Particle Effects**: tsParticles
- **Deployment**: Docker + GitHub Actions + Traefik
- **SSL**: Let's Encrypt (automatic)

## SEO Considerations

The site is optimized for search engines with:

- Comprehensive metadata in `layout.tsx`
- OpenGraph and Twitter card images for social sharing
- Structured data with Schema.org markup
- Responsive design for all devices
- Optimized Core Web Vitals
- Sitemap and robots.txt

### Social Sharing

When sharing links to neuralcosmology.com on social media, they will display rich previews with:

- Title: "Neuralcosmology - Navigate Reality Through States, Memory & Attention"
- Description: "You're not in the world. You are the structure. A system of reality navigation through states, memory, and attention."
- Visual: Custom OG image displaying cosmic theme

### Quotes on social media

Once a day the site posts a quote from the books to Telegram, Threads and a Facebook Page. Each post is the quote card (the same PNG the reader's "Share" button makes), the quote signed with the author and book, and a link to the exact paragraph it comes from.

- **Where the quotes come from.** Claude reads a chapter and suggests a few lines that make sense on their own. Every line is checked against the chapter word for word; anything that isn't there is dropped. Accepted lines are saved as ordinary shared quotes (`/q/{id}`), so the link and the card work like any reader's share.
- **Setting it up.** The author opens **Account → Quotes on social media** (`/ru/account/social`, only for `AUTHOR_EMAILS`). Telegram: create a bot with @BotFather, make it a channel admin, paste its token and the channel name. Threads and Facebook: press "Connect" and sign in with Meta. Each account has its own quote language, posting hour and time zone. Tokens are stored in the database encrypted with a key derived from `SESSION_SECRET`.
- **Threads and Facebook need a Meta app** (Threads API use case and Facebook Login with `pages_manage_posts`). Put `THREADS_APP_ID`/`META_APP_ID` in repository variables and `THREADS_APP_SECRET`/`META_APP_SECRET` in secrets; register the redirect URIs `https://neuralcosmology.com/api/admin/social/callback/threads` and `…/callback/facebook`.
- **A post goes out at most once.** Each account gets one slot per day, held by a unique database row, so a second server or a repeated run can't post again. A post is retried only when the network clearly refused it (up to three times). If the network didn't answer, the post is marked "outcome unknown" and never retried automatically; the author checks the feed and marks it.
- The author sees the upcoming queue and can remove any quote before it goes out, post right away, or pause an account. `SOCIAL_AUTOPOST=off` stops the schedule.

## For AI agents

AI agents can read the site and buy books for a reader:

- Every page is also markdown: add `.md` to the URL, or send `Accept: text/markdown`.
- `/llms.txt`, `/llms-full.txt`, `/catalog.json`, `/.well-known/mcp.json`.
- MCP server: `/mcp` is open to any agent (search, read, list books, open a checkout tied to the reader's email). `/mcp/account` acts for a reader who signed in with INITE: the agent's MCP client signs them in by itself, their books read in full, and an order is paid straight from their INITE wallet if they allowed this site (switched on by `WALLET_PAY_ENABLED=1`).

In ChatGPT, Claude and other clients that show MCP Apps, `list_books` comes as a card with covers, prices and a Buy button, and `create_checkout` as an order card with every way to pay (INITE wallet, card or PIX). Other clients get the same data as text.

The plumbing comes from the shared INITE packages (inite-shared): `@inite/mcp/site`, `@inite/billing/purchases` and `@inite/content/ai`. This site builds with npm, so they live as tarballs in `vendor/`. To update them from inite-shared `main`:

```bash
node scripts/sync-inite-shared.mjs   # then commit vendor/, package.json, package-lock.json
```

## Project Structure

```
├── .github/workflows/    # GitHub Actions workflows
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/              # Utility functions
├── public/               # Static assets
├── Dockerfile            # Docker image configuration
├── docker-compose.yml    # Docker Compose configuration
└── DEPLOYMENT.md         # Detailed deployment guide
```

## License

[MIT License](LICENSE)

## Contact

Visit [neuralcosmology.com](https://neuralcosmology.com) for more information.
