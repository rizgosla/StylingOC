import React from 'react';

/* Drag-divider comparison. Highest-value component for the real-estate audience. */
export function BeforeAfter({ before, after, beforeLabel = 'Before', afterLabel = 'After', caption, initial = 50, ratio = '16 / 10' }) {
  const [pos, setPos] = React.useState(initial);
  const box = React.useRef(null);
  const dragging = React.useRef(false);
  const setFromClient = (clientX) => {
    const el = box.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  React.useEffect(() => {
    const move = (e) => { if (!dragging.current) return; setFromClient(e.touches ? e.touches[0].clientX : e.clientX); };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);
  const label = (text, side) => (
    <span style={{
      position: 'absolute', bottom: 18, [side]: 20, zIndex: 3,
      fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label-wide)',
      textTransform: 'uppercase', color: '#fff', textShadow: '0 1px 12px rgba(28,26,24,.55)',
    }}>{text}</span>
  );
  return (
    <figure style={{ margin: 0 }}>
      <div ref={box} onMouseDown={(e) => { dragging.current = true; setFromClient(e.clientX); }}
        onTouchStart={(e) => { dragging.current = true; setFromClient(e.touches[0].clientX); }}
        style={{ position: 'relative', width: '100%', aspectRatio: ratio, overflow: 'hidden', cursor: 'ew-resize', background: 'var(--surface-sunken)', userSelect: 'none' }}>
        <img src={after} alt={afterLabel} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, width: pos + '%', overflow: 'hidden' }}>
          <img src={before} alt={beforeLabel} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', minWidth: box.current ? box.current.offsetWidth : '100%' }} />
        </div>
        {label(beforeLabel, 'left')}
        {label(afterLabel, 'right')}
        <div role="slider" aria-label="Before and after" aria-valuenow={Math.round(pos)} aria-valuemin={0} aria-valuemax={100} tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4)); if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4)); }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: pos + '%', width: 1, background: 'rgba(255,255,255,.9)', zIndex: 2 }}>
          <span aria-hidden style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 46, height: 46, border: 'var(--hairline) solid rgba(255,255,255,.9)', borderRadius: '50%',
            display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'var(--font-label)', fontSize: 11, letterSpacing: '0.1em',
            background: 'rgba(28,26,24,.18)', backdropFilter: 'blur(2px)',
          }}>&#8592;&#8594;</span>
        </div>
      </div>
      {caption && <figcaption style={{
        marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-5)', alignItems: 'baseline',
        fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', letterSpacing: 'var(--track-label)',
        textTransform: 'uppercase', color: 'var(--ink-faint)',
      }}>{caption}</figcaption>}
    </figure>
  );
}
