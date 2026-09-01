import * as React from 'react';
import { ProjectCardProps } from './ProjectCard';

/**
 * Project index grid — masonry-adjacent, varied ratios, staggered column offsets.
 */
export interface ProjectIndexProps {
  eyebrow?: string;
  title?: string;
  projects?: ProjectCardProps[];
  columns?: number;
  /** Per-column top offsets in px, cycled by column. */
  offsets?: number[];
  footer?: React.ReactNode;
}
export function ProjectIndex(props: ProjectIndexProps): JSX.Element;
