/* The hero lab: which variants exist, in one place for the index, the pages and the bar. */
export const heroVariants = [
  { key: 'a', name: 'Two plates', note: 'The tall plate stays. A wide second photograph fills the space above the headline, so the words keep their place at the foot and the two plates share a baseline.' },
  { key: 'b', name: 'The stage', note: 'One wide plate that can carry a film later, three portraits down each side sharing its height, and the eyebrow and headline centred beneath it, one line.' },
] as const;
export type HeroVariant = (typeof heroVariants)[number]['key'];
