/* @ds-bundle: {"format":4,"namespace":"StylingOCDesignSystem_a06b26","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"TextLink","sourcePath":"components/core/TextLink.jsx"},{"name":"EditorialHero","sourcePath":"components/editorial/EditorialHero.jsx"},{"name":"FounderBio","sourcePath":"components/editorial/FounderBio.jsx"},{"name":"PullQuote","sourcePath":"components/editorial/PullQuote.jsx"},{"name":"SplitFeature","sourcePath":"components/editorial/SplitFeature.jsx"},{"name":"InquiryForm","sourcePath":"components/forms/InquiryForm.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteNav","sourcePath":"components/navigation/SiteNav.jsx"},{"name":"BeforeAfter","sourcePath":"components/projects/BeforeAfter.jsx"},{"name":"ProjectCard","sourcePath":"components/projects/ProjectCard.jsx"},{"name":"ProjectIndex","sourcePath":"components/projects/ProjectIndex.jsx"},{"name":"ServiceMenu","sourcePath":"components/services/ServiceMenu.jsx"},{"name":"ServiceTier","sourcePath":"components/services/ServiceTier.jsx"}],"sourceHashes":{"components/core/Button.jsx":"610af38ed670","components/core/Eyebrow.jsx":"967fd1542b92","components/core/TextLink.jsx":"bd1ada3d9981","components/editorial/EditorialHero.jsx":"af948dd79c45","components/editorial/FounderBio.jsx":"837c0ff8da6b","components/editorial/PullQuote.jsx":"8f028964318f","components/editorial/SplitFeature.jsx":"fd14cd95df35","components/forms/InquiryForm.jsx":"6d7f457856e4","components/navigation/SiteFooter.jsx":"24ff5e71df8c","components/navigation/SiteNav.jsx":"56c0566f0345","components/projects/BeforeAfter.jsx":"c579f45608f0","components/projects/ProjectCard.jsx":"da13c83b9e97","components/projects/ProjectIndex.jsx":"466bdf53f448","components/services/ServiceMenu.jsx":"b02ccda19f96","components/services/ServiceTier.jsx":"fd732def22e1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.StylingOCDesignSystem_a06b26 = window.StylingOCDesignSystem_a06b26 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Rectangular CTA. No radius, no icons. 'accent' is the one filled brass button per screen. */
function Button({
  children,
  href,
  variant = 'outline',
  size = 'md',
  disabled = false,
  onClick,
  style,
  ...rest
}) {
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
    ...style
  };
  const skins = {
    outline: {
      border: 'var(--hairline) solid var(--rule-strong)',
      color: 'var(--ink)'
    },
    solid: {
      border: 'var(--hairline) solid var(--ink)',
      background: 'var(--ink)',
      color: 'var(--ink-inverse)'
    },
    // Fill is accent-strong, not accent: white on #9C7C4A is only 3.9:1 and fails AA for label text.
    accent: {
      border: 'var(--hairline) solid var(--accent-strong)',
      background: 'var(--accent-strong)',
      color: '#fff'
    },
    onImage: {
      border: 'var(--hairline) solid rgba(255,255,255,.7)',
      color: '#fff'
    }
  };
  const s = {
    ...base,
    ...skins[variant]
  };
  const hover = (e, on) => {
    if (disabled) return;
    const t = e.currentTarget;
    if (variant === 'outline') {
      t.style.background = on ? 'var(--ink)' : 'transparent';
      t.style.color = on ? 'var(--ink-inverse)' : 'var(--ink)';
      t.style.borderColor = on ? 'var(--ink)' : 'var(--rule-strong)';
    }
    if (variant === 'solid') {
      t.style.background = on ? 'var(--ink-700)' : 'var(--ink)';
    }
    if (variant === 'accent') {
      t.style.background = on ? 'var(--accent-deep)' : 'var(--accent-strong)';
      t.style.borderColor = on ? 'var(--accent-deep)' : 'var(--accent-strong)';
    }
    if (variant === 'onImage') {
      t.style.background = on ? 'rgba(255,255,255,.14)' : 'transparent';
      t.style.borderColor = on ? '#fff' : 'rgba(255,255,255,.7)';
    }
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    style: s,
    onMouseEnter: e => hover(e, true),
    onMouseLeave: e => hover(e, false)
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
/* Wide-tracked uppercase label, 9px. Optional brass numeral and trailing rule. */
function Eyebrow({
  children,
  numeral,
  rule = false,
  tone = 'accent',
  as = 'div',
  style
}) {
  const Tag = as;
  const color = tone === 'inverse' ? 'rgba(255,255,255,.86)' : tone === 'ink' ? 'var(--ink)' : tone === 'muted' ? 'var(--ink-muted)' : 'var(--accent-strong)';
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      ...style
    }
  }, numeral && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-numeral)',
      letterSpacing: 'var(--track-numeral)',
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, numeral), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color,
      lineHeight: 'var(--leading-label)',
      whiteSpace: 'nowrap'
    }
  }, children), rule && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      flex: 1,
      height: 'var(--hairline)',
      background: tone === 'inverse' ? 'rgba(255,255,255,.3)' : 'var(--rule)'
    }
  }));
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Hairline underline that draws left-to-right in brass on hover. */
function TextLink({
  children,
  href = '#',
  tone = 'ink',
  caps = false,
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(false);
  const color = tone === 'accent' ? 'var(--accent-strong)' : tone === 'inverse' ? 'var(--ink-inverse)' : 'var(--ink)';
  const drawn = tone === 'inverse' ? 'currentColor' : 'var(--accent)';
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    style: {
      position: 'relative',
      display: 'inline-block',
      color,
      textDecoration: 'none',
      border: 0,
      fontFamily: caps ? 'var(--font-label)' : 'inherit',
      fontSize: caps ? 'var(--text-label-l)' : 'inherit',
      fontWeight: caps ? 400 : 'inherit',
      letterSpacing: caps ? 'var(--track-label)' : 'inherit',
      textTransform: caps ? 'uppercase' : 'none',
      paddingBottom: 5,
      ...style
    }
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 'var(--hairline)',
      background: drawn,
      width: on ? '100%' : '0%',
      transition: 'width var(--dur-base) var(--ease-rule)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 'var(--hairline)',
      width: '100%',
      background: 'currentColor',
      opacity: 0.24
    }
  }));
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/editorial/EditorialHero.jsx
try { (() => {
/* Full-bleed image with a centered masthead headline over a scrim, and an optional
   tiny caption immediately below the image. Slow fade in; no parallax, no scale. */
function EditorialHero({
  image,
  imageAlt = '',
  eyebrow,
  headline,
  sublines = [],
  meta,
  caption,
  align = 'center',
  height = '100vh',
  scrim = true,
  children
}) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), 40);
    return () => clearTimeout(t);
  }, []);
  const col = align === 'center' ? '2 / span 10' : align === 'right' ? '6 / span 6' : '1 / span 8';
  const fade = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'none' : 'translateY(8px)',
    transition: 'opacity var(--dur-reveal) var(--ease-editorial), transform var(--dur-reveal) var(--ease-editorial)'
  };
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      minHeight: String(height).includes('vh') ? 460 : undefined,
      overflow: 'hidden',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), scrim && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-scrim)'
    }
  }), scrim && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '70%',
      background: 'var(--overlay-band)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter) clamp(40px,5vw,80px)',
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      alignContent: 'end',
      gap: 'var(--grid-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: col,
      textAlign: align === 'center' ? 'center' : 'left',
      ...fade
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: '#fff',
      marginBottom: 'var(--space-5)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      color: '#fff',
      fontSize: 'var(--text-display-xl)',
      lineHeight: 'var(--leading-display)',
      letterSpacing: 'var(--track-display)',
      margin: align === 'center' ? '0 auto' : 0,
      maxWidth: '20ch'
    }
  }, headline), sublines.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: align === 'center' ? 'center' : 'flex-start'
    }
  }, sublines.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-lede)',
      fontWeight: 300,
      letterSpacing: 'var(--track-lede)',
      textTransform: 'uppercase',
      color: '#fff',
      lineHeight: 1.7
    }
  }, s))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)'
    }
  }, children)), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / span 12',
      marginTop: 'var(--space-7)',
      borderTop: 'var(--hairline) solid rgba(255,255,255,.4)',
      paddingTop: 'var(--space-4)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
      gap: 'var(--grid-gap)',
      ...fade
    }
  }, meta.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.78)'
    }
  }, m.label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label-l)',
      letterSpacing: '0.08em',
      color: '#fff'
    }
  }, m.value)))))), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: 'var(--space-3) var(--gutter) 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { EditorialHero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/EditorialHero.jsx", error: String((e && e.message) || e) }); }

