/* The hero lab: which variants exist, in one place for the index, the pages and the bar. */
export const heroVariants = [
  { key: 'a', name: 'Two plates', note: 'The tall plate stays. A wide second photograph fills the space above the headline, so the words keep their place at the foot and the two plates share a baseline.' },
  { key: 'b', name: 'The stage', note: 'One wide plate that can carry a film later, three portraits down each side sharing its height, and the headline on a white card at its centre, one line.' },
  { key: 'c', name: 'The spread', note: 'One wide plate across the page; eyebrow and headline beneath it on the left, standfirst and link on the right, on one baseline. The lead as the magazine sets it.' },
  { key: 'd', name: 'Headline first', note: 'The headline runs across the page under the masthead, like a cover line. The tall plate and a wide plate sit beneath it, the standfirst at their foot.' },
  { key: 'e', name: 'Two plates, words above', note: 'As A, turned over: the headline at the top of the right column and the wide photograph filling the space beneath it, down to the tall plate’s baseline.' },
] as const;
export type HeroVariant = (typeof heroVariants)[number]['key'];
