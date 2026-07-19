/*
  Tag normalization for projects.

  Authored tags are inconsistent ("Tabletop" vs "tabletop", "Adventure Kit" vs
  "Adventure kit", "Generator" vs "generator"). We canonicalize by slug so that
  case/spacing variants collapse into one filter, and we pick a single display
  label per slug — preferring the author's best-cased spelling, title-casing
  only when every variant is lowercase. All rendering (cards, detail page,
  filter bar) resolves through here so labels never disagree.
*/
import { getCollection } from 'astro:content';

export interface TagInfo {
	slug: string;
	label: string;
	/** Number of projects carrying this tag. */
	count: number;
}

/** Stable, URL-safe key: lowercase, non-alphanumerics collapsed to hyphens. */
export function tagSlug(raw: string): string {
	return raw
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function titleCase(s: string): string {
	// Capitalize the first letter of each word (also after hyphens).
	return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveLabel(variants: string[]): string {
	// Prefer the spelling with the most uppercase (keeps "TTRPG", "Adventure
	// Kit"); tie-break by length then alpha for determinism.
	const best = [...variants].sort((a, b) => {
		const ua = (a.match(/[A-Z]/g) ?? []).length;
		const ub = (b.match(/[A-Z]/g) ?? []).length;
		if (ub !== ua) return ub - ua;
		if (b.length !== a.length) return b.length - a.length;
		return a.localeCompare(b);
	})[0];
	// If the author never cased it, title-case ("sci-fi" -> "Sci-Fi").
	return best === best.toLowerCase() ? titleCase(best) : best;
}

let _index: Promise<Map<string, TagInfo>> | null = null;

/** Canonical slug -> TagInfo, built once from the projects collection. */
export function getTagIndex(): Promise<Map<string, TagInfo>> {
	if (!_index) {
		_index = (async () => {
			const projects = await getCollection('projects');
			const variants = new Map<string, string[]>();
			const counts = new Map<string, number>();
			for (const p of projects) {
				const seenInProject = new Set<string>();
				for (const raw of p.data.tags) {
					const slug = tagSlug(raw);
					if (!slug) continue;
					if (!variants.has(slug)) variants.set(slug, []);
					variants.get(slug)!.push(raw);
					if (!seenInProject.has(slug)) {
						counts.set(slug, (counts.get(slug) ?? 0) + 1);
						seenInProject.add(slug);
					}
				}
			}
			const map = new Map<string, TagInfo>();
			for (const [slug, vs] of variants) {
				map.set(slug, { slug, label: deriveLabel(vs), count: counts.get(slug) ?? 0 });
			}
			return map;
		})();
	}
	return _index;
}

/** All tags, most-used first (then alphabetical) — for the filter bar. */
export async function getTagList(): Promise<TagInfo[]> {
	const map = await getTagIndex();
	return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/* Genre glyphs — a small monochrome icon for the evocative tags (rendered by
   TagGlyph.astro). Format/system tags (rpg, pdf, osr, …) deliberately have none;
   an unmapped tag simply shows no glyph. */
const GLYPHS: Record<string, string> = {
	mystery: 'keyhole',
	investigation: 'keyhole',
	'sci-fi': 'star',
	'space-station': 'star',
	'worlds-without-number': 'star',
	supernatural: 'moon',
	paranormal: 'moon',
	'haunted-locations': 'moon',
	'dark-themes': 'moon',
	dungeon: 'skull',
	'dungeon-generator': 'skull',
	generator: 'die',
	'dice-tables': 'die',
	adventure: 'compass',
	'adventure-kit': 'compass',
};

/** Glyph key for a tag slug, or null when the tag has no icon. */
export function tagGlyph(slug: string): string | null {
	return GLYPHS[slug] ?? null;
}

/** Resolve a project's raw tags to canonical {slug,label}, de-duplicated. */
export async function resolveTags(raw: string[]): Promise<{ slug: string; label: string }[]> {
	const map = await getTagIndex();
	const out: { slug: string; label: string }[] = [];
	const seen = new Set<string>();
	for (const r of raw) {
		const slug = tagSlug(r);
		if (!slug || seen.has(slug)) continue;
		seen.add(slug);
		out.push({ slug, label: map.get(slug)?.label ?? deriveLabel([r]) });
	}
	return out;
}
