import React from 'react';

/* Hairline underline that draws left-to-right in brass on hover. */
export function TextLink({ children, href = '#', tone = 'ink', caps = false, style, ...rest }) {
  const [on, setOn] = React.useState(false);
  const color = tone === 'accent' ? 'var(--accent-strong)' : tone === 'inverse' ? 'var(--ink-inverse)' : 'var(--ink)';
  const drawn = tone === 'inverse' ? 'currentColor' : 'var(--accent)';
  return (
    <a href={href} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      style={{
        position: 'relative', display: 'inline-block', color, textDecoration: 'none', border: 0,
        fontFamily: caps ? 'var(--font-label)' : 'inherit',
        fontSize: caps ? 'var(--text-label-l)' : 'inherit',
        fontWeight: caps ? 400 : 'inherit',
        letterSpacing: caps ? 'var(--track-label)' : 'inherit',
        textTransform: caps ? 'uppercase' : 'none',
        paddingBottom: 5, ...style,
      }} {...rest}>
      {children}
      <span aria-hidden style={{
        position: 'absolute', left: 0, bottom: 0, height: 'var(--hairline)', background: drawn,
        width: on ? '100%' : '0%',
        transition: 'width var(--dur-base) var(--ease-rule)',
      }} />
      <span aria-hidden style={{
        position: 'absolute', left: 0, bottom: 0, height: 'var(--hairline)', width: '100%',
        background: 'currentColor', opacity: 0.24,
      }} />
    </a>
  );
}
