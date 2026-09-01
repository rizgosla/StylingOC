import * as React from 'react';

/**
 * Drag-divider before/after comparison for remodels, makeovers and pre-listing work.
 */
export interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  /** Starting divider position, 0–100. */
  initial?: number;
  ratio?: string;
}
export function BeforeAfter(props: BeforeAfterProps): JSX.Element;
