import React from 'react';

/* Dual portrait, short editorial bio, signature-style attribution. */
export function FounderBio({ portraits = [], eyebrow = 'The Studio', title, body = [], signature, pillars = [], action, layout = 'portraitsLeft' }) {
  const portraitsLeft = layout === 'portraitsLeft';
  return (
    <section style={{ background: 'var(--surface-raised)', padding: 'var(--section-y) 0' }}>
      <div style={{
        maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)',
        display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)', alignItems: 'start',
      }}>
        <div style={{ gridColumn: portraitsLeft ? '1 / span 5' : '8 / span 5', display: 'grid', gridTemplateColumns: portraits.length > 1 ? '1fr 1fr' : '1fr', gap: 'var(--grid-gap)' }}>
          {portraits.map((p, i) => (
            <img key={p.src} src={p.src} alt={p.alt || ''} style={{
              width: '100%', aspectRatio: '3 / 4', objectFit: 'cover',
              marginTop: i === 1 ? 'var(--space-8)' : 0,
            }} />
          ))}
        </div>
        <div style={{ gridColumn: portraitsLeft ? '7 / span 5' : '2 / span 5', paddingTop: 'var(--space-6)' }}>
          <div style={{
            fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label-wide)',
            textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 'var(--space-5)',
          }}>{eyebrow}</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-display-m)',
            lineHeight: 'var(--leading-display-loose)', letterSpacing: 'var(--track-display)', margin: 0,
          }}>{title}</h2>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 'var(--measure)' }}>
            {body.map((p, i) => (
              <p key={i} style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body-loose)', color: 'var(--ink-muted)', margin: 0 }}>{p}</p>
            ))}
          </div>
          {pillars.length > 0 && (
            <div style={{
              marginTop: 'var(--space-7)', paddingTop: 'var(--space-5)', borderTop: 'var(--hairline) solid var(--rule)',
              fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label-wide)',
              textTransform: 'uppercase', color: 'var(--ink)',
            }}>{pillars.join('  ·  ')}</div>
          )}
          {signature && <div style={{
            marginTop: 'var(--space-7)', fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
            fontSize: '1.75rem', color: 'var(--ink)',
          }}>{signature}</div>}
          {action && <div style={{ marginTop: 'var(--space-6)' }}>{action}</div>}
        </div>
      </div>
    </section>
  );
}