// components/editorial/FounderBio.jsx
try { (() => {
/* Dual portrait, short editorial bio, signature-style attribution. */
function FounderBio({
  portraits = [],
  eyebrow = 'The Studio',
  title,
  body = [],
  signature,
  pillars = [],
  action,
  layout = 'portraitsLeft'
}) {
  const portraitsLeft = layout === 'portraitsLeft';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-raised)',
      padding: 'var(--section-y) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: portraitsLeft ? '1 / span 5' : '8 / span 5',
      display: 'grid',
      gridTemplateColumns: portraits.length > 1 ? '1fr 1fr' : '1fr',
      gap: 'var(--grid-gap)'
    }
  }, portraits.map((p, i) => /*#__PURE__*/React.createElement("img", {
    key: p.src,
    src: p.src,
    alt: p.alt || '',
    style: {
      width: '100%',
      aspectRatio: '3 / 4',
      objectFit: 'cover',
      marginTop: i === 1 ? 'var(--space-8)' : 0
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: portraitsLeft ? '7 / span 5' : '2 / span 5',
      paddingTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label-wide)',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)',
      marginBottom: 'var(--space-5)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 'var(--text-display-m)',
      lineHeight: 'var(--leading-display-loose)',
      letterSpacing: 'var(--track-display)',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxWidth: 'var(--measure)'
    }
  }, body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-body-loose)',
      color: 'var(--ink-muted)',
      margin: 0
    }
  }, p))), pillars.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      paddingTop: 'var(--space-5)',
      borderTop: 'var(--hairline) solid var(--rule)',
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label-wide)',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, pillars.join('  ·  ')), signature && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: '1.75rem',
      color: 'var(--ink)'
    }
  }, signature), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, action))));
}
Object.assign(__ds_scope, { FounderBio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/FounderBio.jsx", error: String((e && e.message) || e) }); }

// components/editorial/PullQuote.jsx
try { (() => {
/* Oversized serif quotation mark, italic body, client attribution. */
function PullQuote({
  quote,
  attribution,
  role,
  tone = 'day',
  align = 'left',
  size = 'lg'
}) {
  const dark = tone === 'night';
  const fs = size === 'sm' ? 'var(--text-lede)' : size === 'md' ? 'var(--text-display-s)' : 'var(--text-display-m)';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: dark ? '#141414' : 'var(--surface)',
      padding: 'var(--section-y) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: align === 'left' ? '2 / span 7' : '4 / span 7'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '5.5rem',
      lineHeight: 0.6,
      color: 'var(--accent)',
      opacity: dark ? 0.9 : 0.75,
      marginBottom: 'var(--space-6)'
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: fs,
      lineHeight: 1.34,
      letterSpacing: '0.005em',
      color: dark ? '#F5F3EF' : 'var(--ink)',
      margin: 0,
      maxWidth: '30ch'
    }
  }, quote)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 40,
      height: 'var(--hairline)',
      background: dark ? 'var(--rule-inverse)' : 'var(--rule-strong)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label-wide)',
      textTransform: 'uppercase',
      color: dark ? '#B5B0A8' : 'var(--ink-muted)'
    }
  }, attribution, role ? ' · ' + role : '')))));
}
Object.assign(__ds_scope, { PullQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/PullQuote.jsx", error: String((e && e.message) || e) }); }

// components/editorial/SplitFeature.jsx
try { (() => {
/* Asymmetric split: 6-column image beside a 4-column text block, offset vertically. */
function SplitFeature({
  image,
  imageAlt = '',
  eyebrow,
  numeral,
  title,
  body = [],
  caption,
  action,
  imageSide = 'left',
  offset = 'top',
  ratio = '4 / 5'
}) {
  const alignSelf = offset === 'top' ? 'start' : offset === 'bottom' ? 'end' : 'center';
  const imgCol = imageSide === 'left' ? '1 / span 6' : '7 / span 6';
  const txtCol = imageSide === 'left' ? '8 / span 4' : '2 / span 4';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface)',
      padding: 'var(--section-y) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, /*#__PURE__*/React.createElement("figure", {
    style: {
      gridColumn: imgCol,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: '100%',
      aspectRatio: ratio,
      objectFit: 'cover'
    }
  }), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)',
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)'
    }
  }, caption)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: txtCol,
      alignSelf,
      paddingTop: offset === 'top' ? 'var(--space-6)' : 0
    }
  }, (eyebrow || numeral) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-5)'
    }
  }, numeral && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-numeral)',
      letterSpacing: 'var(--track-numeral)',
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, numeral), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-strong)'
    }
  }, eyebrow)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-display-m)',
      lineHeight: 'var(--leading-display-loose)',
      letterSpacing: 'var(--track-display)',
      margin: 0,
      color: 'var(--ink)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxWidth: 'var(--measure)'
    }
  }, body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      fontSize: 'var(--text-body)',
      fontWeight: 'var(--weight-body)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--ink-muted)',
      margin: 0
    }
  }, p))), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, action))));
}
Object.assign(__ds_scope, { SplitFeature });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/SplitFeature.jsx", error: String((e && e.message) || e) }); }

