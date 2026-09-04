# Base44 Dev Environment

This is a **pure static site** — a single `index.html` (the "NextToYou" portfolio page) plus `cursor.js` (a canvas mouse-trail effect). There is no build step, no backend, no package manager, and no external API. All links are outbound (SoundCloud, YouTube, etc.).

## Running

```
docker compose -f docker-compose.base44.yml up -d
```

Serves the repo root over `python -m http.server` (bind-mounted read-only) on host port 3000. No live-reload dev server; after editing `index.html`/`cursor.js`, call `reload_preview` so the iframe picks up the change.

## Why python http.server (not nginx)

The host repo directory is mode `700`, so nginx's non-root worker cannot traverse it. `python:3.12-slim` runs as root and reads the bind mount fine.

## Verifying

- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` → 200, `<title>NextToYou</title>`
- `curl -sf http://localhost:3000/cursor.js` → 200

## Secrets

None required.
