/*
  Staggered card-reveal timing.

  Cards animate in on a cascade driven by their grid/list position. We cap the
  delay at index 5 so long grids don't feel laggy at the bottom, and keep the
  step (70ms) in one place so ProjectCard and BlogCard stay in lockstep.
*/

/** Reveal delay for the card at `index`, as a CSS-ready `"<n>ms"` string. */
export function revealDelay(index: number): string {
	return `${Math.min(index, 5) * 70}ms`;
}
