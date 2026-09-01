import React from 'react';

/* Full-bleed image with a centered masthead headline over a scrim, and an optional
   tiny caption immediately below the image. Slow fade in; no parallax, no scale. */
export function EditorialHero({ image, imageAlt = '', eyebrow, headline, sublines = [], meta, caption, align = 'center', height = '100vh', scrim = true, children }) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setShown(true), 40); return () => clearTimeout(t); }, []);
  const col = align === 'center' ? '2 / span 10' : align === 'right' ? '6 / span 6' : '1 / span 8';
  const fade = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'none' : 'translateY(8px)',
    transition: 'opacity var(--dur-reveal) var(--ease-editorial), transform var(--dur-reveal) var(--ease-editorial)',
  };
  return (
    <section>
      <div style={{ position: 'relative', height, minHeight: String(height).includes('vh') ? 460 : undefined, overflow: 'hidden', background: 'var(--surface-sunken)' }}>
        <img src={image} alt={imageAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {scrim && <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'var(--overlay-scrim)' }} />}
        {/* Second band under the text column: the scrim alone cannot guarantee 4.5:1 over a bright photo. */}
        {scrim && <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%', background: 'var(--overlay-band)' }} />}
        <div style={{
          position: 'relative', height: '100%', maxWidth: 'var(--max-page)', margin: '0 auto',
          padding: '0 var(--gutter) clamp(40px,5vw,80px)', display: 'grid',
          gridTemplateColumns: 'repeat(12,1fr)', alignContent: 'end', gap: 'var(--grid-gap)',
        }}>
          <div style={{ gridColumn: col, textAlign: align === 'center' ? 'center' : 'left', ...fade }}>
            {eyebrow && <div style={{
              fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
              letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: '#fff', marginBottom: 'var(--space-5)',
            }}>{eyebrow}</div>}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', color: '#fff',
              fontSize: 'var(--text-display-xl)', lineHeight: 'var(--leading-display)', letterSpacing: 'var(--track-display)',
              margin: align === 'center' ? '0 auto' : 0, maxWidth: '20ch',
            }}>{headline}</h1>
            {sublines.length > 0 && (
              <div style={{
                marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 4,
                alignItems: align === 'center' ? 'center' : 'flex-start',
              }}>
                {sublines.map((s) => (
                  <span key={s} style={{
                    fontFamily: 'var(--font-label)', fontSize: 'var(--text-lede)', fontWeight: 300,
                    letterSpacing: 'var(--track-lede)', textTransform: 'uppercase', color: '#fff', lineHeight: 1.7,
                  }}>{s}</span>
                ))}
              </div>
            )}
            {children && <div style={{ marginTop: 'var(--space-7)' }}>{children}</div>}
          </div>
          {meta && (
            <div style={{
              gridColumn: '1 / span 12', marginTop: 'var(--space-7)',
              borderTop: 'var(--hairline) solid rgba(255,255,255,.4)', paddingTop: 'var(--space-4)',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 'var(--grid-gap)', ...fade,
            }}>
              {meta.map((m) => (
                <div key={m.label}>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'rgba(255,255,255,.78)' }}>{m.label}</div>
                  <div style={{ marginTop: 6, fontFamily: 'var(--font-label)', fontSize: 'var(--text-label-l)', letterSpacing: '0.08em', color: '#fff' }}>{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {caption && (
        <div style={{ maxWidth: 'var(--max-page)', margin: '0 auto', padding: 'var(--space-3) var(--gutter) 0' }}>
          <span style={{
            fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label)',
            textTransform: 'uppercase', color: 'var(--ink-faint)',
          }}>{caption}</span>
        </div>
      )}
    </section>
  );
}
