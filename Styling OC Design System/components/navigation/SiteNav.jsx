import React from 'react';

/* Masthead nav: Bodoni wordmark, 9px links at 0.34em. Transparent over a hero, white once scrolled. */
export function SiteNav({ wordmark = 'Styling OC', align = 'center', links = [], cta, transparent = false, solidAfter = 24, active }) {
  const [solid, setSolid] = React.useState(!transparent);
  React.useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setSolid(window.scrollY > solidAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent, solidAfter]);
  const onDark = transparent && !solid;
  const ink = onDark ? '#fff' : 'var(--ink)';
  const item = (l, isCta) => (
    <a key={l.label} href={l.href} style={{
      fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
      letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
      color: isCta && !onDark ? 'var(--accent-strong)' : ink, textDecoration: 'none',
      borderBottom: 'var(--hairline) solid ' + (active === l.label ? (onDark ? 'rgba(255,255,255,.8)' : 'var(--accent)') : 'transparent'),
      paddingBottom: 4, opacity: active && active !== l.label ? 0.7 : 1,
      transition: 'opacity var(--dur-base) var(--ease-editorial), border-color var(--dur-base) var(--ease-editorial)',
    }}>{l.label}</a>
  );
  const mark = (
    <a href="/" style={{
      fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: '1rem',
      letterSpacing: 'var(--track-display-wide)', textTransform: 'uppercase', color: ink,
      textDecoration: 'none', border: 0, whiteSpace: 'nowrap',
    }}>{wordmark}</a>
  );
  const half = Math.ceil(links.length / 2);
  return (
    <header style={{
      position: transparent ? 'fixed' : 'sticky', top: 0, left: 0, right: 0, zIndex: 40,
      background: onDark ? 'transparent' : 'var(--surface)',
      borderBottom: 'var(--hairline) solid ' + (onDark ? 'rgba(255,255,255,.24)' : 'var(--rule-black)'),
      transition: 'background var(--dur-slow) var(--ease-editorial), border-color var(--dur-slow) var(--ease-editorial)',
    }}>
      <nav style={{
        display: 'grid',
        gridTemplateColumns: align === 'center' ? '1fr auto 1fr' : 'auto 1fr auto',
        alignItems: 'center', gap: 'var(--space-6)',
        padding: 'var(--space-5) var(--gutter)', maxWidth: 'var(--max-page)', margin: '0 auto',
      }}>
        {align === 'center' ? (
          <>
            <div style={{ display: 'flex', gap: 'var(--space-6)' }}>{links.slice(0, half).map((l) => item(l))}</div>
            {mark}
            <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'flex-end', alignItems: 'center' }}>
              {links.slice(half).map((l) => item(l))}
              {cta && item(cta, true)}
            </div>
          </>
        ) : (
          <>
            {mark}
            <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'flex-end' }}>{links.map((l) => item(l))}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{cta && item(cta, true)}</div>
          </>
        )}
      </nav>
    </header>
  );
}
