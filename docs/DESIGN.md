# Lindsey Bonnette RPG Publishing — Design System

The source of truth for the site's look and behavior. **This spec wins over the current
code.** Where `src/` diverges from this doc, the code is what needs to change — see
§11 for the known gaps.

Dark theme only. Mobile-first. Every CSS value below is production-ready — paste it in.

---

## 0. How to read this doc

- **Asset constraints in §1 are hard facts, not preferences.** They come from the real
  files in `src/assets/`. Any design decision that ignores them (e.g. treating a cover
  as a wide banner) is wrong regardless of what looks nice in the abstract.
- Tokens live in `src/styles/global.css`. Component styles are colocated in each
  `.astro` file under `src/components/`.
- When you add a pairing (color-on-color, new component), verify contrast (§10) before
  shipping. Don't eyeball it.

---

## 1. Asset reality (read this first)

Everything the brand shows is **existing artwork**. There is no budget assumption for
new key art. Design to what exists:

**Product covers** (`src/assets/projects/*`) — all 8 are:
- **Portrait**, roughly 1.29∶1 to 1.6∶1 tall (e.g. `transient-souls` 800×1280,
  `station-trappings` 2480×3508). Not a uniform ratio.
- **Typographic** — the product title is *baked into the image* ("TRANSIENT SOULS",
  "LIGHT OF WINTER", etc.).

Two consequences that the rest of this doc is built around:
1. **Never crop a cover so its baked-in title is clipped.** Show the whole image (§6).
2. **Do not use a cover as a full-bleed background behind site headings.** A sharp cover
   puts a second title behind your real `<h1>` and crops badly at wide aspect ratios.
   If you want cover art as *atmosphere*, it must be blurred/scrimmed enough that its
   text dissolves into texture (§5 Hero).

**There is no landscape hero/banner/key art.** The only wide images in the repo are
*blog* illustrations (`src/assets/blog/*`, e.g. `announcing-transient-souls` 2500×2012),
which are tied to specific posts and are not appropriate as a site-level hero.

**Blog images** are mixed portrait/landscape; the blog card thumbnail crops them to 3∶2
(acceptable — these have no baked-in titles that matter).

---

## 2. Design direction

Atmospheric indie-fantasy with a modern editorial feel — but **delivered, not just
described.** A deep warm-black canvas lit by a single amber glow, like lamplight in a
quiet occult library. Warm parchment text instead of clinical white. Confident serif
display, generous whitespace, restrained motion.

The thing that keeps this from reading as generic dark-mode SaaS is **atmosphere you can
actually see**: a warm radial glow on key surfaces and an optional fine grain overlay
(§3, §4). Flat hex fills alone do *not* achieve the mood — if you strip the glow/grain,
add them back before calling the page done.

One accent only: **amber/ember**. There is deliberately no secondary hue — restraint is
the brand.

---

## 3. Atmosphere layer (what makes it "lamplight, not SaaS")

Two additive, low-cost treatments. Both are subtle by design; if a viewer *notices* them
consciously, dial them back.

**Warm glow** — a fixed radial behind page content, brightest at top-center where the
hero sits, fading to the base black:

```css
body {
  background:
    radial-gradient(120% 80% at 50% -10%,
      color-mix(in srgb, var(--color-accent) 7%, transparent) 0%,
      transparent 55%),
    var(--color-bg);
  background-attachment: fixed;
}
```

**Grain** — an optional fine-noise overlay to give surfaces a printed-paper tactility.
Ship as a small tiling PNG or inline SVG `feTurbulence`, applied via a fixed
`::before` on `body` at very low opacity, `pointer-events: none`, `z-index: 0`:

```css
body::before {
  content: "";
  position: fixed; inset: 0;
  background: url("/textures/grain.svg");
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}
```

Respect `prefers-reduced-motion`? No — these are static, keep them. But keep opacity
low enough that AA text contrast (§10) is unaffected.

**Living lamplight (motion).** The flat single-glow read as dreary, so the atmosphere is
now *layered and alive* without lightening the palette or adding a second hue:

- The `body` base carries **three amber radial washes** (top-center lamplight, a warm
  side wash, a low ember pool) so the canvas has depth even with motion disabled — it is
  never a flat void. All amber-derived via `color-mix`; no new hue.
