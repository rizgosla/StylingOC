import React from 'react';

/* Oversized serif quotation mark, italic body, client attribution. */
export function PullQuote({ quote, attribution, role, tone = 'day', align = 'left', size = 'lg' }) {
  const dark = tone === 'night';
  const fs = size === 'sm' ? 'var(--text-lede)' : size === 'md' ? 'var(--text-display-s)' : 'var(--text-display-m)';
  return (
    <section style={{
      background: dark ? '#141414' : 'var(--surface)',
      padding: 'var(--section-y) 0',
    }}>
      <div style={{
        maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)',
        display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)',
      }}>
        <div style={{ gridColumn: align === 'left' ? '2 / span 7' : '4 / span 7' }}>
          <div aria-hidden style={{
            fontFamily: 'var(--font-display)', fontSize: '5.5rem', lineHeight: 0.6, color: 'var(--accent)',
            opacity: dark ? 0.9 : 0.75, marginBottom: 'var(--space-6)',
          }}>&ldquo;</div>
          <blockquote style={{ margin: 0 }}>
            <p style={{
              fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontWeight: 300,
              fontSize: fs, lineHeight: 1.34, letterSpacing: '0.005em',
              color: dark ? '#F5F3EF' : 'var(--ink)', margin: 0, maxWidth: '30ch',
            }}>{quote}</p>
          </blockquote>
          <div style={{ marginTop: 'var(--space-7)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span aria-hidden style={{ width: 40, height: 'var(--hairline)', background: dark ? 'var(--rule-inverse)' : 'var(--rule-strong)' }} />
            <span style={{
              fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label-wide)',
              textTransform: 'uppercase', color: dark ? '#B5B0A8' : 'var(--ink-muted)',
            }}>{attribution}{role ? ' · ' + role : ''}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
