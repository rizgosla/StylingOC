import React from 'react';

/* Rectangular CTA. No radius, no icons. 'accent' is the one filled brass button per screen. */
export function Button({ children, href, variant = 'outline', size = 'md', disabled = false, onClick, style, ...rest }) {
  const pad = size === 'sm' ? '10px 18px' : size === 'lg' ? '18px 40px' : '14px 28px';
  const base = {
    display: 'inline-block',
    fontFamily: 'var(--font-label)',
    fontSize: size === 'sm' ? 'var(--text-label)' : 'var(--text-label-l)',
    fontWeight: 400,
    letterSpacing: 'var(--track-label)',
    textTransform: 'uppercase',
    lineHeight: 1,
    padding: pad,
    borderRadius: 0,
    background: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1,
    textDecoration: 'none',
    transition: 'background var(--dur-base) var(--ease-editorial), color var(--dur-base) var(--ease-editorial), border-color var(--dur-base) var(--ease-editorial)',
    ...style,
  };
  const skins = {
    outline: { border: 'var(--hairline) solid var(--rule-strong)', color: 'var(--ink)' },
    solid: { border: 'var(--hairline) solid var(--ink)', background: 'var(--ink)', color: 'var(--ink-inverse)' },
    // Fill is accent-strong, not accent: white on #9C7C4A is only 3.9:1 and fails AA for label text.
    accent: { border: 'var(--hairline) solid var(--accent-strong)', background: 'var(--accent-strong)', color: '#fff' },
    onImage: { border: 'var(--hairline) solid rgba(255,255,255,.7)', color: '#fff' },
  };
  const s = { ...base, ...skins[variant] };
  const hover = (e, on) => {
    if (disabled) return;
    const t = e.currentTarget;
    if (variant === 'outline') { t.style.background = on ? 'var(--ink)' : 'transparent'; t.style.color = on ? 'var(--ink-inverse)' : 'var(--ink)'; t.style.borderColor = on ? 'var(--ink)' : 'var(--rule-strong)'; }
    if (variant === 'solid') { t.style.background = on ? 'var(--ink-700)' : 'var(--ink)'; }
    if (variant === 'accent') { t.style.background = on ? 'var(--accent-deep)' : 'var(--accent-strong)'; t.style.borderColor = on ? 'var(--accent-deep)' : 'var(--accent-strong)'; }
    if (variant === 'onImage') { t.style.background = on ? 'rgba(255,255,255,.14)' : 'transparent'; t.style.borderColor = on ? '#fff' : 'rgba(255,255,255,.7)'; }
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return (
    <Tag href={href} onClick={disabled ? undefined : onClick} disabled={Tag === 'button' ? disabled : undefined}
      style={s} onMouseEnter={(e) => hover(e, true)} onMouseLeave={(e) => hover(e, false)} {...rest}>
      {children}
    </Tag>
  );
}
