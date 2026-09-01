# Project rules

## Accessibility is a hard rule, not a guideline

**Every element in this design system must be ADA compliant — WCAG 2.1 Level AA, no exceptions.** This overrides aesthetic preference. If a colour, size, or treatment cannot meet the bar, change the treatment; do not ship it and note the failure.

Non-negotiable minimums:

- **Text contrast** ≥ 4.5:1 against its background. Large text (24px+, or 19px+ bold) ≥ 3:1.
- **Non-text contrast** ≥ 3:1 for borders, rules, focus indicators, icons and any element boundary a user must perceive.
- **Never place text on `--accent` (3.9:1) or `--ink-faint` (3.4:1).** Accent text uses `--accent-strong` (5.6:1) or `--accent-deep` (7.9:1); `--ink-faint` is limited to 9px captions and must never carry a sentence.
- **Focus is always visible** — 1px `--focus-ring` at 3px offset, never removed.
- **Hit targets** ≥ 44×44px on touch surfaces.
- **Motion** respects `prefers-reduced-motion`; all durations collapse to 0.
- **Every image needs an `alt`**; decorative images get `alt=""`. Every form field needs a real `<label>`, not a placeholder.
- **Semantic HTML** — headings in order, `<button>` for actions, `<a>` for navigation, lists as lists.
- **Never convey meaning by colour alone.**

When adding or editing a component, state its measured contrast ratios in the component's `.d.ts` or `.prompt.md` if any value is close to the limit, and keep `guidelines/brand-contrast.card.html` current.
