# Enough - Social Share Tool

Create custom word graphics and share them on social media.

## Features

- **Word input**: Type a word to generate a custom graphic
- **Content moderation**: Filters profanity, insults, and abusive content (using [obscenity](https://www.npmjs.com/package/obscenity))
- **Preview**: Canvas-rendered image with the word scaled to bleed off the edges and logo overlay
- **Share**: Download, or share to Facebook, X, LinkedIn, Threads, Bluesky; Web Share API on supported devices
- **Instagram**: Download the image and upload manually (no web API available)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Assets

- **Logo**: Add `public/logo.png` (or use the placeholder `public/logo.svg`)
- **Font**: Uses Bebas Neue from Google Fonts; replace in `app/globals.css` for a custom font

## Environment

- `NEXT_PUBLIC_FACEBOOK_APP_ID`: Optional. Set for Facebook Share Dialog. Create an app at [developers.facebook.com](https://developers.facebook.com).

## API

- `POST /api/moderate`: Body `{ "text": "..." }`. Returns `{ allowed: boolean, reason?: string }`.
