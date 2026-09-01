import React from 'react';

/* Numbered tier. Default is a column panel — three sit side by side inside ServiceMenu,
   divided by vertical hairlines. 'row' is the full-width menu line; 'withImage' is image-led. */
export function ServiceTier({ numeral, title, items = [], price, priceNote, note, image, imageAlt = '', tone = 'day', layout = 'panel' }) {
  const dark = tone === 'night';
  const ink = dark ? '#F5F3EF' : 'var(--ink)';
  const muted = dark ? '#B5B0A8' : 'var(--ink-muted)';
  // Benefit line is body copy, not a caption — must clear 4.5:1, so it uses ink-muted.
  const faint = dark ? '#B5B0A8' : 'var(--ink-muted)';
  const rule = dark ? 'rgba(245,243,239,.20)' : 'var(--rule)';

  const numeralEl = (
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-numeral)', letterSpacing: 'var(--track-numeral)', color: 'var(--accent)', lineHeight: 1 }}>{numeral}</div>
  );
  const titleEl = (
    <h3 style={{
      fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-display-s)',
      lineHeight: 'var(--leading-title)', letterSpacing: 'var(--track-display)', margin: 'var(--space-3) 0 0', color: ink, maxWidth: '18ch',
    }}>{title}</h3>
  );
  const itemsEl = (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: 'var(--text-body-s)', lineHeight: 1.7, color: muted, fontWeight: 'var(--weight-body)' }}>{it}</li>
      ))}
    </ul>
  );
  const noteEl = note && (
    <p style={{ margin: 0, fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'var(--text-body)', lineHeight: 1.5, color: faint }}>{note}</p>
  );
  const priceEl = (
    <div>
      <div style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--text-label-l)', fontWeight: 400, letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: ink }}>{price}</div>
      {priceNote && <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-body-s)', lineHeight: 1.6, color: muted, fontWeight: 'var(--weight-body)', maxWidth: '30ch' }}>{priceNote}</div>}
    </div>
  );

  if (layout === 'panel') {
    return (
      <article style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', paddingBottom: 'var(--space-2)', height: '100%' }}>
        <div>{numeralEl}{titleEl}</div>
        <div style={{ height: 'var(--hairline)', background: rule, width: 40 }} />
        {itemsEl}
        {noteEl}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-5)' }}>{priceEl}</div>
      </article>
    );
  }

  if (layout === 'withImage' && image) {
    return (
      <article style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,3fr) minmax(0,7fr)', gap: 'var(--column-gap)', borderTop: 'var(--hairline) solid ' + rule, padding: 'var(--space-6) 0 var(--space-8)' }}>
        <img src={image} alt={imageAlt} style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>{numeralEl}{titleEl}</div>
          {itemsEl}
          {noteEl}
          {priceEl}
        </div>
      </article>
    );
  }

  return (
    <article style={{
      display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)',
      borderTop: 'var(--hairline) solid ' + rule, padding: 'var(--space-6) 0 var(--space-7)',
    }}>
      <div style={{ gridColumn: '1 / span 3' }}>{numeralEl}{titleEl}</div>
      <div style={{ gridColumn: '5 / span 5', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>{itemsEl}{noteEl}</div>
      <div style={{ gridColumn: '11 / span 2', textAlign: 'right' }}>{priceEl}</div>
    </article>
  );
}
