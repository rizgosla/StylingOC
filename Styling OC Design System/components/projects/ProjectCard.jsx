import React from 'react';

/* No borders, no shadow, no radius. Image plus a hairline metadata line. */
export function ProjectCard({ image, imageAlt = '', name, location, scope, href = '#', ratio = '4 / 5', numeral }) {
  const [on, setOn] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      style={{ display: 'block', textDecoration: 'none', border: 0, color: 'var(--ink)' }}>
      <div style={{ overflow: 'hidden', background: 'var(--surface-sunken)' }}>
        <img src={image} alt={imageAlt} style={{
          width: '100%', aspectRatio: ratio, objectFit: 'cover',
          opacity: on ? 0.86 : 1, transition: 'opacity var(--dur-slow) var(--ease-editorial)',
        }} />
      </div>
      <div style={{
        marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
        borderTop: 'var(--hairline) solid ' + (on ? 'var(--rule-strong)' : 'var(--rule)'),
        transition: 'border-color var(--dur-base) var(--ease-editorial)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-4)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-title)', letterSpacing: 'var(--track-display)', lineHeight: 1.2 }}>{name}</div>
          {location && <div style={{
            marginTop: 6, fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)',
            letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--ink-muted)',
          }}>{location}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          {numeral && <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-label-l)', letterSpacing: 'var(--track-numeral)', color: 'var(--accent-strong)' }}>{numeral}</div>}
          {scope && <div style={{
            marginTop: 6, fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)',
            letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--ink-muted)', whiteSpace: 'nowrap',
          }}>{scope}</div>}
        </div>
      </div>
    </a>
  );
}
