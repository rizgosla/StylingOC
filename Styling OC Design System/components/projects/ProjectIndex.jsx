import React from 'react';
import { ProjectCard } from './ProjectCard.jsx';

/* Index grid: heavy rule opens the section, varied ratios, small column offsets. */
export function ProjectIndex({ eyebrow, title, lede, projects = [], columns = 3, offsets = [0, 56, 24], footer }) {
  return (
    <section style={{ background: 'var(--surface)', padding: 'var(--section-y-tight) 0 var(--section-y)' }}>
      <div style={{ maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        {(eyebrow || title) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)', alignItems: 'end', paddingBottom: 'var(--space-6)' }}>
            <div style={{ gridColumn: '1 / span 6' }}>
              {eyebrow && <div style={{
                fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
                letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--accent-strong)',
              }}>{eyebrow}</div>}
              {title && <h2 style={{
                marginTop: 'var(--space-4)', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
                fontSize: 'var(--text-display-l)', lineHeight: 'var(--leading-display)', letterSpacing: 'var(--track-display)',
              }}>{title}</h2>}
            </div>
            {lede && <p style={{ gridColumn: '8 / span 4', margin: 0, fontSize: 'var(--text-body-s)', fontWeight: 'var(--weight-body)', lineHeight: 1.8, color: 'var(--ink-muted)' }}>{lede}</p>}
          </div>
        )}
        <div style={{ height: 'var(--hairline)', background: 'var(--rule-black)', marginBottom: 'var(--space-7)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + columns + ',1fr)', gap: 'var(--column-gap)', alignItems: 'start' }}>
          {projects.map((p, i) => (
            <div key={p.name} style={{ marginTop: offsets[i % columns] || 0 }}>
              <ProjectCard {...p} numeral={p.numeral || String(i + 1).padStart(2, '0')} />
            </div>
          ))}
        </div>
        {footer && <div style={{ marginTop: 'var(--space-8)', borderTop: 'var(--hairline) solid var(--rule)', paddingTop: 'var(--space-4)' }}>{footer}</div>}
      </div>
    </section>
  );
}
