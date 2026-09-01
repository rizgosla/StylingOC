Footer — three columns divided by vertical hairlines, tagline in wide small caps along the bottom rule.

```jsx
<SiteFooter columns={[
  {title:'Studio',items:[{label:'About Jenn & Merlyn',href:'#'},{label:'Journal',href:'#'}]},
  {title:'Services',items:[{label:'Interior Design',href:'#'},{label:'Personal Styling',href:'#'}]},
  {title:'Contact',items:[{label:'hello@stylingoc.com',href:'#'},{label:'Orange County, California'}]},
]} tagline="Vision · Intention · Beauty · Balance" note="© 2026" />
```

Never add social icons or a newsletter box with a filled button; use a TextLink instead.
