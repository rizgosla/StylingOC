import React from 'react';

/* Container for ServiceTier panels: heavy top rule, section head, then columns
   divided by vertical hairlines. Tight grid — this is a printed menu, not a pricing page. */
export function ServiceMenu({ eyebrow, title, lede, columns = 3, tone = 'day', children }) {
  const dark = tone === 'night';
  const ink = dark ? '#F5F3EF' : 'var(--ink)';
  const muted = dark ? '#B5B0A8' : 'var(--ink-muted)';
  const rule = dark ? 'rgba(245,243,239,.20)' : 'var(--rule)';
  const heavy = dark ? 'rgba(245,243,239,.9)' : 'var(--rule-black)';
  const kids = React.Children.toArray(children);
  return (
    <section style={{ background: dark ? '#141414' : 'var(--surface)', padding: 'var(--section-y-tight) 0 var(--section-y)' }}>
      <div style={{ maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)', alignItems: 'end', paddingBottom: 'var(--space-6)' }}>
          <div style={{ gridColumn: '1 / span 6' }}>
            {eyebrow && <div style={{
              fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
              letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--accent-strong)',
            }}>{eyebrow}</div>}
            {title && <h2 style={{
              marginTop: 'var(--space-4)', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
              fontSize: 'var(--text-display-l)', lineHeight: 'var(--leading-display)', letterSpacing: 'var(--track-display)', color: ink,
            }}>{title}</h2>}
          </div>
          {lede && <p style={{
            gridColumn: '8 / span 4', margin: 0, fontSize: 'var(--text-body-s)', lineHeight: 1.8,
            color: muted, fontWeight: 'var(--weight-body)',
          }}>{lede}</p>}
        </div>
        <div style={{ height: 'var(--hairline)', background: heavy }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + columns + ',1fr)', alignItems: 'stretch' }}>
          {kids.map((child, i) => (
            <div key={i} style={{
              padding: 'var(--space-6) var(--column-gap) var(--space-4) ' + (i === 0 ? '0' : 'var(--column-gap)'),
              borderLeft: i === 0 ? 'none' : 'var(--hairline) solid ' + rule,
              display: 'flex', flexDirection: 'column',
            }}>{child}</div>
          ))}
        </div>
        <div style={{ height: 'var(--hairline)', background: rule }} />
      </div>
    </section>
  );
}