// components/forms/InquiryForm.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Underline-only inputs, 9px uppercase labels, one filled brass submit.
   Every field has a real <label>; controls clear 44px for touch. */
function InquiryForm({
  eyebrow = 'Inquiries',
  title = 'Tell us about your space.',
  intro,
  fields = [],
  submitLabel = 'Send inquiry',
  note,
  onSubmit,
  layout = 'split'
}) {
  const [sent, setSent] = React.useState(false);
  const field = fd => {
    const shared = {
      id: fd.name,
      name: fd.name,
      required: fd.required,
      placeholder: fd.placeholder || '',
      style: {
        width: '100%',
        minHeight: 44,
        border: 0,
        borderBottom: 'var(--hairline) solid var(--rule-strong)',
        background: 'transparent',
        padding: '10px 0',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--weight-body)',
        fontSize: 'var(--text-body)',
        outline: 'none',
        borderRadius: 0,
        transition: 'border-color var(--dur-base) var(--ease-editorial)'
      },
      onFocus: e => {
        e.currentTarget.style.borderBottomColor = 'var(--accent-strong)';
      },
      onBlur: e => {
        e.currentTarget.style.borderBottomColor = 'var(--rule-strong)';
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      key: fd.name,
      style: {
        gridColumn: fd.span === 2 ? 'span 2' : 'span 1'
      }
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: fd.name,
      style: {
        display: 'block',
        marginBottom: 'var(--space-2)',
        fontFamily: 'var(--font-label)',
        fontSize: 'var(--text-label)',
        fontWeight: 400,
        letterSpacing: 'var(--track-label)',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)'
      }
    }, fd.label, fd.required && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": true,
      style: {
        color: 'var(--accent-strong)'
      }
    }, " *")), fd.type === 'textarea' ? /*#__PURE__*/React.createElement("textarea", _extends({
      rows: fd.rows || 3
    }, shared)) : fd.type === 'select' ? /*#__PURE__*/React.createElement("select", shared, (fd.options || []).map(o => /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o))) : /*#__PURE__*/React.createElement("input", _extends({
      type: fd.type || 'text'
    }, shared)));
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface)',
      padding: 'var(--section-y-tight) 0 var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--hairline)',
      background: 'var(--rule-black)',
      marginBottom: 'var(--space-7)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: layout === 'split' ? '1 / span 4' : '1 / span 8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-strong)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 'var(--space-4)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-display-m)',
      lineHeight: 'var(--leading-display-loose)',
      letterSpacing: 'var(--track-display)',
      maxWidth: '18ch'
    }
  }, title), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      fontSize: 'var(--text-body-s)',
      fontWeight: 'var(--weight-body)',
      lineHeight: 1.8,
      color: 'var(--ink-muted)',
      maxWidth: 'var(--measure-narrow)'
    }
  }, intro)), /*#__PURE__*/React.createElement("form", {
    style: {
      gridColumn: layout === 'split' ? '6 / span 6' : '1 / span 7',
      marginTop: layout === 'split' ? 0 : 'var(--space-7)'
    },
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
      onSubmit && onSubmit(e);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-6) var(--column-gap)'
    }
  }, fields.map(field)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label-l)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      minHeight: 44,
      padding: '14px 28px',
      background: 'var(--accent-strong)',
      border: 'var(--hairline) solid var(--accent-strong)',
      borderRadius: 0,
      color: '#fff',
      cursor: 'pointer',
      transition: 'background var(--dur-base) var(--ease-editorial), border-color var(--dur-base) var(--ease-editorial)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--accent-deep)';
      e.currentTarget.style.borderColor = 'var(--accent-deep)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--accent-strong)';
      e.currentTarget.style.borderColor = 'var(--accent-strong)';
    }
  }, sent ? 'Thank you' : submitLabel), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 300,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)'
    }
  }, note))))));
}
Object.assign(__ds_scope, { InquiryForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/InquiryForm.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
/* Heavy black top rule, three columns divided by hairlines, tagline in wide caps along the bottom. */
function SiteFooter({
  wordmark = 'Styling OC',
  columns = [],
  tagline = 'Vision · Intention · Beauty · Balance',
  note
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--hairline)',
      background: 'var(--rule-black)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: 0,
      paddingTop: 'var(--space-6)'
    }
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      padding: '0 var(--column-gap) var(--space-8) ' + (i === 0 ? '0' : 'var(--column-gap)'),
      borderLeft: i === 0 ? 0 : 'var(--hairline) solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-strong)',
      marginBottom: 'var(--space-5)'
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, c.items.map(it => it.href ? /*#__PURE__*/React.createElement("a", {
    key: it.label,
    href: it.href,
    style: {
      fontSize: 'var(--text-body-s)',
      fontWeight: 'var(--weight-body)',
      color: 'var(--ink)',
      textDecoration: 'none',
      border: 0
    }
  }, it.label) : /*#__PURE__*/React.createElement("span", {
    key: it.label,
    style: {
      fontSize: 'var(--text-body-s)',
      fontWeight: 'var(--weight-body)',
      color: 'var(--ink-muted)'
    }
  }, it.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--hairline) solid var(--rule)',
      padding: 'var(--space-5) 0',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-5)',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label-wide)',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display-strong)',
      fontSize: '0.875rem',
      letterSpacing: 'var(--track-display-wide)',
      textTransform: 'uppercase'
    }
  }, wordmark), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: '0.1em',
      color: 'var(--ink-faint)'
    }
  }, note)))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteNav.jsx