- A dedicated `Atmosphere.astro` fixed layer (`z-index: 0`, `pointer-events: none`) adds
  two moving treatments, **amber only**: a large glow that slowly *breathes*
  (drift + pulse, ~16s) and a handful of **embers drifting upward** like sparks off a low
  fire (staggered, low-opacity).
- **Motion is subtlety-gated:** under `prefers-reduced-motion: reduce` the glow freezes
  and the embers are removed — the layered static washes remain. Keep amplitudes small
  enough that no one consciously watches the background; if they do, dial it back.

**Star/dust field.** `Atmosphere.astro` also carries a faint field of parchment/amber
points (`.atmo-stars`, `opacity ~0.32`) — a quiet nod to the space-western catalogue and
the author's astronomy. Amber-only, `pointer-events:none`, below content; a slow twinkle
that halts under reduced-motion.

**Edge vignette.** `body::after` (fixed) deepens the corners so the lamplit center reads
as *lit* and the periphery as the dark edge of the room. Gentle enough that no §10 pairing
drops below its threshold. (`body::before` is the grain, so the vignette is `::after`.)

---

## 4. Color palette

Warm-neutral dark (a hint of brown, never blue-cold). One amber accent. **No violet.**

```css
:root {
  /* Backgrounds & surfaces — warm-neutral */
  --color-bg:            #0d0b0f;  /* page base — near-black, warm */
  --color-surface:       #17130f;  /* cards, raised panels — warmed toward brown */
  --color-surface-2:     #211b16;  /* nested / hover surface */
  --color-overlay:       #08070a;  /* modals, image scrims (use with opacity) */

  /* Text */
  --color-text:          #ece6da;  /* primary — warm parchment */
  --color-text-muted:    #a39b91;  /* secondary, metadata, captions */
  --color-text-faint:    #6f6860;  /* timestamps, disabled, fine print */

  /* Accent — ember/amber (the only accent) */
  --color-accent:        #e0a458;  /* CTAs, links, active states */
  --color-accent-hover:  #f0bd7a;  /* hover/lighter */
  --color-accent-contrast:#1a1206; /* text ON accent fills */

  /* Borders & lines — warm-neutral (must NOT be blue/violet-dominant) */
  --color-border:        #2b211a;  /* default hairline */
  --color-border-strong: #4a3a2c;  /* emphasized dividers, card outline on hover */

  /* Feedback */
  --color-success:       #7fbf7f;
  --color-danger:        #d97a6c;

  /* Focus ring */
  --color-focus:         #f0bd7a;
}
```

Usage rules:
- Links: `--color-accent`, 1px underline offset 3px; hover → `--color-accent-hover`.
- **Amber is the only accent — do not introduce a second hue.** Everything that used to
  be violet (genre tags) is now neutral (§5 Tags).
- Body copy is always `--color-text`; never set body text below `--color-text-muted`.
- Image scrims: `--color-overlay` at 55–70% opacity for text-over-art legibility.
- The surfaces above are warmed vs. the original cool palette — keep them warm.

---

## 5. Typography

Two families, both via Astro's font provider (`fontProviders.google()` in
`astro.config.mjs`), which self-hosts and optimizes them — **do not hotlink Google, and
do not add a third family.** (JetBrains Mono was removed; re-add a mono family only if
real stat-block/dice content appears.)

- **Display / headings:** **Cormorant Garamond** — high-contrast old-style serif, evokes
  print grimoires. Weights 500, 600, **plus italic** (registered in `astro.config.mjs`).
  Used for h1–h3, the wordmark, and — in *italic* — intro leads and pull-quotes for
  editorial personality (`.lead`, `blockquote`).
- **Body / UI:** **Inter** — neutral, legible sans for paragraphs, nav, buttons, meta.
  Weights 400, 500, 600.

```css
:root {
  --font-display: var(--font-cormorant), Georgia, serif;
  --font-body:    var(--font-inter), system-ui, -apple-system, sans-serif;
}
```

Set `font-display: swap` (the provider handles this).

### Type scale (fluid where noted)

