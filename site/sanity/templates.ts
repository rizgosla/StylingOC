/* Studio "Create new" templates — one per page shape.
   Each entry pre-fills a Journal post with lorem copy and the block rhythm the
   layout was designed around, so an editor replaces lines rather than assembling
   a body from scratch. `value` is a function: every call builds fresh nodes, and
   therefore fresh _keys, because Sanity refuses array items that share a key.
   Builders come from ./seed/pt, never ./seed/content — the Studio has no use for
   the seed data those builders are used to write. */

import type { Template } from 'sanity';
import { em, gallery, h2, h3, imageBlock, key, li, lorem, p, qa, quote } from './seed/pt';
import type { BlockWidth, Layout, Ratio } from './seed/pt';

/* A picture with no asset: the page renders a "Photograph to come" frame. A `_key`
   belongs only to array items, so the gallery adds one and the image block does not. */
const emptyPicture = () => ({ _type: 'picture', alt: 'Describe the photograph' });
const emptyImage = (width: BlockWidth) => ({ ...imageBlock(null, width), image: emptyPicture() });
const emptyGallery = (n: number, ratio: Ratio = '4:5') => ({ ...gallery([], ratio), items: Array.from({ length: n }, () => ({ ...emptyPicture(), _key: key() })) });
const loremQuote = () => quote(lorem(1), 'Name', 'Client');

const base = (layout: Layout, ratio: Ratio) => ({
  layout,
  title: 'Lorem ipsum: a headline in sentence case',
  standfirst: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  dek: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.',
  category: 'interiors',
  ratio,
  draftNote: 'Template skeleton. Replace every lorem line.',
});

export const postTemplates: Template[] = [
  {
    id: 'post-feature', title: 'Journal post: Feature story', schemaType: 'post',
    value: () => ({
      ...base('feature', '4:5'),
      body: [p(lorem(3)), p(lorem(2)), emptyImage('wide'), p(lorem(3)), h2('Lorem ipsum'), p(lorem(2)), emptyImage('column'), loremQuote(), p(lorem(3)), emptyGallery(2), p(em(lorem(1)))],
    }),
  },
  {
    id: 'post-essay', title: 'Journal post: Photo essay', schemaType: 'post',
    value: () => ({
      ...base('essay', '3:4'),
      body: [p(lorem(2)), emptyGallery(2, '3:2'), p(lorem(3)), emptyImage('full'), emptyImage('column'), p(lorem(2)), h2('Lorem ipsum'), p(lorem(3)), emptyGallery(3), emptyImage('wide'), loremQuote(), emptyImage('column'), p(em(lorem(1)))],
    }),
  },
  {
    id: 'post-interview', title: 'Journal post: Interview', schemaType: 'post',
    value: () => ({
      ...base('interview', '1:1'),
      interviewee: 'Name',
      signoff: 'This conversation has been edited and condensed.',
      body: [
        p(lorem(2)),
        emptyImage('wide'),
        qa('Lorem ipsum dolor sit amet, consectetur adipiscing elit?', p(lorem(2)), p(lorem(2))),
        qa('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris?', p(lorem(3))),
        emptyGallery(2),
        qa('Duis aute irure dolor in reprehenderit in voluptate velit esse?'),
        qa('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia?', p(lorem(2))),
      ],
    }),
  },
  {
    id: 'post-note', title: 'Journal post: Short note', schemaType: 'post',
    value: () => ({
      ...base('note', '4:5'),
      body: [p(lorem(3)), emptyImage('column'), p(lorem(2)), emptyImage('wide'), p(em(lorem(1)))],
    }),
  },
  {
    id: 'post-guide', title: 'Journal post: Guide', schemaType: 'post',
    value: () => ({
      ...base('guide', '4:5'),
      body: [
        p(lorem(2)),
        emptyImage('wide'),
        h2('Lorem ipsum'), p(lorem(3)), emptyImage('column'),
        h2('Dolor sit amet'), p(lorem(2)), li(lorem(1)), li(lorem(1)), li(lorem(1)), emptyImage('column'),
        h2('Consectetur adipiscing'), p(lorem(3)), emptyImage('column'), h3('Lorem subheading'), p(lorem(2)),
      ],
    }),
  },
];