try { (() => {
/* Masthead nav: Bodoni wordmark, 9px links at 0.34em. Transparent over a hero, white once scrolled. */
function SiteNav({
  wordmark = 'Styling OC',
  align = 'center',
  links = [],
  cta,
  transparent = false,
  solidAfter = 24,
  active
}) {
  const [solid, setSolid] = React.useState(!transparent);
  React.useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setSolid(window.scrollY > solidAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent, solidAfter]);
  const onDark = transparent && !solid;
  const ink = onDark ? '#fff' : 'var(--ink)';
  const item = (l, isCta) => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: isCta && !onDark ? 'var(--accent-strong)' : ink,
      textDecoration: 'none',
      borderBottom: 'var(--hairline) solid ' + (active === l.label ? onDark ? 'rgba(255,255,255,.8)' : 'var(--accent)' : 'transparent'),
      paddingBottom: 4,
      opacity: active && active !== l.label ? 0.7 : 1,
      transition: 'opacity var(--dur-base) var(--ease-editorial), border-color var(--dur-base) var(--ease-editorial)'
    }
  }, l.label);
  const mark = /*#__PURE__*/React.createElement("a", {
    href: "/",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display-strong)',
      fontSize: '1rem',
      letterSpacing: 'var(--track-display-wide)',
      textTransform: 'uppercase',
      color: ink,
      textDecoration: 'none',
      border: 0,
      whiteSpace: 'nowrap'
    }
  }, wordmark);
  const half = Math.ceil(links.length / 2);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: transparent ? 'fixed' : 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      background: onDark ? 'transparent' : 'var(--surface)',
      borderBottom: 'var(--hairline) solid ' + (onDark ? 'rgba(255,255,255,.24)' : 'var(--rule-black)'),
      transition: 'background var(--dur-slow) var(--ease-editorial), border-color var(--dur-slow) var(--ease-editorial)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'grid',
      gridTemplateColumns: align === 'center' ? '1fr auto 1fr' : 'auto 1fr auto',
      alignItems: 'center',
      gap: 'var(--space-6)',
      padding: 'var(--space-5) var(--gutter)',
      maxWidth: 'var(--max-page)',
      margin: '0 auto'
    }
  }, align === 'center' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)'
    }
  }, links.slice(0, half).map(l => item(l))), mark, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }, links.slice(half).map(l => item(l)), cta && item(cta, true))) : /*#__PURE__*/React.createElement(React.Fragment, null, mark, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      justifyContent: 'flex-end'
    }
  }, links.map(l => item(l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, cta && item(cta, true)))));
}
Object.assign(__ds_scope, { SiteNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteNav.jsx", error: String((e && e.message) || e) }); }

// components/projects/BeforeAfter.jsx
try { (() => {
/* Drag-divider comparison. Highest-value component for the real-estate audience. */
function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  caption,
  initial = 50,
  ratio = '16 / 10'
}) {
  const [pos, setPos] = React.useState(initial);
  const box = React.useRef(null);
  const dragging = React.useRef(false);
  const setFromClient = clientX => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100)));
  };
  React.useEffect(() => {
    const move = e => {
      if (!dragging.current) return;
      setFromClient(e.touches ? e.touches[0].clientX : e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, {
      passive: true
    });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);
  const label = (text, side) => /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 18,
      [side]: 20,
      zIndex: 3,
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label-wide)',
      textTransform: 'uppercase',
      color: '#fff',
      textShadow: '0 1px 12px rgba(28,26,24,.55)'
    }
  }, text);
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: box,
    onMouseDown: e => {
      dragging.current = true;
      setFromClient(e.clientX);
    },
    onTouchStart: e => {
      dragging.current = true;
      setFromClient(e.touches[0].clientX);
    },
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: ratio,
      overflow: 'hidden',
      cursor: 'ew-resize',
      background: 'var(--surface-sunken)',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: after,
    alt: afterLabel,
    draggable: false,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: pos + '%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: before,
    alt: beforeLabel,
    draggable: false,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      minWidth: box.current ? box.current.offsetWidth : '100%'
    }
  })), label(beforeLabel, 'left'), label(afterLabel, 'right'), /*#__PURE__*/React.createElement("div", {
    role: "slider",
    "aria-label": "Before and after",
    "aria-valuenow": Math.round(pos),
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    tabIndex: 0,
    onKeyDown: e => {
      if (e.key === 'ArrowLeft') setPos(p => Math.max(0, p - 4));
      if (e.key === 'ArrowRight') setPos(p => Math.min(100, p + 4));
    },
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: pos + '%',
      width: 1,
      background: 'rgba(255,255,255,.9)',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 46,
      height: 46,
      border: 'var(--hairline) solid rgba(255,255,255,.9)',
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      color: '#fff',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      letterSpacing: '0.1em',
      background: 'rgba(28,26,24,.18)',
      backdropFilter: 'blur(2px)'
    }
  }, "\u2190\u2192"))), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-4)',
      display: 'flex',
      gap: 'var(--space-5)',
      alignItems: 'baseline',
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)'
    }
  }, caption));
}
Object.assign(__ds_scope, { BeforeAfter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/projects/BeforeAfter.jsx", error: String((e && e.message) || e) }); }

// components/projects/ProjectCard.jsx
try { (() => {
/* No borders, no shadow, no radius. Image plus a hairline metadata line. */
function ProjectCard({
  image,
  imageAlt = '',
  name,
  location,
  scope,
  href = '#',
  ratio = '4 / 5',
  numeral
}) {
  const [on, setOn] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    style: {
      display: 'block',
      textDecoration: 'none',
      border: 0,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: '100%',
      aspectRatio: ratio,
      objectFit: 'cover',
      opacity: on ? 0.86 : 1,
      transition: 'opacity var(--dur-slow) var(--ease-editorial)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)',
      paddingTop: 'var(--space-3)',
      borderTop: 'var(--hairline) solid ' + (on ? 'var(--rule-strong)' : 'var(--rule)'),
      transition: 'border-color var(--dur-base) var(--ease-editorial)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-title)',
      letterSpacing: 'var(--track-display)',
      lineHeight: 1.2
    }
  }, name), location && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)'
    }
  }, location)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, numeral && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-label-l)',
      letterSpacing: 'var(--track-numeral)',
      color: 'var(--accent-strong)'
    }
  }, numeral), scope && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)',
      whiteSpace: 'nowrap'
    }
  }, scope))));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/projects/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/projects/ProjectIndex.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Index grid: heavy rule opens the section, varied ratios, small column offsets. */
