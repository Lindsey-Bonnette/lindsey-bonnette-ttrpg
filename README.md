# Lindsey Bonnette RPG Publishing

The website for Lindsey Bonnette, an indie tabletop-RPG writer and publisher — a
modernized rebuild of the original Squarespace site, built with [Astro](https://astro.build).

## Content

- **Projects** — `src/content/projects/*.md`. Each adventure/game is a markdown file
  with frontmatter (`title`, `tagline`, `description`, `cover`, `tags`, `itchUrl`,
  `drivethruUrl`, `price`, `featured`, `order`). Cover art lives in `src/assets/projects/`.
- **Blog** — `src/content/blog/*.md`. Posts with `title`, `description`, `pubDate`,
  `heroImage`. Hero art in `src/assets/blog/`.
- Schemas: `src/content.config.ts`. Site-wide constants: `src/consts.ts`.

## Design

Dark editorial theme (Cormorant Garamond + Inter, ember accent). Full design system:
[`docs/DESIGN.md`](docs/DESIGN.md). Tokens live in `src/styles/global.css`.

## SEO

Per-page metadata, canonical URLs, Open Graph + Twitter cards (1200×630 art in
`public/og/`, regenerated from cover art), JSON-LD (Person / Product / BlogPosting),
`@astrojs/sitemap`, RSS (`/rss.xml`), and `public/robots.txt`.

## Development

```sh
astro dev --background   # start (manage with: astro dev stop | status | logs)
astro build              # production build to ./dist
astro preview            # preview the build
```

## Deployment

This is a **static** Astro site (build output in `./dist`), currently hosted on
[Cloudflare Pages](https://pages.dev) at **https://lindsey-rpg.pages.dev**.

**Redeploy manually** (one-time [`wrangler`](https://developers.cloudflare.com/workers/wrangler/)
login — `npx wrangler login`):

```sh
npm run build                                              # build to ./dist
npx wrangler pages deploy dist --project-name lindsey-rpg  # upload
```

The code lives on GitHub at **[Linell/lindseyt-rpg](https://github.com/Linell/lindseyt-rpg)**,
and the hosting (Cloudflare account, domain, deploy setup) is managed for you — you don't need
a Cloudflare login or to run any of the commands above. The section below is what you actually
need.

## Making changes to the site

You have an LLM coding agent to help, so you rarely need to touch the exact commands or config —
just tell it the goal in plain language and let it do the work. The whole flow is: **change a
file → save it to GitHub → the live site updates itself** (usually within a minute or two).

**The change you'll make most often is content:**

- **Add or edit a project (game/adventure):** a markdown file in `src/content/projects/`. Copy
  an existing one to match the format, drop the cover art in `src/assets/projects/`, and fill in
  the details. *Ask your agent:* "add a new project called \<title\> using this description and
  this cover image."
- **Write a blog post:** a markdown file in `src/content/blog/`, hero image in `src/assets/blog/`.
  *Ask your agent:* "write up a new blog post about \<topic\>."
- **Update your links or site text** (itch.io, DriveThruRPG, Mastodon, taglines): `src/consts.ts`.

You don't have to memorize any of this — the [Content](#content) and [Design](#design) sections
below are here so your agent has the details it needs. When in doubt, describe what you want in
the site and ask the agent to make it happen.

**Getting a change live:** if you're working with the agent on this machine, ask it to "commit
and push," and the site redeploys automatically. If you'd rather edit from anywhere, you can
also edit files directly on [GitHub](https://github.com/Linell/lindseyt-rpg) in the browser —
saving there triggers the same automatic deploy.

### Two things still worth doing before you promote the site widely

These aren't urgent, and your agent can handle both — they're noted here so they don't get lost:

1. **The custom domain.** The site currently lives at `lindsey-rpg.pages.dev`. When you're ready
   to use a real domain, it gets hooked up on the hosting side, and `site` in `astro.config.mjs`
   (currently `https://www.lindseybonnetterpgpublishing.com`) must be updated to match — that
   value is what makes links, the sitemap, and social-media previews point to the right place.
2. **The newsletter signup.** The signup form (`src/components/Newsletter.astro`) is currently a
   placeholder and doesn't collect emails yet. When you pick an email service (Mailchimp,
   Buttondown, ConvertKit, etc.), *ask your agent:* "connect the newsletter form to my
   \<service\> account."
