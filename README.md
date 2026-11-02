# MEHFIL AI

**Jab Dard Lafzon Mein Dhalta Hai.**
*When pain finds its way into words.*

MEHFIL AI is a poetry-generation studio, not a chatbot. It explores the emotional,
philosophical and literary universe of the researched qawwali repertoire and turns a
chosen emotion into original Urdu shayari through **three separate intelligence
engines** coordinated by an orchestrator. Its signature feature is **Us Dard Ko Likho**
("Write that pain"): pick a composition, understand its annotated emotional and
philosophical profile, choose what *you* feel, and receive a brand-new sher inspired by
its broad themes — never its words.

Originality standing: nothing in this repository stores, scrapes, transcribes or
reconstructs lyrics. Poetry is generated from research annotations and original
composition corpora authored for this project. The output is never presented as the
work of qawwali's singers or of any existing poet.

---

## The three intelligence engines

| Engine | Responsibility | Contract |
|---|---|---|
| **Qawwali Intelligence** (`src/engines/qawwali/`) | Retrieved research context for a composition: verified metadata, labeled interpretations, Sufi concepts, symbolic imagery, sources, confidence, coverage note. | `QawwaliContext` (JSON) |
| **Emotion Intelligence** (`src/engines/emotion/`) | Interprets the intention behind an emotion mix: primary/secondary, intensity, contradiction, register, direction, arc, fields, vocabulary. | `EmotionIntent` (JSON) |
| **Shayari Intelligence** (`src/engines/shayari/`) | Composes the poem itself — couplet selection, script rendering, titles, metaphor explanations — plus the local core provider used in demo mode. | `GeneratedShayari` (JSON) |
| **Quality gate** (`src/engines/quality/`) | Grammar/coverage evaluation, reference-corpus similarity screening, regeneration loop. | `QualityReport` (JSON) |

`src/engines/orchestrator.ts` is the only coordinator: request → Emotion → Qawwali →
Shayari (provider) → Quality → result. Engines exchange structured JSON only and never
reach into each other's internals.

Each engine keeps its own system prompt in `src/engines/prompts.ts` — the prompts govern
the Anthropic path; the local core implements the same contracts deterministically.

---

## Installation

Requirements: Node.js ≥ 20.9, npm ≥ 9.

```bash
npm install
cp .env.example .env.local   # optional — everything works unset
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Environment variables

| Variable | Purpose | Unset behavior |
|---|---|---|
| `ANTHROPIC_API_KEY` | Server-side Claude generation via the provider abstraction (`src/engines/providers/`). | Demo mode: the deterministic local core composes poetry; every result is labeled **DEMO · COMPOSED BY THE LOCAL CORE ENGINE**. The app never claims live AI generation happened. |
| `ANTHROPIC_MODEL` | Model override (default `claude-3-5-sonnet-20241022`). | Default model. |
| `MEHFIL_ADMIN_KEY` | Gate for protected admin research endpoints (`x-mehfil-admin-key` header). | Admin endpoints answer `501 admin-unconfigured`; the dashboard stays read-only. Public users can never reach administrative operations. |
| `MEHFIL_LOCAL_RESEARCH_WRITE` | `/api/admin/research` writes drafts to `research/research-queue.json` (dev/standalone). | Writes are refused with an explicit error. |

No key, token or credential ever ships to client-side code: all AI calls happen in
server-side route handlers behind validation, timeouts and rate limiting.

## Database setup

The shipped product persists **user data in browser storage only** (My Mehfil ledger,
history, collections — `src/lib/mehfil-storage.ts`). Nothing user-created leaves the
device.

A Supabase schema is shipped dormant for future adoption:
`supabase/migrations/0001_init.sql` (research corpus, annotations + pgvector embeddings,
sources, reviews, generation analytics, optional server-side saved shayari with RLS
policies). When you have a Supabase project:

```bash
supabase link --project-ref <ref>
supabase db push
```

Until wired, the migration is inert — demo mode is fully functional without it.

The research corpus itself is loaded from `research/corpus-seed.json` when present
(produced by the research ingestion pipeline), falling back to a small labeled sample
corpus (`src/engines/qawwali/corpus.ts`) so the app runs before research completes.

## Research ingestion guide

1. **Verify metadata** for a composition against credible public sources (metadata,
   scholarship, journalism). Drop anything you cannot verify — the system never
   fabricates. Never store lyrics, transcriptions or verse translations.
2. Add entries to `research/corpus-seed.json` in the shape documented by
   `src/engines/qawwali/corpus.ts` (`CorpusEntry`): `slug`, `verifiedTitle`,
   `alternateTitles`, `language`, `poeticTradition`, `attributedPoet` (may be `null`),
   an **interpreted** profile (emotions, progression, sufiConcepts, symbolicImagery,
   literaryCharacteristics), `researchStatus`, `annotationStatus`, `confidence`,
   `sources[]`, `coverageNote`.
3. Interpretations must be marked as interpretation — entries carry
   `researchStatus: "verified_metadata"` for the *metadata* and
   `annotationStatus: "sample_annotation"` until genuinely reviewed by an editor
   (`reviewed`).
4. The admin dashboard (`/admin`) shows statuses, completeness and a review queue.
   With `MEHFIL_ADMIN_KEY` set, `POST /api/admin/research` queues new drafts to
   `research/research-queue.json` for editorial promotion; lyrics-bearing payloads are
   rejected by shape.
5. The public UI always states partial coverage. Unresearched compositions are never
   presented as verified.

## AI provider configuration

The shayari generation step consults a provider abstraction:

- `local-core` — deterministic composer over the authored couplet corpus
  (`src/engines/shayari/couplets.ts` + the lexicon). Always available; output labeled
  demo. Structured intent → poem with no LLM.
- `anthropic-claude` — activates when `ANTHROPIC_API_KEY` is set
  (`src/engines/providers/index.ts`). Uses the Shayari Intelligence system prompt,
  requests structured output through a tool schema, and applies a 45 s timeout. On
  failure it falls back to the local core and the result is honestly labeled demo.

Emotion Intelligence and Qawwali Intelligence remain deterministic in both modes so
results are stable and testable; their system prompts document the intended LLM
behavior and their engines hold the same schema.

## Development commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
npm run test       # vitest — engines, pipeline, corpus coverage, security
npm run test:watch # vitest in watch mode
```