function ProjectIndex({
  eyebrow,
  title,
  lede,
  projects = [],
  columns = 3,
  offsets = [0, 56, 24],
  footer
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface)',
      padding: 'var(--section-y-tight) 0 var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, (eyebrow || title) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)',
      alignItems: 'end',
      paddingBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / span 6'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-strong)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 'var(--space-4)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-display-l)',
      lineHeight: 'var(--leading-display)',
      letterSpacing: 'var(--track-display)'
    }
  }, title)), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      gridColumn: '8 / span 4',
      margin: 0,
      fontSize: 'var(--text-body-s)',
      fontWeight: 'var(--weight-body)',
      lineHeight: 1.8,
      color: 'var(--ink-muted)'
    }
  }, lede)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--hairline)',
      background: 'var(--rule-black)',
      marginBottom: 'var(--space-7)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + columns + ',1fr)',
      gap: 'var(--column-gap)',
      alignItems: 'start'
    }
  }, projects.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      marginTop: offsets[i % columns] || 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProjectCard, _extends({}, p, {
    numeral: p.numeral || String(i + 1).padStart(2, '0')
  }))))), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)',
      borderTop: 'var(--hairline) solid var(--rule)',
      paddingTop: 'var(--space-4)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { ProjectIndex });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/projects/ProjectIndex.jsx", error: String((e && e.message) || e) }); }

