import React from 'react';

/* Asymmetric split: 6-column image beside a 4-column text block, offset vertically. */
export function SplitFeature({ image, imageAlt = '', eyebrow, numeral, title, body = [], caption, action, imageSide = 'left', offset = 'top', ratio = '4 / 5' }) {
  const alignSelf = offset === 'top' ? 'start' : offset === 'bottom' ? 'end' : 'center';
  const imgCol = imageSide === 'left' ? '1 / span 6' : '7 / span 6';
  const txtCol = imageSide === 'left' ? '8 / span 4' : '2 / span 4';
  return (
    <section style={{ background: 'var(--surface)', padding: 'var(--section-y) 0' }}>
      <div style={{
        maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)',
        display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)',
      }}>
        <figure style={{ gridColumn: imgCol, margin: 0 }}>
          <img src={image} alt={imageAlt} style={{ width: '100%', aspectRatio: ratio, objectFit: 'cover' }} />
          {caption && <figcaption style={{
            marginTop: 'var(--space-3)', fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)',
            letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--ink-faint)',
          }}>{caption}</figcaption>}
        </figure>
        <div style={{ gridColumn: txtCol, alignSelf, paddingTop: offset === 'top' ? 'var(--space-6)' : 0 }}>
          {(eyebrow || numeral) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {numeral && <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-numeral)', letterSpacing: 'var(--track-numeral)', color: 'var(--accent)', lineHeight: 1 }}>{numeral}</span>}
              {eyebrow && <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400, letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--accent-strong)' }}>{eyebrow}</span>}
            </div>
          )}
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-display-m)',
            lineHeight: 'var(--leading-display-loose)', letterSpacing: 'var(--track-display)', margin: 0, color: 'var(--ink)',
          }}>{title}</h2>
          <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 'var(--measure)' }}>
            {body.map((p, i) => (
              <p key={i} style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-body)', lineHeight: 'var(--leading-body)', color: 'var(--ink-muted)', margin: 0 }}>{p}</p>
            ))}
          </div>
          {action && <div style={{ marginTop: 'var(--space-6)' }}>{action}</div>}
        </div>
      </div>
    </section>
  );
}
