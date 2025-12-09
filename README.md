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
