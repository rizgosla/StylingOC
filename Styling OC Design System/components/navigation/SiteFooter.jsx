import React from 'react';

/* Heavy black top rule, three columns divided by hairlines, tagline in wide caps along the bottom. */
export function SiteFooter({ wordmark = 'Styling OC', columns = [], tagline = 'Vision · Intention · Beauty · Balance', note }) {
  return (
    <footer style={{ background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ height: 'var(--hairline)', background: 'var(--rule-black)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 0, paddingTop: 'var(--space-6)' }}>
          {columns.map((c, i) => (
            <div key={c.title} style={{
              padding: '0 var(--column-gap) var(--space-8) ' + (i === 0 ? '0' : 'var(--column-gap)'),
              borderLeft: i === 0 ? 0 : 'var(--hairline) solid var(--rule)',
            }}>
              <div style={{
                fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
                letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
                color: 'var(--accent-strong)', marginBottom: 'var(--space-5)',
              }}>{c.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {c.items.map((it) => (
                  it.href
                    ? <a key={it.label} href={it.href} style={{ fontSize: 'var(--text-body-s)', fontWeight: 'var(--weight-body)', color: 'var(--ink)', textDecoration: 'none', border: 0 }}>{it.label}</a>
                    : <span key={it.label} style={{ fontSize: 'var(--text-body-s)', fontWeight: 'var(--weight-body)', color: 'var(--ink-muted)' }}>{it.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: 'var(--hairline) solid var(--rule)',
          padding: 'var(--space-5) 0', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)',
          alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
            letterSpacing: 'var(--track-label-wide)', textTransform: 'uppercase', color: 'var(--ink)',
          }}>{tagline}</div>
          <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: '0.875rem', letterSpacing: 'var(--track-display-wide)', textTransform: 'uppercase' }}>{wordmark}</span>
            {note && <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'var(--ink-faint)' }}>{note}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