| Token | Element | Size | Weight | Line-height | Font | Notes |
|-------|---------|------|--------|-------------|------|-------|
| `--fs-display` | Hero h1 | `clamp(2.75rem, 6vw, 4.5rem)` | 600 | 1.05 | display | letter-spacing `-0.01em` |
| `--fs-h1` | Page h1 | `clamp(2.25rem, 4vw, 3.25rem)` | 600 | 1.1 | display | |
| `--fs-h2` | Section h2 | `clamp(1.75rem, 3vw, 2.25rem)` | 600 | 1.15 | display | |
| `--fs-h3` | Card title | `1.5rem` | 500 | 1.2 | display | |
| `--fs-h4` | Eyebrow | `0.75rem` | 600 | 1.3 | body | uppercase, letter-spacing `0.08em`, muted |
| `--fs-lead` | Intro para | `1.375rem` | 500 | 1.45 | **display italic** | `--color-text-muted` |
| `--fs-body` | Body | `1.0625rem` | 400 | 1.7 | body | |
| `--fs-small` | Meta/caption | `0.875rem` | 500 | 1.4 | body | `--color-text-muted` |
| `--fs-tiny` | Tags/fine print | `0.75rem` | 600 | 1.3 | body | uppercase, letter-spacing `0.06em` |

Long-form prose: `max-width: 68ch`, paragraph spacing `1.25em`, links underlined.
Headings inside prose get `margin-top: 2em`.

---

## 6. Imagery treatment (the cover-art rules)

Cover art is the brand's showcase — but per §1 it is **portrait and title-bearing**, so:

- **Show the whole cover. Do not crop off the title.** Use `object-fit: contain` (or
  simply let the `<img>` render at its natural ratio inside a portrait frame). **Do not
  use `object-fit: cover` on product covers** — it clips the baked-in typography.
- Because covers vary in exact ratio, reserve a **portrait frame** (e.g. a `3 / 4` box)
  and `contain` within it, letterboxing the remainder with `--color-surface`. Letterbox
  bars are acceptable and on-brand ("framed print"); clipped titles are not.
- **Frame:** `1px solid --color-border`, no heavy drop shadow at rest.
- **Hover:** a gentle lift/glow on the *card* (§7), not an art zoom — zoom + `contain`
  fights the letterbox. Optional accent border-glow `box-shadow: 0 0 0 1px
  var(--color-accent)`.
- **Loading:** `loading="lazy"`, explicit dimensions or `aspect-ratio` to prevent CLS.
  Serve `.webp`/`.avif` via Astro's `<Image>` / `astro:assets`.
- **Alt text:** every cover gets descriptive alt ("Cover art for Transient Souls: …").
- Blog thumbnails are the exception: no meaningful baked-in text, so `object-fit: cover`
  at `3 / 2` is fine.

---

## 7. Layout system

### Spacing scale (8px base, `--space-*`)

```css
:root {
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
  --space-8: 3rem;     --space-10:4rem;     --space-12:6rem;
  --space-16:8rem;     /* major section rhythm */
}
```

Vertical rhythm: sections separated by `--space-16` desktop / `--space-10` mobile.

### Containers

```css
:root {
  --container-max:   1200px;  /* default page width */
  --container-prose:  720px;  /* blog article body */
  --gutter: clamp(1rem, 4vw, 2.5rem);
  --radius: 10px;  --radius-sm: 6px;  --transition: 160ms ease;
}
```

Center with `margin-inline: auto; padding-inline: var(--gutter);`.

### Grids & breakpoints

- **Projects gallery:** CSS Grid `repeat(auto-fill, minmax(280px, 1fr))`, gap
  `--space-6`. 3 cols at max width, 2 on tablet, 1 on narrow.
- **Blog list:** single-column stack of horizontal cards (thumb left ~200px, text
  right); below 640px stack thumb above text.
- Breakpoints: `640px` (sm), `900px` (md), `1200px` (lg). Mobile-first, layer up with
  `min-width` queries.

---

## 8. Component styling

### Hero (§1 governs this)

There is no banner asset, so **do not build a full-bleed image hero.** Two sanctioned
patterns:

1. **Two-column (preferred).** Headline + lead + CTAs on the left; a single featured
   **portrait cover shown as a standing framed book** on the right (its natural shape —
   no crop, subtle shadow + amber glow). Collapses to a single column on mobile with the
   cover below the CTAs (or hidden if it crowds). This finally puts product art above the
   fold without fighting the baked-in titles.
