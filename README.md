# SkipIt website

Source for [skipit.space](https://skipit.space): a static Next.js site, exported and published on GitHub Pages by `.github/workflows/nextjs.yml` on every push to `main`.

## Development

```bash
npm install
```

```bash
npm run dev
```

The site runs at http://localhost:3000.

## Publishing a tool

All tools live in [`lib/tools.ts`](lib/tools.ts). Add an entry at the top of the list (newest first) with its release links; the home page, the hero orbit and `/tools` all read from it. A tool can have several downloads (for example Windows + Android). Set `isNew: true` on the latest one and remove it from the previous one.

## Request form

The "Request a tool" form posts to a Cloudflare Worker that emails the request through Resend. The worker lives in [`worker/`](worker/README.md), together with the deploy steps. Until it is deployed, the form falls back to opening the visitor's email app or copying the message.