## Testing instructions

Vitest suites live in `tests/`:

- `tests/corpus.test.ts` — **fails the build if any roman token lacks a lexicon
  entry**, and checks script rendering and imagery glosses.
- `tests/emotion-engine.test.ts` — the ten required emotional combinations
  (Love+Anger, Betrayal+Pride, Separation+Devotion, Spirituality+Pain,
  Longing+Madness, Love+Helplessness, Loneliness+Hope, Anger+Heartbreak,
  Surrender+Spiritual Love, Nostalgia+Regret) each resolve to a coherent intent
  with a conflict narrative; register sanity at extreme intensities; sufi mode
  bending.
- `tests/qawwali-engine.test.ts` — no fabrication for unknown slugs; labeled
  provenance; corpus hygiene (sources + coverage notes, no lyrics fields); honest
  attribution (debated attribution stays unasserted).
- `tests/pipeline.test.ts` — every poetry form in every script; no couplet repetition
  inside a poem; seed determinism and seed wander; Us Dard Ko Likho context flow;
  all six refine actions; quality gate honesty (screening ≠ copyright clearance).
- `tests/security.test.ts` — input validation, lyrics rejection, rate limiting,
  client IP, poetry-form contract.

```bash
npm run test
```

Manual flows worth driving: `/studio` (generate → refine → translate → image
download), `/us-dard-ko-likho` (select → discover → choose → write), `/random-ishq`
(roll with filters), `/my-mehfil` (save → collections → delete), `/admin` (gate →
read-only), Urdu RTL rendering across Chromium/Firefox/WebKit-class browsers.

## Deployment guide

The app is a standard Next.js App Router server (Node runtime). Any Node host works
(Vercel, Fly.io, Render, a VPS behind nginx):

1. Set the env vars above in the host's environment (never in client bundles).
2. `npm ci && npm run build && npm start` (or the host's Next.js adapter).
3. Health check: `GET /api/qawwali` returns the corpus coverage JSON.
4. Rate limiting is per-process; put shared limits at the edge/proxy for multi-instance.
5. The admin endpoints are key-gated per instance — rotate `MEHFIL_ADMIN_KEY` instead
   of shipping it in images.

## Live deployment

- **GitHub:** https://github.com/drajeevreddy/mehfil-ai (public)
- **Vercel:** https://nfak-lirdoffkk-cardzey.vercel.app
- **API health:** `GET https://nfak-lirdoffkk-cardzey.vercel.app/api/qawwali`

## Supabase setup (manual)

The Supabase CLI is not available in this environment, so the project must be
provisioned manually:

1. Create a project at https://supabase.com
2. Run `supabase/migrations/0001_init.sql` in the SQL editor
3. Set env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `MEHFIL_ADMIN_KEY`
4. The admin API routes (`/api/admin/research`) and Row Level Security policies are
   already defined in the codebase and ready to use once Supabase is connected.

## Project structure

```
src/
  app/                    # App Router pages + API route handlers
    api/shayari/…         # generate, random, refine, translate, history
    api/qawwali/…         # catalog, profile, Us Dard Ko Likho entry
    api/admin/research/…  # key-gated research ingestion
    qawwali-universe/[id] # research profile pages
    studio, us-dard-ko-likho, random-ishq, my-mehfil, about, admin
  engines/
    emotion/ qawwali/ shayari/ quality/ providers/ prompts.ts orchestrator.ts
  components/chamber/ studio/ usdard/ landing/
  lib/                    # types, api-utils (validation/rate-limiting),
                          # mehil-storage (browser ledger), poetry-card (canvas export)
research/                 # corpus-seed.json + research-queue.json (not seeded into src)
supabase/migrations/      # dormant ready-to-apply schema
tests/                    # vitest suites
```

## Accessibility

Keyboard-navigable controls, semantic landmarks, focus rings in brass, ≥4.5:1 body
contrast, `prefers-reduced-motion` honored (petals override, motion-safe effects),
Nastaliq RTL rendering with `unicode-bidi: isolate`.

## Fonts & licensing

Display: **Cinzel** · Body: **EB Garamond** · Record/metadata: **Courier Prime** ·
Urdu: **Noto Nastaliq Urdu** · Devanagari: **Noto Serif Devanagari** — all SIL OFL,
loaded at build time via `next/font/google` and self-hosted by the app.

## Honest limitations

- The researched corpus is **partial by design**; coverage is always stated in the UI.
- `local-core` demo poetry is original but template-composed; with live credentials the
  Claude provider carries generation through the same structured contracts.
- Originality screening compares against this project's internal reference corpus. It
  is an internal quality gate — **not a copyright clearance**.
- User persistence is browser-only; clearing site data clears My Mehfil (stated in the
  UI).