2. **Text-only, atmospheric.** Centered headline/lead/CTAs over the §3 warm glow (+
   optional grain). Acceptable when you want maximum minimalism — but it must sit on the
   glow, not a flat void. Trim excessive top padding so the fold does real work.

Forbidden: a sharp cover as the hero background (double-title clash, §1).

### Emission-line dividers

Major dividers (homepage section heads, the projects filter bar, `<hr>`) use the
`--emission-rule` token instead of a plain hairline: a mostly-dark 1px strip with a few
brighter amber "lines," reading as atmosphere at a glance and as an emission-spectrum /
flame-test signature to a chemist. Amber-only; apply via `.emission-divider` (or
`background: var(--emission-rule)` at `100% 1px`). Keep it to *major* dividers — plain
warm hairlines still separate list rows, cards, etc.

### Genre glyphs on tags

Evocative tags carry a tiny monochrome glyph (`TagGlyph.astro`): keyhole (mystery,
investigation), star (sci-fi, space-station, worlds-without-number), crescent
(supernatural, paranormal, haunted-locations, dark-themes), skull (dungeon),
die (generator, dice-tables), compass (adventure kit). Format/system tags (rpg, pdf, osr,
ttrpg…) deliberately have none. Glyphs render on card + detail-page chips (inherit the
muted tag color, `aria-hidden`); the **filter bar stays text-only** for a uniform, scannable
row. The map lives in `lib/tags.ts` (`tagGlyph`).

### Buttons / CTAs

Shared: `--font-body`, weight 600, `--fs-small`, `padding: 0.75rem 1.5rem`,
`border-radius: --radius-sm`, `transition: 160ms ease`. No harsh shadows.

- **Primary** (store CTAs): fill `--color-accent`, text `--color-accent-contrast`.
  Hover → `--color-accent-hover` + `translateY(-1px)`. Include the store mark 16px left
  of the label. Two stores → primary = itch.io, secondary style = DriveThruRPG.
- **Secondary:** transparent, `1px solid --color-border-strong`, text `--color-text`.
  Hover → border + text `--color-accent`.
- **Ghost / text link:** no border, text `--color-accent`, hover underline.
- **Focus (all):** `outline: 2px solid var(--color-focus); outline-offset: 2px;` — never
  remove.

### Project card

- Container `--color-surface`, `1px solid --color-border`, `--radius`, `overflow: hidden`.
- **Cover:** full art, `contain` in a `3 / 4` frame (§6). The card's title is *both* in
  the art and repeated as a text `<h3>` below — **this repetition is intentional**: the
  text title is what search engines and screen readers read (image text is invisible to
  both). Keep the visible text title but you may set it slightly muted so the art leads.
- Below the cover, in `--space-5` padding: genre tag row → title (`--fs-h3`, display) →
  optional one-line blurb (`--fs-small`, muted) → **price + store CTA pinned to the card
  bottom** (drives sales; data already exists in each project's frontmatter as `price`,
  `itchUrl`, `drivethruUrl`).
- **Equalize card height** and **clamp the blurb** to a fixed line count
  (`-webkit-line-clamp`) — covers/taglines vary in length and ragged bottoms look broken.
  (Several projects have no `tagline`; the card must look right with zero blurb lines.)
- **Genre tags (neutral, no violet):** pill, `--fs-tiny` uppercase, `--color-surface-2`
  bg, `1px solid --color-border`, text `--color-text-muted` — verify ≥4.5:1 on
  `--color-surface-2`; bump to `--color-text` if it fails. Tags are low-emphasis; they
  must never out-shout the amber CTA.
- **Tags are interactive filter links** (`<a class="tag" href="/projects?tag=<slug>">`),
  not inert spans — see §8.5. Because an interactive element cannot live inside the
  card's main link, the card uses the **stretched-link pattern**: the title `<a>` renders
  a transparent `::after` overlay (`position:absolute; inset:0`) that makes the whole card
  clickable, while the tag chips and store buttons sit above it (`z-index:2`) and stay
  independently clickable. The pointer lamplight (`::before`) sits behind at `z-index:-1`
  (card is `isolation: isolate`).
- Hover: `border-color: --color-border-strong`, card `translateY(-2px)`, subtle shadow
  `0 8px 24px rgba(0,0,0,0.4)`, optional accent border-glow. **No art zoom** (§6).

