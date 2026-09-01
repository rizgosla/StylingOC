import * as React from 'react';

export interface InquiryField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  rows?: number;
  required?: boolean;
  /** 2 makes the field span the full two-column width. */
  span?: 1 | 2;
}

/**
 * Inquiry form — underline-only inputs, no boxes, generous vertical rhythm.
 */
export interface InquiryFormProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  fields?: InquiryField[];
  submitLabel?: string;
  note?: string;
  onSubmit?: (e: React.FormEvent) => void;
  /** split = heading beside the fields; stacked = heading above. */
  layout?: 'split' | 'stacked';
}
export function InquiryForm(props: InquiryFormProps): JSX.Element;
