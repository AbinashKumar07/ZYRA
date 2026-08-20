# ZYRA — Product Requirements Document

## Original problem statement
Build ZYRA: a production-quality, responsive, premium **pre-launch fashion-commerce website** for a hyperlocal fashion marketplace preparing to launch in Delhi NCR (Delhi, Gurugram, Noida). Visual identity: Luxury Black + Purple Technology. Tagline: **LOOK YOUR BEST. TODAY.** The strongest asset must be **PAIR**. Must serve customers, merchants, investors and general audience, with strict honesty rules: no fake testimonials, statistics, merchants, funding, reviews, contact details or checkout; all catalogue content labelled Preview / Sample.

## Architecture
- **Frontend**: React 19 (CRA + craco), react-router-dom 7, Tailwind (custom black/purple token layer in `index.css`), sonner toasts, lucide-react icons. Fonts: Bricolage Grotesque (display) + Manrope (body).
- **Backend**: FastAPI + Motor/MongoDB. All routes prefixed `/api`. bcrypt password hashing, PyJWT access tokens (8h), per-IP rate limiting on the public lead endpoint, brute-force lockout on login, server-side Pydantic validation.
- **Data**: demo catalogue is static and data-driven in `/app/frontend/src/data/catalog.js` (26 products, 8 pairs, 10 looks, 10 themes, 13 FAQs). Leads persist in MongoDB `leads` collection.

## User personas
1. **Customer** (primary) — wants to stop deciding what to wear.
2. **Merchant** (secondary) — local fashion store wanting reach beyond the storefront.
3. **Investor / strategic partner** (third) — evaluating the model.
4. **General audience / future team** — mission, founder, philosophy.

## Core requirements (static)
- 16 routes + `/search`, `/product/:id`, `/pairs/:id`, `/admin`, 404.
- PAIR as the signature interactive experience (colour + size selection, marketplace availability messaging).
- Occasion-first discovery, Complete Looks, accessories cross-selling, Trending preview catalogue, Theme Specials, two-service Tailoring model.
- Four lead forms stored in the backend: waitlist, merchant, investor, contact.
- Protected admin dashboard for leads.
- Pre-launch honesty: no fabricated facts; placeholders where information is unavailable.
- WCAG-minded accessibility, mobile-first responsiveness, reduced-motion support, SEO metadata + OG + sitemap + robots.

## Implemented (June 2026)
- Full 20-route site with sticky transparent→solid navbar, mobile drawer, mobile sticky CTA, footer with all six link columns and launch-geography block.
- Homepage in the specified 17-section order, including interactive `PairShowcase`, occasion picker, trending grid, accessories cross-sell, tailoring, fulfilment, themes, merchant, investor, founder, books, FAQ and waitlist.
- `/pairs` with sorting (Trending/New/Price/Occasion) and filters (occasion, colour, style, price) plus grouped Featured/Occasion/Trending/Colour/Premium/Seasonal rows.
- `/search` with working query + 7 filters, skeleton loading, empty state.
- `/product/:id` with colour/size, material/fit, pair + accessory recommendations, availability message, service options, and an "Add to ZYRA Bag" that only shows a launch toast (no fake checkout).
- Founder page with exact supplied bios, philosophy quote, experience, and labelled photo/book-cover placeholders and disabled book CTAs.
- Four legal pages written for a pre-launch marketplace.
- Backend: `POST /api/leads`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/admin/leads`, `GET /api/admin/stats`, `PATCH /api/admin/leads/{id}`; admin seeded from env on startup.
- Admin dashboard at `/admin` with stats, per-type tabs, status updates.
- SEO: per-page title/description/canonical/OG/Twitter, JSON-LD Organization, favicon, OG card, `sitemap.xml`, `robots.txt` (disallows `/admin`).
- QA: backend 16/16 pytest passing; all frontend flows verified by the testing agent. Fixed nested-`<p>` warning, X-Forwarded-For lockout key, ObjectId token guard.

## Backlog
### P0
- Replace the temporary typographic wordmark with the final brand identity when it exists.
- Verify a sending domain for email so booking confirmations reach customers (internal alerts already deliver).
### P1
- Move the lead rate limiter and login lockout to a shared store so limits hold across replicas.
- Per-content-type schema validation on CMS `data` payloads.
- CSV export of leads and bookings.
### P2
- Real merchant inventory model + merchant self-serve dashboard.
- Instant Fit / Custom Tailoring booking flow with date-time selection.
- Cart, checkout and payments; city expansion beyond Delhi NCR.

## Next tasks
1. Verify an email sending domain so customers receive booking confirmations.
2. Add CSV export for leads and bookings.
3. Swap in the final ZYRA logo when the brand identity is finalized.

## Change log
- **June 2026 (update 1)** — Wired real founder assets: Abinash Kumar's photograph on `/founder` and the homepage founder section; both books use their real title-page covers rendered from the supplied PDFs, real subtitles/authors, factual descriptions and working "Explore the Book" links. Books data centralised in `BOOKS` in `catalog.js`.
- **June 2026 (update 2)** — Four approved features shipped:
  - **Email lead alerts**: every waitlist / merchant / investor / contact submission fires a branded alert email via the Emergent managed email integration. Recipients come only from `LEAD_ALERT_RECIPIENTS`; no endpoint accepts a recipient or HTML. Sends are fire-and-forget so a mail failure never breaks a form. Leads store timestamp, source, type and status.
  - **Books stay on the Founder page**: premium `BookCard` with cover, subtitle, credit, description, real chapter highlights taken from each book's printed contents, and a "Read Preview" modal showing only the title page + contents (no unlicensed body text, no separate book route).
  - **Admin CMS** at `/admin`: create / edit / publish / archive / reorder / delete Products, PAIRS, Looks, Themes, FAQs and homepage content, with draft→published states, one-click "Import preview catalogue", and role-based permissions (admin / editor / viewer / tailor) enforced by a single `authorize()` decision point with an audit log. Published CMS items override the built-in preview collection via `CatalogProvider`; the site is never empty.
  - **Custom Tailoring booking**: 5-step flow (garment → service → date → slot → measurements → details) on `/tailoring#book`. Slots come from what partners actually opened; a request with no free partner returns 409. Bookings are created as `awaiting_tailor` and are never described as confirmed until a partner accepts in the separate `/tailor` console (accept/decline, race-guarded, with a reference tracker). Estimate ranges are configurable per garment/service/city in the admin. Instant Fit deliberately stays a separate availability-based service.
  - Backend split into `server.py`, `auth.py`, `models.py`, `email_service.py`, `routes_public.py`, `routes_admin.py`, `routes_tailor.py`. 37/37 backend tests pass; all frontend flows verified.