### Blog post card

- Horizontal (thumb + text). Thumbnail 3∶2, `object-fit: cover`, `--radius-sm`.
- Eyebrow: date (+ read-time if available) `--fs-tiny` uppercase, `--color-text-faint`.
- Title `--fs-h3` display; hover → `--color-accent`.
- Excerpt 1–2 lines `--fs-small` muted, `-webkit-line-clamp: 2`.
- Entire card is one `<a>`.
- Full-width horizontal cards leave large empty right-space on desktop; either keep the
  row visually anchored (thumb + generous text column) or use the featured layout: first
  post as a large hero card, remainder in a `minmax(300px, 1fr)` 2-up grid.

### Header / nav

- Sticky top, `background: color-mix(in srgb, var(--color-bg) 85%, transparent)` +
  `backdrop-filter: blur(8px)`, bottom `1px solid --color-border`.
- Left: wordmark `--font-display` 600. Right: nav links `--fs-small` weight 500 +
  external store/social icons (itch.io / DriveThru / Mastodon).
- Nav links: `--color-text-muted` → hover `--color-text`; active link `--color-accent`
  with a left-origin `scaleX` underline (already implemented in `HeaderLink.astro`).
- **Store/social icons need enough contrast to be legible** — muted gray on black reads
  as invisible; ensure they meet non-text contrast and consider a hover label/tooltip.
- Mobile (<900px): hamburger → overlay menu on `--color-overlay`, links stacked large
  (`--fs-h2` display).
- Height ~64px; padding-inline `--gutter`.

### Footer

- `--color-surface` bg, top `1px solid --color-border`, generous vertical padding.
- Grid (stacks on mobile): (1) author bio, `--color-text-muted`; (2) store/social links
  (Mastodon gets `rel="me"`).
- Fine-print row: copyright + tagline, `--fs-tiny`, uppercase.

### Newsletter

**There is no newsletter.** There is no mailing list to collect into, so the site must
not render an email signup — a functional-looking form wired to nothing erodes trust.
If a list is ever set up, build a signup that actually POSTs to that provider's endpoint
(with a real success/error state), and only then reintroduce it. Do not add a signup box
speculatively.

### 8.5 Tag filtering (projects only)

Only **projects** carry tags (the blog collection has none) — so filtering lives on the
projects listing. The whole flow is progressive enhancement:

- **Canonical tags.** Authored tags are inconsistent in case/spacing; `src/lib/tags.ts`
  normalizes them to a slug and a single display label (preferring the author's best-cased
  spelling, title-casing only all-lowercase tags). Cards, the detail page, and the filter
  bar all resolve labels through it so they never disagree.
- **Tags are links** (`/projects?tag=<slug>`) everywhere. Without JS they navigate to the
  listing (which, statically, shows all projects — an acceptable fallback). With JS, the
  listing filters **in place**: it reads `?tag=` on load, filters on pill/chip click,
  syncs the URL via `history.pushState`, supports back/forward (`popstate`), announces the
  count via an `aria-live` region, and shows an empty state with a reset link.
- **Filter bar** on `/projects`: an "All" pill + one pill per canonical tag (most-used
  first). Active pill uses `aria-current="true"` + amber fill.
- **No blog tags yet.** If the blog ever needs filtering, add a `tags` field to the blog
  schema + frontmatter and mirror this pattern; don't fabricate a taxonomy.

---

## 9. Micro-interactions

Subtle, fast, purposeful. UI `160ms ease`; image transforms `300ms ease`.

- Links/buttons: color + `translateY(-1px)` hover; press → `translateY(0)`.
- **Primary CTA:** on hover, an amber drop-glow plus a single light *sheen sweep* across
  the fill (~620ms). Sweep is removed under reduced-motion.
- Cards: lift, border brighten, amber border-bloom + a **pointer-tracked "lamplight"**
  — a soft amber radial that follows the cursor across the card (JS feeds `--mx/--my`;
  falls back to a centered static glow under reduced-motion). Cover art **brightens**
  slightly on hover (`filter`, no zoom — §6). One shared transition.
