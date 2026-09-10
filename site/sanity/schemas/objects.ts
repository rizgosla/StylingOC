import { defineField, defineType, defineArrayMember } from 'sanity';

/* Crop shapes offered wherever a picture is placed against a fixed frame. */
export const RATIOS = [
  { title: '3:2 landscape', value: '3:2' },
  { title: '4:5 portrait', value: '4:5' },
  { title: '3:4 portrait', value: '3:4' },
  { title: '1:1 square', value: '1:1' },
];

/* Shared by every rich-text array: bold / italic / link, nothing else. */
const DECORATORS = [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }];
const LINK = defineField({
  name: 'link', title: 'Link', type: 'object',
  fields: [defineField({ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }) })],
});

/* Every picture editors place: hotspot on, alt required, optional caption. */
export const picture = defineType({
  name: 'picture',
  title: 'Photograph',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the photograph for people who cannot see it. Required.', validation: (r) => r.required().max(240) }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Tiny line under the image, e.g. "Living room, Newport Coast". Optional.' }),
  ],
});

/* Plain paragraphs, no headings or lists. Used for a Q&A answer; kept as a named
   type so future blocks can reuse it. */
export const paragraphs = defineType({
  name: 'paragraphs',
  title: 'Text',
  type: 'array',
  of: [defineArrayMember({ type: 'block', styles: [{ title: 'Paragraph', value: 'normal' }], lists: [], marks: { decorators: DECORATORS, annotations: [LINK] } })],
});

/* One to three photographs across, sharing a crop. */
export const gallery = defineType({
  name: 'gallery', title: 'Gallery', type: 'object',
  fields: [
    defineField({ name: 'items', title: 'Photographs', type: 'array', of: [defineArrayMember({ type: 'picture' })], description: 'One to three across. A single photograph renders as a wide plate.', validation: (r) => r.min(1).max(3) }),
    defineField({ name: 'ratio', title: 'Shared crop', type: 'string', initialValue: '4:5', options: { list: RATIOS, layout: 'radio' } }),
    defineField({ name: 'caption', title: 'Group caption', type: 'string', description: 'Optional line under the row, shown in addition to any captions on the photographs.' }),
  ],
  preview: {
    /* items.length is not selectable, so count the first three slots instead. */
    select: { media: 'items.0', firstCaption: 'items.0.caption', second: 'items.1', third: 'items.2', caption: 'caption' },
    prepare: ({ media, firstCaption, second, third, caption }) => {
      const n = [media, second, third].filter(Boolean).length;
      return { media, title: caption || firstCaption || 'Gallery', subtitle: `${n} photograph${n === 1 ? '' : 's'}` };
    },
  },
});

/* One exchange in an interview. */
export const qaPair = defineType({
  name: 'qaPair', title: 'Question and answer', type: 'object',
  fields: [
    defineField({ name: 'question', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'paragraphs', description: 'Leave empty while waiting; the page shows "Answer to come".' }),
  ],
  preview: { select: { question: 'question' }, prepare: ({ question }) => ({ title: question, subtitle: 'Q & A' }) },
});

/* Portable Text body for Journal posts: paragraphs, two heading levels, lists,
   bold / italic / link, plus five studio blocks. No colours, no font controls. */
export const body = defineType({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Section heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
      ],
      lists: [{ title: 'List', value: 'bullet' }],
      marks: { decorators: DECORATORS, annotations: [LINK] },
    }),
    defineArrayMember({
      name: 'imageBlock', title: 'Photograph', type: 'object',
      fields: [
        defineField({ name: 'image', title: 'Photograph', type: 'picture' }),
        defineField({
          name: 'width', title: 'Width', type: 'string', initialValue: 'wide',
          options: { list: [{ title: 'Column (text width)', value: 'column' }, { title: 'Wide', value: 'wide' }, { title: 'Full bleed', value: 'full' }], layout: 'radio' },
        }),
      ],
      preview: { select: { media: 'image', title: 'image.caption', subtitle: 'width' }, prepare: ({ media, title, subtitle }) => ({ media, title: title || 'Photograph', subtitle }) },
    }),
    defineArrayMember({
      name: 'quoteBlock', title: 'Pull quote', type: 'object',
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required() }),
        defineField({ name: 'attribution', title: 'Attribution', type: 'string', description: 'First name only, e.g. Virra.', validation: (r) => r.required() }),
        defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g. Interior design client' }),
      ],
      preview: { select: { title: 'quote', subtitle: 'attribution' } },
    }),
    defineArrayMember({
      name: 'serviceCallout', title: 'Service callout', type: 'object',
      fields: [defineField({ name: 'package', title: 'Package', type: 'reference', to: [{ type: 'servicePackage' }], validation: (r) => r.required() })],
      preview: { select: { title: 'package.title', subtitle: 'package.price' } },
    }),
    defineArrayMember({ type: 'gallery' }),
    defineArrayMember({ type: 'qaPair' }),
  ],
});

export const navLink = defineType({
  name: 'navLink', title: 'Link', type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'Destination', type: 'string', description: 'A path like /journal/ or /#inquire, or a full URL.', validation: (r) => r.required() }),
  ],
});
