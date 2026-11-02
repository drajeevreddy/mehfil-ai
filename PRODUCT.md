# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router · React · TypeScript · Tailwind CSS · Framer Motion · Lucide React · Vitest. AI provider: Anthropic Claude API behind a provider abstraction (env-keyed), with a deterministic local engine as the demo-mode core. Persistence: browser storage (user choice) behind a repository interface; Supabase migrations shipped as ready-to-apply SQL for future adoption. Deploy target: Vercel-style Node host (documented, unconfirmed).

## Users

Primary users are Urdu/Hindi poetry lovers and Sufi seekers — people who arrive carrying an emotion (dard, ishq, hijr, junoon, bewafai) and want words for it. Their scene: late-night, personal, often mobile, sharing a sher with someone or keeping it for themselves. Secondary audience: readers curious about the emotional and philosophical universe of Nusrat Fateh Ali Khan's qawwali repertoire who want annotated, source-aware research entries, not lyrics.

## Product Purpose

MEHFIL AI is a poetry-generation studio, not a chatbot. It explores the emotional, philosophical and literary dimensions of the researched qawwali repertoire and turns a chosen emotion into original, emotionally coherent Urdu shayari. Its signature feature, **Us Dard Ko Likho**, lets a user pick a composition, understand its emotional and philosophical profile, choose an emotion combination, and receive a brand-new sher inspired by its broad themes. Success: the generated poetry feels emotionally true and literary, never random words or a generic motivational quote.

## Positioning

Three separate intelligence engines (Qawwali Intelligence, Emotion Intelligence, Shayari Intelligence) coordinated by an orchestration service, with structured JSON between engines, a quality/originality evaluation gate, and research annotations that separate verified fact from interpretation. No neighboring product ships an emotion-mixing composer grounded in a researched, source-aware qawwali annotation base.

## Operating Context

Users interact through: the landing page, the main Shayari Generator studio, Us Dard Ko Likho (select composition → discover emotions → choose emotion + intensity + language → generate), Qawwali Universe (research profiles), Random Ishq / Mehfil Random, My Mehfil (saved poems, history, collections), special emotional modes (Dard, Junoon, Ishq, Shikwa, Bewafai, Sufi, Anger, Raat ki Mehfil), and a protected research dashboard for annotations. Output presentation: poem, title, emotion mix, philosophical concept, Urdu + Roman Urdu + English, metaphor explanations, and shareable card images (4:5, 1:1, 9:16).

## Capabilities and Constraints

- Multi-emotion mixing (primary + secondary, contradiction-aware), five-level intensity, language modes (Urdu, Roman Urdu, Hindi, English, Urdu+English).
- Research knowledge base stores metadata, annotations, symbolic vocabularies, citations, confidence and licensing — never full lyrics, never transcriptions of recordings. Research coverage is explicitly partial and labeled.
- Demo mode: with no AI credentials the local engine produces poetry; demo-generated content is labeled as such. Never claim live AI generation occurred when it did not.
- Originality screening compares output against the internal reference corpus; it does not guarantee copyright clearance and is documented as such.
- Originality requirement: no copying, reconstruction, close paraphrase or imitation of Nusrat Fateh Ali Khan's or any other poet's distinctive voice.
- No API keys in client-side code. All AI calls server-side with validation, rate limiting and timeouts.
- Persistence is browser storage (localStorage) for My Mehfil; admin research dashboard is env-key gated and assumes a server-side check in production.
- Undecided: live Supabase wiring, real user auth, production deploy host, full research corpus scale.

## Brand Commitments

Name: MEHFIL AI. Tagline: "Jab Dard Lafzon Mein Dhalta Hai." Voice: the voice of an intimate mehfil — dignified, unhurried, precise; never chatbot-casual, never hype. Pinned palette (user-pinned in brief): deep charcoal, midnight black, warm ivory, antique gold, burgundy, muted bronze. Urdu RTL correctness and Nastaliq-compatible typography are hard requirements. Landing hero headline (verbatim): "कुछ दर्द अल्फ़ाज़ नहीं माँगते, बस एक शायरी बन जाते हैं।"

## Evidence on Hand

No verified research corpus, imagery, recordings or testimonials exist yet. Any seeded research entries must be clearly labeled sample/illustrative annotations with sources and confidence, never invented as verified fact. Demo poetry must be labeled demo. Placeholder claims about repertoire coverage are prohibited.

## Product Principles

1. Every sher must earn its emotion: an idea first, decoration second.
2. Verified fact, interpretation, and generated art are three different things — never blurred in the UI.
3. The three engines stay separate: one service, one prompt, one schema each.
4. The interface recedes; the poetry leads.
5. Works completely in demo mode; honesty about demo vs live.

## Accessibility & Inclusion

Keyboard navigation, semantic HTML, readable contrast, reduced-motion support, correct Urdu RTL rendering, 44px touch targets, tested on Chromium/Firefox/WebKit-class browsers where practical.