- Hero cover: a gentle vertical *float* at rest (~7s), disabled under reduced-motion.
- Nav links: left-origin `scaleX` underline (built).
- **Section reveal:** fade + 12px rise on scroll-in, `400ms`, once, via
  `IntersectionObserver` (built, in `Base.astro`).
- **Staggered card cascade:** a `.reveal--stagger` container fans its reveal out to child
  `.card`s, each animating `reveal-rise` with an inline `--reveal-delay` (`index × 70ms`,
  capped at 5) — a "dealing cards" feel. Implemented as an *animation*, not a transition,
  so it never clobbers the card's hover transition. Same fade re-fires when the projects
  filter changes the visible set (no stagger there — snappy).
- **Headline shimmer:** a single amber sheen sweeps the hero `<h1>` once on load (a
  "reagent developing" nod to the author). Uses `background-clip:text`; the `.shimmer`
  class is added by JS only when motion is allowed AND clipping is supported, so the text
  is never invisible. The sweep stays within the covered `[0%,100%]` range.
- **Primary CTA:** shallow single-hue top-lit gradient (warm metal, not flat paint) + the
  amber drop-glow and sheen sweep from §8.
- **Focus parity:** focusing into a card lights the same amber lamplight a mouse hover
  does (`:focus-within`) — keyboard users get the effect too. Focus outline stays instant.
- **Respect `prefers-reduced-motion: reduce`** — disable transforms/reveals, keep color
  changes only. (The static glow/grain of §3 stay.)

---

## 10. SEO & accessibility

**Contrast (WCAG AA):**
- `--color-text` #ece6da on `--color-bg` #0d0b0f ≈ 14:1 (AAA).
- `--color-text-muted` #a39b91 on bg ≈ 7:1 (AA/AAA).
- `--color-text-faint` #6f6860 on bg ≈ 3.4:1 — large/non-essential only, never body.
- Accent #e0a458 on bg ≈ 8:1; text ON accent uses #1a1206 (≈ 9:1).
- **Re-verify muted-on-surface-2** for the neutral tags after the surface warming above;
  target 4.5:1 for the 12px tag text.
- The §3 grain overlay must not drop any pairing below its threshold.

**Semantic structure:**
- One `<h1>` per page; logical heading order. Eyebrows are styled `<p>`/`<span>`, not
  headings.
- Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>`; articles use
  `<article>` + `<time datetime>`.
- Projects gallery = `<ul>`/`<li>`; each card one link with an accessible name.
- Skip-to-content link first; visible focus rings everywhere; icon-only links need
  `aria-label`. Mastodon link `rel="me"`.

**SEO:**
- Per-page `<title>` + `<meta name="description">`; Open Graph + Twitter tags. Portrait
  covers → provide a 1200×630 OG variant per product (already in `public/og/`).
- JSON-LD: `Person`/`Organization` sitewide; `Product` on project pages (name, image,
  offers → itch.io/DriveThru); `BlogPosting` on articles.
- Canonical URLs, `sitemap.xml` (`@astrojs/sitemap`), RSS (`@astrojs/rss`).
- Semantic URLs (`/projects/<slug>`, `/blog/<slug>`).
- Fonts self-hosted via Astro's font provider; `font-display: swap`.

---

## 11. Implementation status — where the code diverges from this spec

The refactor that brought `src/` in line with this spec is **complete** — palette
(violet removed, surfaces warmed), fonts (JetBrains Mono dropped), atmosphere (§3 glow +
grain), project cards (contain covers, neutral tags, price/store CTAs, clamped blurbs,
equal heights), and the two-column hero (§8) are all in the code, and `astro build`
passes. The newsletter was **removed entirely** (footer + homepage), not just relocated —
see §8 Newsletter for why and the condition for ever bringing it back.

Open follow-ups (data quality, not design):
- `pretender-to-the-flame.md` `itchUrl` points to a devlog/press-kit page, not the
  product/purchase page — the card's "itch.io" button should link somewhere buyable.
- Some `price` fields hold prose rather than a price (e.g. `station-trappings`:
  "Not listed on page…"), which renders literally on the card. Normalize to a price,
  "Free", or omit.

Treat this section as a live checklist — delete items as the code catches up.

---

## Quick reference — product titles
Dungeon Trappings · Transient Souls · Salvage Aces · Pretender to the Flame · Light of
Winter (genres to tag: dark fantasy, space western, mystery, horror).
