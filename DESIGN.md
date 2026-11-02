---
name: MEHFIL AI
description: The Dargah Chamber — a shrine-chamber design system for a Sufi poetry studio; midnight velvet, gilt rules, mirror-work, one lit alcove.
colors:
  chamber-black: "#0b0a0d"
  chamber-well: "#14110f"
  chamber-recess: "#1c1815"
  velvet-chadar: "#4a1220"
  velvet-deep: "#2d0a14"
  velvet-mid: "#5d1a2a"
  gilt-brass: "#c8a25e"
  gilt-bright: "#e8cd93"
  gilt-pale: "#f2e0b6"
  gilt-dim: "#8a6a45"
  ivory-warm: "#f2e8d5"
  ivory-body: "#e7dcc6"
  ivory-faded: "#d9cbb2"
  ivory-muted: "#b8a88d"
  petal-rose: "#b5606a"
  lamp-glow: "#d99a3d"
  lamp-flare: "#edb85f"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontWeight: 400
    letterSpacing: "0.14em"
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontWeight: 400
    lineHeight: 1.6
  urdu:
    fontFamily: "Noto Nastaliq Urdu, serif"
    lineHeight: 2.15
  record:
    fontFamily: "Courier Prime, monospace"
    letterSpacing: "0.12em"
  devanagari:
    fontFamily: "Noto Serif Devanagari, serif"
    fontWeight: 600
    lineHeight: 1.65
rounded:
  plaque: "2px"
  panel: "3px"
  chip: "9999px"
  alcove-arch: "46% 46% 2% 2% / 30% 30% 1.5% 1.5%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "40px"
  xl: "64px"
components:
  plaque-primary:
    backgroundColor: "{colors.gilt-brass}"
    textColor: "#1f1409"
    rounded: "{rounded.plaque}"
    padding: "16px 32px"
    typography: "{typography.display}"
  plaque-ghost:
    backgroundColor: "{colors.chamber-well}"
    textColor: "{colors.gilt-bright}"
    rounded: "{rounded.plaque}"
    padding: "16px 32px"
  emotion-chip-selected:
    backgroundColor: "{colors.gilt-bright}"
    textColor: "{colors.chamber-black}"
    rounded: "{rounded.panel}"
    padding: "8px 16px"
  mirror-disc:
    backgroundColor: "{colors.gilt-brass}"
    rounded: "{rounded.chip}"
    size: "28px"
---

# Design System: MEHFIL AI

## Overview

**Creative North Star: "The Dargah Chamber"**

The interface is a shrine chamber entered after dusk. Light is rationed and deliberate:
the ground stays near-black, velvet panels absorb it, and gilt returns it only where
meaning lives — a rule, a plaque, a mirror that has earned its shine. Every generated
sher is presented inside a lit, arched alcove like an offering on a shrine ledge, and
the product's honesty rides the same material: demo verses carry pressed stamps
("DEMO · COMPOSED BY THE LOCAL CORE ENGINE"), research entries carry verification
seals and coverage notes.

Density is generous at rest, intimate in focus. Controls recede into the chamber's
behavior — state is expressed as *light level* (frosted → backlit → gilt-flooded),
never as color chips announced by borders. Motion is candlelight logic: slow
ignitions, blur-up reveals, a slow petal drift; nothing snaps, nothing spins.

**Key Characteristics:**
- Near-black ground with warm candle pools; burgundy bleeds from the floor.
- Gilt border rules of true brass weight frame every structural boundary.
- Mirror-mosaic tessellation appears as *structure* (alcove interiors), never wallpaper.
- One lit alcove holds the finished poem; its rim brightens while it works.
- Roman Urdu typography rides EB Garamond; Urdu script always Nastaliq with deep leading.

## Colors

The palette is a shrine at midnight: everything is either shadow, chadar-velvet, or
something the candle has touched.

