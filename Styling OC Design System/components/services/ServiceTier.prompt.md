Service tier — the core commercial component. Default `panel` layout goes three abreast inside `ServiceMenu`; switch to `row` for menus of five or more.

```jsx
<ServiceMenu eyebrow="Personal Styling Experiences" title="Personal Styling" columns={3}>
  <ServiceTier numeral="01" title="The Style Edit" price="$500 / hour"
    items={['One-on-one consultation','Outfits from pieces you own','Fit and proportion guidance']}
    note="A focused refresh designed to make your existing wardrobe work beautifully." />
</ServiceMenu>
```

`tone="night"` on a near-black ground for the evening-consultation callout. The brass numeral is required — it is the one element carried directly from the printed menus.
