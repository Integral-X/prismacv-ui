/**
 * TemplateSelector utility functions
 */

import { Template, TemplateLayout } from './types';

export interface TemplateFilters {
  headshotFilter: boolean | null;
  layoutFilter: TemplateLayout | null;
}

/**
 * Filters templates based on active filters
 */
export const filterTemplates = (
  templates: Template[],
  filters: TemplateFilters
): Template[] => {
  return templates.filter((template) => {
    if (
      filters.headshotFilter !== null &&
      template.hasHeadshot !== filters.headshotFilter
    ) {
      return false;
    }
    if (
      filters.layoutFilter !== null &&
      template.layout !== filters.layoutFilter
    ) {
      return false;
    }
    return true;
  });
};
