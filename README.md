# Chillflix — Movie search & discovery

A lightweight React + Vite app for discovering and searching movies using The Movie Database (TMDB) API, with an Appwrite-backed "trending" feature. This repo contains a small, optimized frontend experience that demonstrates practical techniques like debounced search, API auth handling, and Appwrite integration for tracking search popularity.

## Live demo

https://oxtochee.kesug.com/ (deployed from the `dist/` build)

## Highlights / Features

- Fast, client-rendered React app (Vite + React 19).
- Debounced search input to reduce TMDB API calls (uses `useDebounce` pattern).
- Discover (popular) and Search endpoints with automatic handling of v4 (Bearer) vs v3 (`api_key`) TMDB credentials.
- Trending section powered by Appwrite: records & ranks search terms and displays top items.
- Reusable UI components: `Search`, `MovieCard`, `Spinner`.
- Defensive handling for API responses and common React gotchas (unique `key` for lists, safe checks for arrays).

## Project structure (important files)

- `index.html`, `vite.config.js` — Vite bootstrap and config.
- `src/main.jsx` — Entry point.
- `src/App.jsx` — Main app: fetch logic, debouncing, trending, UI composition.
- `src/components/Search.jsx` — Search input component.
- `src/components/MovieCard.jsx` — Movie item component.
- `src/components/Spinner.jsx` — Loading spinner.
- `src/components/appwrite.js` — Appwrite SDK helpers (updateSearchCount, getTrendingMovies).
- `src/.env.local` or `./.env.local` — Local env file (NOT committed, contains secrets).
- `dist/` — Built static site (what was deployed).

## Environment / Secrets

The app reads configuration from Vite environment variables. Create a `.env.local` at the project root (not in `src/`) with the following values:

```
VITE_TMDB_API_KEY=your_tmdb_token_or_key
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_TABLE_ID=your_appwrite_table_id
```

Notes:

- `VITE_TMDB_API_KEY` can be either:
  - a TMDB v4 Read Access Token (JWT-like). In that case the app sends it as `Authorization: Bearer <token>`.
  - or a TMDB v3 API key (shorter), in which case the app appends `?api_key=<key>` to v3 endpoints.
- Vite only exposes env vars that begin with `VITE_` to the client bundle.
- Never commit `.env.local` to version control. Add it to `.gitignore`.

## Getting started (local dev)

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. Open the app at the address shown by Vite (usually `http://localhost:5173`).

## Build & deploy

Build a production static bundle:

```bash
npm run build
```

This produces a `dist/` folder which can be deployed to any static host (Vercel, Netlify, GitHub Pages, custom S3 + CDN, etc.). The site deployed at `https://oxtochee.kesug.com/` was produced by this `dist/` output.

If the site makes TMDB requests directly from the browser, remember that v3 keys are public when bundled. For privacy, proxy requests through a server.

## Common issues & troubleshooting

- 401 Unauthorized when calling TMDB

  - If you see 401, verify the token type: TMDB v4 tokens must be sent as `Authorization: Bearer <token>`. v3 API keys must be sent as `?api_key=KEY`.
  - Make sure your `.env.local` is at the project root and that you restarted Vite after editing env files.
  - Trim whitespace/newlines: env entries must be single-line values with no surrounding quotes.

## Implementation notes & rationale

- Debounced search: The `Search` input updates `searchTerm` on every keystroke. The app uses a debounce strategy (via `useDebounce`) so the app waits until the user stops typing before calling the TMDB search endpoint. This meaningfully reduces API calls and improves UX.

- Appwrite trending: Every time a successful search returns results, the app calls `updateSearchCount(searchTerm, movie)` to increment a counter in the Appwrite database (or create a new record). The `getTrendingMovies()` helper reads top documents ordered by `count` to populate a trending UI.

- TMDB auth handling: The app tries to be flexible: if the provided `VITE_TMDB_API_KEY` looks like a JWT (v4) it sends a `Bearer` header; otherwise it appends `api_key=` to the URL for v3 keys.

- Defensive programming: The app performs `response.ok` checks and fallbacks such as `data.results || []` to avoid runtime crashes when upstream responses are shaped unexpectedly.

## Contributing

Contributions are welcome. Please open an issue or PR. Keep secrets out of PRs. Use `.env.example` to show variable names without values.

## License

This project is provided as-is.
