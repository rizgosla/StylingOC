import React from 'react';

/* Underline-only inputs, 9px uppercase labels, one filled brass submit.
   Every field has a real <label>; controls clear 44px for touch. */
export function InquiryForm({ eyebrow = 'Inquiries', title = 'Tell us about your space.', intro, fields = [], submitLabel = 'Send inquiry', note, onSubmit, layout = 'split' }) {
  const [sent, setSent] = React.useState(false);
  const field = (fd) => {
    const shared = {
      id: fd.name, name: fd.name, required: fd.required, placeholder: fd.placeholder || '',
      style: {
        width: '100%', minHeight: 44, border: 0, borderBottom: 'var(--hairline) solid var(--rule-strong)',
        background: 'transparent', padding: '10px 0', color: 'var(--ink)',
        fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-body)', fontSize: 'var(--text-body)',
        outline: 'none', borderRadius: 0,
        transition: 'border-color var(--dur-base) var(--ease-editorial)',
      },
      onFocus: (e) => { e.currentTarget.style.borderBottomColor = 'var(--accent-strong)'; },
      onBlur: (e) => { e.currentTarget.style.borderBottomColor = 'var(--rule-strong)'; },
    };
    return (
      <div key={fd.name} style={{ gridColumn: fd.span === 2 ? 'span 2' : 'span 1' }}>
        <label htmlFor={fd.name} style={{
          display: 'block', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-label)',
          fontSize: 'var(--text-label)', fontWeight: 400, letterSpacing: 'var(--track-label)',
          textTransform: 'uppercase', color: 'var(--ink-muted)',
        }}>{fd.label}{fd.required && <span aria-hidden style={{ color: 'var(--accent-strong)' }}> *</span>}</label>
        {fd.type === 'textarea'
          ? <textarea rows={fd.rows || 3} {...shared} />
          : fd.type === 'select'
            ? <select {...shared}>{(fd.options || []).map((o) => <option key={o} value={o}>{o}</option>)}</select>
            : <input type={fd.type || 'text'} {...shared} />}
      </div>
    );
  };
  return (
    <section style={{ background: 'var(--surface)', padding: 'var(--section-y-tight) 0 var(--section-y)' }}>
      <div style={{ maxWidth: 'var(--max-page)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ height: 'var(--hairline)', background: 'var(--rule-black)', marginBottom: 'var(--space-7)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--grid-gap)' }}>
          <div style={{ gridColumn: layout === 'split' ? '1 / span 4' : '1 / span 8' }}>
            <div style={{
              fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 400,
              letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--accent-strong)',
            }}>{eyebrow}</div>
            <h2 style={{
              marginTop: 'var(--space-4)', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)',
              fontSize: 'var(--text-display-m)', lineHeight: 'var(--leading-display-loose)',
              letterSpacing: 'var(--track-display)', maxWidth: '18ch',
            }}>{title}</h2>
            {intro && <p style={{ marginTop: 'var(--space-5)', fontSize: 'var(--text-body-s)', fontWeight: 'var(--weight-body)', lineHeight: 1.8, color: 'var(--ink-muted)', maxWidth: 'var(--measure-narrow)' }}>{intro}</p>}
          </div>
          <form style={{ gridColumn: layout === 'split' ? '6 / span 6' : '1 / span 7', marginTop: layout === 'split' ? 0 : 'var(--space-7)' }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); onSubmit && onSubmit(e); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6) var(--column-gap)' }}>
              {fields.map(field)}
            </div>
            <div style={{ marginTop: 'var(--space-7)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <button type="submit" style={{
                fontFamily: 'var(--font-label)', fontSize: 'var(--text-label-l)', fontWeight: 400,
                letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
                minHeight: 44, padding: '14px 28px', background: 'var(--accent-strong)',
                border: 'var(--hairline) solid var(--accent-strong)', borderRadius: 0, color: '#fff', cursor: 'pointer',
                transition: 'background var(--dur-base) var(--ease-editorial), border-color var(--dur-base) var(--ease-editorial)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-deep)'; e.currentTarget.style.borderColor = 'var(--accent-deep)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-strong)'; e.currentTarget.style.borderColor = 'var(--accent-strong)'; }}>
                {sent ? 'Thank you' : submitLabel}
              </button>
              {note && <span style={{ fontFamily: 'var(--font-label)', fontSize: 'var(--text-label)', fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{note}</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
