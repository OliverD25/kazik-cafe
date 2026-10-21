# Kazik Coffee

Website for Kazik Coffee, a café chain in Khmelnytskyi, Ukraine
([@kazik_coffee](https://www.instagram.com/kazik_coffee/)).

Live: https://kazik.luminart.app

- `public/index.html` — main page: hero, what the café offers, gallery, request form.
- `public/locations.html` — the cafés on a map (Leaflet + OpenStreetMap).

Plain HTML, CSS and JavaScript; no build step. Served by a Cloudflare Worker with static assets.

```bash
npm install
npm run dev      # local preview on http://localhost:8791
npm run deploy   # publish to kazik.luminart.app
```

The request form posts to `FORM_ENDPOINT` in `public/script.js`; while it is empty,
the form points visitors to Instagram instead.
