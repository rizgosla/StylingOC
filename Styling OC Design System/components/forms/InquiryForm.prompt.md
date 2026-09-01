Inquiry form — the only form in the system. Underline inputs, 9px uppercase labels, one filled brass submit.

```jsx
<InquiryForm fields={[
  {name:'name',label:'Name',required:true},
  {name:'email',label:'Email',type:'email',required:true},
  {name:'service',label:'Service',type:'select',options:['Interior Design','Personal Styling','Pre-listing Refresh']},
  {name:'message',label:'About the project',type:'textarea',span:2,rows:3},
]} note="We reply within two business days." />
```

Every field carries a real `<label>` and a 44px minimum control height — never placeholder-only labels or boxed inputs. Required fields are marked with an asterisk *and* the `required` attribute, never by colour alone.
