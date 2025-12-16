# ✂️ URL Shortener

A fast, full-featured URL shortener built with **Next.js 14**, **Redis**, and deployed on **Vercel**.

---

## Features

- 🔗 **Instant URL shortening** — paste a long URL and get a short one in seconds
- ✏️ **Custom slugs** — choose your own short link path (e.g. `/my-link`)
- 📊 **Click analytics** — track how many times each link has been clicked
- ⏱️ **Link expiration** — set an expiry date/time; expired links return a 410 Gone
- 🔒 **Password protection** — secure links with a bcrypt-hashed password

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Redis (Upstash in production) |
| Auth | bcryptjs (password hashing) |
| ID generation | nanoid |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── shorten/
│   │   │   └── route.ts        # POST  — create a short link
│   │   ├── r/[slug]/
│   │   │   └── route.ts        # GET   — redirect + count click
│   │   └── links/[slug]/
│   │       └── route.ts        # GET   — fetch link stats
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main UI
├── components/
│   ├── ShortenForm.tsx          # URL input form
│   ├── ResultCard.tsx           # Short link result display
│   └── StatsCard.tsx            # Analytics lookup
└── lib/
    ├── redis.ts                 # Redis client
    └── links.ts                 # Data helpers (create, get, increment, verify)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Redis instance (local or [Upstash](https://upstash.com))
- [Vercel CLI](https://vercel.com/docs/cli) (for deployment)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your REDIS_URL and NEXT_PUBLIC_BASE_URL

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file at the root of the project:

```env
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production on Vercel, set these in **Project → Settings → Environment Variables**:

```env
REDIS_URL=rediss://default:your-password@your-endpoint.upstash.io:6379
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

---

## API Reference

### `POST /api/shorten`

Create a new short link.

**Request body:**
```json
{
  "url": "https://example.com/very-long-url",
  "slug": "my-link",
  "password": "secret123",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```
> `slug`, `password`, and `expiresAt` are all optional.

**Response:**
```json
{
  "success": true,
  "link": {
    "url": "https://example.com/very-long-url",
    "slug": "my-link",
    "shortUrl": "https://your-app.vercel.app/r/my-link",
    "clicks": 0,
    "createdAt": "2026-03-17T10:00:00.000Z",
    "expiresAt": "2026-12-31T23:59:59.000Z"
  }
}
```

---

### `GET /api/r/[slug]`

Redirect to the original URL and increment the click count.

- Returns **302** redirect on success
- Returns **401** if the link is password protected (pass password via `x-link-password` header)
- Returns **404** if the slug doesn't exist
- Returns **410** if the link has expired

---

### `GET /api/links/[slug]`

Fetch stats for a short link.

**Response:**
```json
{
  "slug": "my-link",
  "url": "https://example.com/very-long-url",
  "shortUrl": "https://your-app.vercel.app/r/my-link",
  "clicks": 42,
  "createdAt": "2026-03-17T10:00:00.000Z",
  "expiresAt": "2026-12-31T23:59:59.000Z",
  "hasPassword": false,
  "isExpired": false
}
```

---

## Deploying to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "feat: url shortener"
git push

# 2. Link to Vercel
vercel link

# 3. Add environment variables
vercel env add REDIS_URL
vercel env add NEXT_PUBLIC_BASE_URL

# 4. Deploy
vercel --prod
```

---

## Data Model

Each link is stored as a Redis hash under the key `link:{slug}`:

```
link:my-link → {
  url:       "https://example.com/..."
  slug:      "my-link"
  clicks:    "42"
  createdAt: "2026-03-17T10:00:00Z"
  expiresAt: "2026-12-31T23:59:59Z"   (optional)
  password:  "$2b$10$..."              (optional, bcrypt hash)
}
```

Links with an expiry date automatically get a Redis TTL set, so they are cleaned up from storage after expiration.

---

## License

MIT
