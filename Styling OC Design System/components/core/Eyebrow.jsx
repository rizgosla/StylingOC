import React from 'react';

/* Wide-tracked uppercase label, 9px. Optional brass numeral and trailing rule. */
export function Eyebrow({ children, numeral, rule = false, tone = 'accent', as = 'div', style }) {
  const Tag = as;
  const color = tone === 'inverse' ? 'rgba(255,255,255,.86)' : tone === 'ink' ? 'var(--ink)' : tone === 'muted' ? 'var(--ink-muted)' : 'var(--accent-strong)';
  return (
    <Tag style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', ...style }}>
      {numeral && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-numeral)', letterSpacing: 'var(--track-numeral)', color: 'var(--accent)', lineHeight: 1 }}>{numeral}</span>
      )}
      <span style={{
        fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
        letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color,
        lineHeight: 'var(--leading-label)', whiteSpace: 'nowrap',
      }}>{children}</span>
      {rule && <span aria-hidden style={{ flex: 1, height: 'var(--hairline)', background: tone === 'inverse' ? 'rgba(255,255,255,.3)' : 'var(--rule)' }} />}
    </Tag>
  );
}