### Primary
- **Gilt Brass** (#c8a25e): the load-bearing warm gold — rules, plaques, discs, selection
  fills. Its brighter kin **Gilt Bright** (#e8cd93) marks hover/active, and **Gilt Pale**
  (#f2e0b6) is reserved for pressed brilliance on primary plaques.
- **Lamp Glow** (#d99a3d): candlelight in glows and shadows behind live states.

### Secondary
- **Velvet Chadar** (#4a1220): burgundy panels — research reading panels, the floor-wash.
- **Petal Rose** (#b5606a): drifting petals and soft danger accenting (errors tint velvet,
  not red).

### Tertiary
- **Gilt Dim / Bronze** (#8a6a45): passive borders, de-emphasized display text, the
  transitional stop in disc gradients.

### Neutral
- **Chamber Black** (#0b0a0d): the page ground.
- **Chamber Well** (#14110f): control fills; **Chamber Recess** (#1c1815): niche tops.
- **Ivory Warm** (#f2e8d5): the brightest body moment (demo alcove prose).
- **Ivory Body** (#e7dcc6): default body text; **Ivory Faded** (#d9cbb2); **Ivory Muted**
  (#b8a88d): secondary voice, never pure gray.

### Named Rules
**The Brass-Never-Blue Rule.** Every interactive affordance the browser would paint blue
or white — focus rings, selection, caret, scrollbars, underline accents — is dressed in
gilt (#dcc084 rings, gilt-thumbed scrollbars, gilt-dim underlines). Blue never appears.
**The One Lit Alcove Rule.** Only one poem at a time holds the light; the alcove's rim
and mirror tiles brighten while it works and settle when it rests.

## Typography

**Display Font:** Cinzel (Roman inscriptional caps — engraved PLAQUE lettering)
**Body Font:** EB Garamond (literary book face; italic carries second voice)
**Label/Record Font:** Courier Prime (research records, stamps, coverage notes)
**Urdu:** Noto Nastaliq Urdu · **Devanagari:** Noto Serif Devanagari

**Character:** engraved capitals for names and doors, book serif for reading, typeface of
the ledger for provenance, Nastaliq for the verse. Four voices, one temperament: unhurried.

### Hierarchy
- **Display** (600, 42–47px Devanagari / 26–32px Cinzel, lh 1.65): the hero headline and
  page titles — the product's emotional opening line, never decorative.
- **Headline** (400, 22–24px, tracking .14em, uppercase): section titles ("HOW A SHER
  HAPPENS"), always gold.
- **Title** (400, 15–16px, tracking .1–.18em, uppercase): card names, engine names.
- **Body** (400, 14–16.5px, lh 1.55–1.7): reading copy at 60–75ch max.
- **Label** (400, 10–13px Courier Prime, tracking .12–.2em, uppercase): stamps,
  record lines, provenance, coverage honesty.
- **Urdu Text** (400–700, 17–21px, lh 2.15, no letter-spacing, RTL): every Urdu-script
  line; roman glosses ride beneath in Garamond.

### Named Rules
**The Ledger Voice Rule.** Anything that states provenance, status, or research honesty
is set in Courier Prime small caps — it reads as an entry in a record book, not UI chrome.

## Layout

Full-bleed chamber interiors on a `max-w-[1600px]` stage (landing), `1500px` (studio),
`1300px` (ledger, admin), `3xl` reading columns for profiles. The first viewport is a
two-column stage: the offer (≈58%) and the lit alcove (≈42%), with the three-niche
engine band entering the fold at its bottom edge. Sections breathe: pt-10 → content of
48–60ch → generous pb (56–96px); more room above a heading than below.

Responsive: single-column stacking at <1024px; the alcove keeps its arch at every width;
mode tiles restack 2-col; the chamber drawer replaces the nav. Nothing fixed-pixel.

## Elevation & Depth

Depth comes from recesses and light, not floating cards. Interior surfaces sink:
inset one-line gilt borders plus deep inner shadow wells. When something must lift, it
glows rather than drops — a soft gilt halo with real offset (`0 0 32px -10px`) and a
small translate. No zero-offset colored halos.

### Shadow Vocabulary
- **Alcove depth** (`inset 0 0 56px rgba(0,0,0,.75)` + `0 24px 60px -24px` ground): the
  recess a poem lives in.
- **Niche well** (`inset 0 0 0 1px gilt .16, inset 0 2px 8px black .6`): controls at rest.
- **Plaque bar** (`inset 0 1px pale .35, 0 10px 24px -12px black`): brass relief.
- **Hover ignition** (`0 0 32px -10px rgba(217,154,61,.35)`): the response to touch.

### Named Rules
**The Candle Doesn't Jump Rule.** State changes cross-fade over 300–420ms on
`cubic-bezier(0.22, 1, 0.36, 1)`; nothing appears instantly and nothing slides.

## Shapes

Corners are near-sharp (2–3px) — cut stone, not bubble wrap. The one exception is the
signature silhouette: the **alcove arch** (`46% 46% 2% 2% / 30% 30% 1.5% 1.5%`), an
Islamic arch reading in one curve its whole life. Chips round to full pills for
temporary states; discs round to circles because they are mirrors. Gilt rules are
1px gradients dead-centered bright; mirrored edges get doubled 7px/8px offset rims.

## Components

### Plaques (Buttons)
- **Shape:** 2px radius, Cinzel uppercase tracking .16em, h-11/44px.
- **Primary:** gilt brass gradient ground (#c8a25e→#8a6a45), ink #1f1409, inset pale
  highlight; hover flares (#e8cd93 top) with glow; disabled at 50% opacity.
- **Ghost:** chamber-well ground, gilt text, 1px gilt ring; hover ignites to bright.
- **Bare:** text-only underlined register for tertiary ways in.

### Mirror Chips (emotion tiles)
- **Style:** frosted well at rest (ivory text on near-black); hover backlight; selected
  floods gilt (#e8cd93→#8a6a45 gradient) with ink text. Selected primary carries a
  mono "primary" tag.
- **State:** flooded = selected; disabled = 50% faded ivory.

### Mirror Discs (intensity)
- **Style:** five 28px circles. Off: dark tarnished mirrors with faint gilt rims; on:
  brass-lit centers (`radial #f2e0b6 → #8a6a45`) with warm halo. The next disc pings
  softly. Keyboard: role=slider, arrows.

### Niches (cards/containers)
- **Corner:** 3px. **Ground:** recess gradient (#1c1815→#100d0c). **Border:** inset 1px
  gilt .16; inter-niche seams are true 1px gilt dividers, not floating margins.
- **Hover:** rim brightens to .42 + glow; translate −2px. Inside: sigil in gilt stroke,
  tracked name, record line, 48ch body.

### Inputs / Fields
- **Style:** 3px radius chamber-well fill, 1px gilt-dim border, Garamond 15px ivory;
  placeholder muted at 60%.
- **Focus:** 2px gilt #dcc084 ring (never blue); caret styled gilt.
- **Error:** velvet-panel border + rose-tinted copy inside a velvet-well alert; none
  default gray.

### Navigation
- **Header:** chamber-950/70 bar over a 1px gilt sub-rule; MEHFIL AI nameplate in tracked
  capitals; links 11px tracked caps, active gilt-200, rest ivory-muted → hover gilt.
- **Mobile:** hamburger opens a chamber drawer; links full-width, record sub-labels.

### The Alcove (signature)
Arched recess with doubled gilt rims and a lit mirror-mosaic interior. Holds the
production of the moment: a title, emotion chips, the verse in script with its roman
gloss, concept line, source inspiration, metaphor ledger, and the provider stamp. A
contrast scrim keeps the poem at ≥4.5:1 against tiles; action row and refine capsules
live inside the recess. While composing: loader + "the mehfil is listening…".

### Poetry Card Images (canvas export)
4:5 / 1:1 / 9:16 fields painted from the same world: chamber gradient, candle pool,
gilt border rules, Cinzel nameplate, Nastaliq verse, courier provenance line, film
grain. Ernest export for Instagram stories and posts.

## Do's and Don'ts

### Do:
- **Do** express every interactive state as light level (frost → backlit → gilt flood)
  with 300–420ms ease.
- **Do** set all Urdu-script text in Nastaliq at lh 2.15, RTL, zero letter-spacing, with
  `unicode-bidi: isolate`.
- **Do** label provenance in Courier Prime: demo verses, research statuses, coverage
  notes. Honesty is part of the finish.
- **Do** keep body text against a scrim or well when tiles glow behind it (≥4.5:1).

### Don't:
- **Don't** paint any interactive default blue/white; focus, selection, carets and
  scrollbars are gilt.
- **Don't** render fire/velvet/mirror as flat site-wide wallpaper; the mosaic and velvet
  exist inside structural recesses only.
- **Don't** stack gradients or halo shadows without offset; depth is recess + relief,
  never decoration.
- **Don't** invent scrubbing metaphors of other worlds (SaaS violet, neon, pastel) — the
  chamber has one voice.
