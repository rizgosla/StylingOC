/* Helpers the heroes share: choose photographs from the home page's rail by
   orientation, dropping empties and repeats. */
import type { Img } from '@/lib/sanity';

export const isLandscape = (i: Img) => i.width > i.height;

/** Real images only, no repeats, optionally without one particular photograph. */
export function unique(imgs: (Img | null | undefined)[], exclude?: Img | null): Img[] {
  return imgs
    .filter((i): i is Img => Boolean(i) && i!.src !== exclude?.src)
    .filter((i, n, a) => a.findIndex((x) => x.src === i.src) === n);
}

export const landscapeFirst = (imgs: Img[]) => [...imgs.filter(isLandscape), ...imgs.filter((i) => !isLandscape(i))];
export const portraitFirst = (imgs: Img[]) => [...imgs.filter((i) => !isLandscape(i)), ...imgs.filter(isLandscape)];
