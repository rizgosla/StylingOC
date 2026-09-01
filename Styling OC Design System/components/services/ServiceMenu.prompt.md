Wraps ServiceTier panels into the printed-menu grid. One per service line.

```jsx
<ServiceMenu eyebrow="Interior Design Services Menu" title="Interiors"
  lede="Thoughtful design. Personalised spaces. Timeless living." columns={3}>
  {tiers.map(t => <ServiceTier key={t.numeral} {...t} />)}
</ServiceMenu>
```

Three columns is the intended density; four only if every tier has three items or fewer.
