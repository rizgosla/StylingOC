import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const SINGLETONS = new Set(['homePage', 'siteSettings']);

export default defineConfig({
  name: 'styling-oc',
  title: 'Styling OC',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Home').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('post').title('Journal'),
            S.documentTypeListItem('servicePackage').title('Service packages'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.divider(),
            S.documentTypeListItem('inquiry').title('Inquiries'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the "new document" menu.
    templates: (templates) => templates.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    // Singletons cannot be duplicated, unpublished or deleted.
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
});
