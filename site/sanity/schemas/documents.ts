import { defineField, defineType, defineArrayMember } from 'sanity';

const CATEGORIES = [
  { title: 'Interiors', value: 'interiors' },
  { title: 'Personal styling', value: 'styling' },
  { title: 'The studio', value: 'studio' },
];
const RATIOS = [
  { title: '3:2 landscape', value: '3:2' },
  { title: '4:5 portrait', value: '4:5' },
  { title: '3:4 portrait', value: '3:4' },
  { title: '1:1 square', value: '1:1' },
];

export const post = defineType({
  name: 'post', title: 'Journal post', type: 'document',
  groups: [{ name: 'story', title: 'Story', default: true }, { name: 'meta', title: 'Details' }],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'story', description: 'Sentence case: "A living room in Orange County, reconsidered".', validation: (r) => r.required().max(90) }),
    defineField({ name: 'slug', type: 'slug', group: 'meta', options: { source: 'title', maxLength: 80 }, validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', group: 'meta', options: { list: CATEGORIES, layout: 'radio' }, initialValue: 'interiors', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', group: 'meta', description: 'e.g. Newport Coast. Shown after the category.' }),
    defineField({ name: 'publishedAt', title: 'Date', type: 'date', group: 'meta', validation: (r) => r.required() }),
    defineField({ name: 'standfirst', type: 'string', group: 'story', description: 'One line under the headline, set in small capitals. Keep it under 120 characters.', validation: (r) => r.required().max(140) }),
    defineField({ name: 'dek', title: 'Grid line', type: 'string', group: 'story', description: 'One short sentence shown under the title in story grids.', validation: (r) => r.required().max(100) }),
    defineField({ name: 'leadImage', title: 'Lead photograph', type: 'picture', group: 'story', description: 'Leave empty to show a "Photograph to come" frame.' }),
    defineField({ name: 'ratio', title: 'Grid tile shape', type: 'string', group: 'meta', options: { list: RATIOS, layout: 'radio' }, initialValue: '4:5', description: 'How this story crops in the home and journal grids. Vary these so the grid stays uneven.' }),
    defineField({ name: 'photoCredit', title: 'Photography credit', type: 'string', group: 'meta' }),
    defineField({ name: 'body', type: 'body', group: 'story' }),
    defineField({ name: 'draftNote', title: 'Draft note', type: 'text', rows: 3, group: 'meta', description: 'While this has text, the page shows a small "Draft - for client review" line. Clear it when the story is approved.' }),
  ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'leadImage', draft: 'draftNote' },
    prepare: ({ title, subtitle, media, draft }) => ({ title, subtitle: `${subtitle ?? ''}${draft ? ' · DRAFT' : ''}`, media }),
  },
});