// components/services/ServiceMenu.jsx
try { (() => {
/* Container for ServiceTier panels: heavy top rule, section head, then columns
   divided by vertical hairlines. Tight grid — this is a printed menu, not a pricing page. */
function ServiceMenu({
  eyebrow,
  title,
  lede,
  columns = 3,
  tone = 'day',
  children
}) {
  const dark = tone === 'night';
  const ink = dark ? '#F5F3EF' : 'var(--ink)';
  const muted = dark ? '#B5B0A8' : 'var(--ink-muted)';
  const rule = dark ? 'rgba(245,243,239,.20)' : 'var(--rule)';
  const heavy = dark ? 'rgba(245,243,239,.9)' : 'var(--rule-black)';
  const kids = React.Children.toArray(children);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: dark ? '#141414' : 'var(--surface)',
      padding: 'var(--section-y-tight) 0 var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--max-page)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)',
      alignItems: 'end',
      paddingBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / span 6'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-strong)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 'var(--space-4)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-display-l)',
      lineHeight: 'var(--leading-display)',
      letterSpacing: 'var(--track-display)',
      color: ink
    }
  }, title)), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      gridColumn: '8 / span 4',
      margin: 0,
      fontSize: 'var(--text-body-s)',
      lineHeight: 1.8,
      color: muted,
      fontWeight: 'var(--weight-body)'
    }
  }, lede)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--hairline)',
      background: heavy
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(' + columns + ',1fr)',
      alignItems: 'stretch'
    }
  }, kids.map((child, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: 'var(--space-6) var(--column-gap) var(--space-4) ' + (i === 0 ? '0' : 'var(--column-gap)'),
      borderLeft: i === 0 ? 'none' : 'var(--hairline) solid ' + rule,
      display: 'flex',
      flexDirection: 'column'
    }
  }, child))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--hairline)',
      background: rule
    }
  })));
}
Object.assign(__ds_scope, { ServiceMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/services/ServiceMenu.jsx", error: String((e && e.message) || e) }); }

// components/services/ServiceTier.jsx
try { (() => {
/* Numbered tier. Default is a column panel — three sit side by side inside ServiceMenu,
   divided by vertical hairlines. 'row' is the full-width menu line; 'withImage' is image-led. */
function ServiceTier({
  numeral,
  title,
  items = [],
  price,
  priceNote,
  note,
  image,
  imageAlt = '',
  tone = 'day',
  layout = 'panel'
}) {
  const dark = tone === 'night';
  const ink = dark ? '#F5F3EF' : 'var(--ink)';
  const muted = dark ? '#B5B0A8' : 'var(--ink-muted)';
  // Benefit line is body copy, not a caption — must clear 4.5:1, so it uses ink-muted.
  const faint = dark ? '#B5B0A8' : 'var(--ink-muted)';
  const rule = dark ? 'rgba(245,243,239,.20)' : 'var(--rule)';
  const numeralEl = /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-numeral)',
      letterSpacing: 'var(--track-numeral)',
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, numeral);
  const titleEl = /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-display)',
      fontSize: 'var(--text-display-s)',
      lineHeight: 'var(--leading-title)',
      letterSpacing: 'var(--track-display)',
      margin: 'var(--space-3) 0 0',
      color: ink,
      maxWidth: '18ch'
    }
  }, title);
  const itemsEl = /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: 'var(--text-body-s)',
      lineHeight: 1.7,
      color: muted,
      fontWeight: 'var(--weight-body)'
    }
  }, it)));
  const noteEl = note && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: 'var(--text-body)',
      lineHeight: 1.5,
      color: faint
    }
  }, note);
  const priceEl = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 'var(--text-label-l)',
      fontWeight: 400,
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: ink
    }
  }, price), priceNote && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontSize: 'var(--text-body-s)',
      lineHeight: 1.6,
      color: muted,
      fontWeight: 'var(--weight-body)',
      maxWidth: '30ch'
    }
  }, priceNote));
  if (layout === 'panel') {
    return /*#__PURE__*/React.createElement("article", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        paddingBottom: 'var(--space-2)',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", null, numeralEl, titleEl), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--hairline)',
        background: rule,
        width: 40
      }
    }), itemsEl, noteEl, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingTop: 'var(--space-5)'
      }
    }, priceEl));
  }
  if (layout === 'withImage' && image) {
    return /*#__PURE__*/React.createElement("article", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(180px,3fr) minmax(0,7fr)',
        gap: 'var(--column-gap)',
        borderTop: 'var(--hairline) solid ' + rule,
        padding: 'var(--space-6) 0 var(--space-8)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: imageAlt,
      style: {
        width: '100%',
        aspectRatio: '4 / 5',
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("div", null, numeralEl, titleEl), itemsEl, noteEl, priceEl));
  }
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12,1fr)',
      gap: 'var(--grid-gap)',
      borderTop: 'var(--hairline) solid ' + rule,
      padding: 'var(--space-6) 0 var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / span 3'
    }
  }, numeralEl, titleEl), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '5 / span 5',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, itemsEl, noteEl), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '11 / span 2',
      textAlign: 'right'
    }
  }, priceEl));
}
Object.assign(__ds_scope, { ServiceTier });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/services/ServiceTier.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.EditorialHero = __ds_scope.EditorialHero;

__ds_ns.FounderBio = __ds_scope.FounderBio;

__ds_ns.PullQuote = __ds_scope.PullQuote;

__ds_ns.SplitFeature = __ds_scope.SplitFeature;

__ds_ns.InquiryForm = __ds_scope.InquiryForm;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteNav = __ds_scope.SiteNav;

__ds_ns.BeforeAfter = __ds_scope.BeforeAfter;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.ProjectIndex = __ds_scope.ProjectIndex;

__ds_ns.ServiceMenu = __ds_scope.ServiceMenu;

__ds_ns.ServiceTier = __ds_scope.ServiceTier;

})();
