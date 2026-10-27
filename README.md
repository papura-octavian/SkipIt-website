<p align="center">
  <img src="public/skipit-icon.png" alt="SkipIt" width="360">
</p>

<p align="center">
  <b>Simple tools for real problems.</b><br>
  Small, focused, open-source apps for Windows, Android, Raspberry Pi and the web.<br>
  No accounts, no subscriptions.
</p>

<p align="center">
  <a href="https://skipit.space"><b>skipit.space</b></a>
</p>

---

This repository is the source of [skipit.space](https://skipit.space), the place where every SkipIt tool can be downloaded or opened. It is a static Next.js site, published on GitHub Pages on every push to `main`.

## Tools

| Tool | What it does | Platforms |
|---|---|---|
| [TailControl](https://github.com/papura-octavian/tailcontrol) | Wake, shut down, lock or sleep your own PCs from your phone, over Tailscale | Android, Windows, Raspberry Pi |
| [Verset Finder](https://versetfinder.study) | Instant Bible search with notes, highlights and a sermon editor | Web |
| [PocketSync](https://github.com/papura-octavian/PocketSync) | Move files between PC and phone, both ways | Windows, Android |
| [OmniView](https://github.com/papura-octavian/OmniView) | Open HEIC, AVIF, TIFF, HEVC and 25+ formats without system codecs | Windows |
| [PitchChanger](https://github.com/papura-octavian/Pitch_changher) | Shift the pitch of audio and video by up to ±24 semitones, boost quiet tracks | Windows |
| [Vers2Go](https://github.com/papura-octavian/Vers2Go) | Turn song lyrics into PowerPoint slides, with verses, choruses, bridge and coda | Windows |
| [Media Saver](https://github.com/papura-octavian/Media-Saver) | Download playlists and long videos as MP3 or MP4 | Windows |

Missing something? [Request a tool](https://skipit.space/contact/).

## How the site works

- **Next.js 16** with static export, **Tailwind CSS 4** and **Framer Motion**.
- Every tool is defined once in [`lib/tools.ts`](lib/tools.ts). The home page, the hero and `/tools` all read from that list.
- The "Request a tool" form posts to a small **Cloudflare Worker** ([`worker/`](worker/README.md)) that emails the request through **Resend**. If the worker can't be reached, the form offers to open the visitor's email app or copy the message instead.

## Development

```bash
npm install
```

```bash
npm run dev
```

The site runs at http://localhost:3000.

## Publishing a tool

1. Add an entry at the top of the list in [`lib/tools.ts`](lib/tools.ts) (newest first).
2. Put the release download links in `downloads`. A tool can have several (for example Windows + Android). For a web app, use the `Web` platform and the site's URL.
3. Set `isNew: true` on it and remove it from the previous tool.
4. Push to `main`. The site is live about a minute later.