export const servicePackage = defineType({
  name: 'servicePackage', title: 'Service package', type: 'document',
  fields: [
    defineField({ name: 'line', type: 'string', options: { list: [{ title: 'Interior design', value: 'interiors' }, { title: 'Personal styling', value: 'styling' }], layout: 'radio' }, validation: (r) => r.required() }),
    defineField({ name: 'numeral', type: 'string', description: 'Two digits, e.g. 01.', validation: (r) => r.required().regex(/^\d{2}$/, { name: 'two digits' }) }),
    defineField({ name: 'title', type: 'string', description: 'Title Case - package names are proper nouns.', validation: (r) => r.required() }),
    defineField({ name: 'items', title: 'What is included', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'price', type: 'string', description: 'Stated plainly and completely: "$500 per hour", "$20,000 – $40,000".', validation: (r) => r.required() }),
    defineField({ name: 'priceNote', type: 'string', description: 'Qualifier, e.g. "Depending on square footage and design considerations."' }),
    defineField({ name: 'note', title: 'Benefit line', type: 'string', description: 'One italic line, e.g. "A focused refresh designed to make your existing wardrobe work beautifully."' }),
    defineField({ name: 'image', title: 'Photograph', type: 'picture', description: 'Shown in the interiors menu. Leave empty for a "Photograph to come" frame.' }),
  ],
  orderings: [{ title: 'Menu order', name: 'menu', by: [{ field: 'line', direction: 'asc' }, { field: 'numeral', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', numeral: 'numeral', price: 'price', line: 'line' },
    prepare: ({ title, numeral, price, line }) => ({ title: `${numeral} ${title}`, subtitle: `${line} · ${price}` }),
  },
});

export const testimonial = defineType({
  name: 'testimonial', title: 'Testimonial', type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 4, description: 'Client words, verbatim. Trim to a single held thought.', validation: (r) => r.required() }),
    defineField({ name: 'attribution', type: 'string', description: 'First name only.', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', description: 'e.g. Interior design client' }),
  ],
  preview: { select: { title: 'attribution', subtitle: 'quote' } },
});

export const homePage = defineType({
  name: 'homePage', title: 'Home', type: 'document',
  groups: [
    { name: 'stories', title: 'Stories', default: true }, { name: 'services', title: 'Services' },
    { name: 'studio', title: 'The studio' }, { name: 'inquiry', title: 'Inquiry' },
  ],
  fields: [
    defineField({ name: 'leadStory', title: 'Lead story', type: 'reference', to: [{ type: 'post' }], group: 'stories', validation: (r) => r.required() }),
    defineField({ name: 'latest', title: 'The latest (three stories)', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })], group: 'stories', description: 'Leave empty to show the three newest posts automatically.', validation: (r) => r.max(3) }),
    defineField({ name: 'featuredPost', title: 'Feature story', type: 'reference', to: [{ type: 'post' }], group: 'stories', description: 'The story shown large with a drop cap, lower on the page.' }),
    defineField({ name: 'interiorsEyebrow', type: 'string', group: 'services', initialValue: 'Interior design' }),
    defineField({ name: 'interiorsHeadline', type: 'string', group: 'services', initialValue: 'Design that feels like home.' }),
    defineField({ name: 'interiorsIntro', type: 'text', rows: 3, group: 'services' }),
    defineField({ name: 'stylingEyebrow', type: 'string', group: 'services', initialValue: 'Personal styling' }),
    defineField({ name: 'stylingHeadline', type: 'string', group: 'services', initialValue: 'Style that empowers. Confidence that lasts.' }),
    defineField({ name: 'stylingIntro', type: 'text', rows: 3, group: 'services' }),
    defineField({ name: 'testimonial', type: 'reference', to: [{ type: 'testimonial' }], group: 'stories' }),
    defineField({ name: 'studioEyebrow', type: 'string', group: 'studio', initialValue: 'The studio' }),
    defineField({ name: 'studioHeadline', type: 'string', group: 'studio', initialValue: 'Jenn & Merlyn' }),
    defineField({ name: 'studioBody', title: 'Studio paragraphs', type: 'array', of: [defineArrayMember({ type: 'text', rows: 3 })], group: 'studio' }),
    defineField({ name: 'studioPortrait', type: 'picture', group: 'studio' }),
    defineField({ name: 'pillars', type: 'array', of: [defineArrayMember({ type: 'string' })], group: 'studio', initialValue: ['Vision', 'Intention', 'Beauty', 'Balance'] }),
    defineField({ name: 'inquiryEyebrow', type: 'string', group: 'inquiry', initialValue: 'Inquiries' }),
    defineField({ name: 'inquiryHeadline', type: 'string', group: 'inquiry', initialValue: 'Tell us about your space.' }),
    defineField({ name: 'inquiryIntro', type: 'text', rows: 2, group: 'inquiry' }),
    defineField({ name: 'inquiryNote', type: 'string', group: 'inquiry', initialValue: 'We reply within two business days.' }),
  ],
  preview: { prepare: () => ({ title: 'Home' }) },
});

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Styling OC', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Site description', type: 'text', rows: 3, description: 'Used by search engines and link previews.' }),
    defineField({ name: 'tagline', title: 'Masthead tagline', type: 'string', initialValue: 'Interiors · Personal Styling · Orange County' }),
    defineField({ name: 'footerTagline', type: 'string', initialValue: 'Thoughtful design. Personalised spaces. Timeless living.' }),
    defineField({ name: 'nav', title: 'Navigation', type: 'array', of: [defineArrayMember({ type: 'navLink' })], validation: (r) => r.max(6) }),
    defineField({
      name: 'footerColumns', type: 'array', validation: (r) => r.max(1),
      description: 'Unused. The footer now lists the site navigation above, plus the Instagram link.',
      of: [defineArrayMember({ type: 'object', name: 'footerColumn', fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'navLink' })] }),
      ] })],
    }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'location', type: 'string', initialValue: 'Orange County, California' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

/* Written by the Cloudflare function; read-only inbox in Studio. */
export const inquiry = defineType({
  name: 'inquiry', title: 'Inquiry', type: 'document', readOnly: true,
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'interest', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'receivedAt', type: 'datetime' }),
  ],
  orderings: [{ title: 'Newest first', name: 'recent', by: [{ field: 'receivedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'interest', date: 'receivedAt' },
    prepare: ({ title, subtitle, date }) => ({ title, subtitle: `${subtitle ?? ''} · ${date ? new Date(date).toLocaleDateString('en-US') : ''}` }),
  },
});
