import { defineField, defineType, defineArrayMember } from 'sanity';

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

/* Portable Text body for Journal posts: paragraphs, one heading level, lists,
   bold / italic / link, plus three studio blocks. No colours, no font controls. */
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
      ],
      lists: [{ title: 'List', value: 'bullet' }],
      marks: {
        decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }],
        annotations: [
          {
            name: 'link', type: 'object', title: 'Link',
            fields: [defineField({ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }) })],
          },
        ],
      },
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
  ],
});

export const navLink = defineType({
  name: 'navLink', title: 'Link', type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'Destination', type: 'string', description: 'A path like /journal/ or /#inquire, or a full URL.', validation: (r) => r.required() }),
  ],
});
