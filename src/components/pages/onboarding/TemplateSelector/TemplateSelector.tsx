'use client';

import * as React from 'react';
import { TemplateSelectorProps, TemplateLayout } from './types';
import { templates } from './constants';
import { filterTemplates } from './utils';
import { TemplateFilters } from './TemplateFilters';
import { TemplateGrid } from './TemplateGrid';

export const TemplateSelector = ({
  onSelect,
  selectedTemplate,
}: TemplateSelectorProps) => {
  const [headshotFilter, setHeadshotFilter] = React.useState<boolean | null>(
    null
  );
  const [layoutFilter, setLayoutFilter] = React.useState<TemplateLayout | null>(
    null
  );

  const filteredTemplates = React.useMemo(() => {
    return filterTemplates(templates, {
      headshotFilter,
      layoutFilter,
    });
  }, [headshotFilter, layoutFilter]);

  const handleHeadshotToggle = () => {
    if (headshotFilter === true) {
      setHeadshotFilter(null);
    } else {
      setHeadshotFilter(true);
    }
  };

  const handleLayoutToggle = (layout: TemplateLayout) => {
    if (layoutFilter === layout) {
      setLayoutFilter(null);
    } else {
      setLayoutFilter(layout);
    }
  };

  const clearFilters = () => {
    setHeadshotFilter(null);
    setLayoutFilter(null);
  };

  return (
    <div className="w-full">
      <TemplateFilters
        headshotFilter={headshotFilter}
        layoutFilter={layoutFilter}
        onHeadshotToggle={handleHeadshotToggle}
        onLayoutToggle={handleLayoutToggle}
        onClearFilters={clearFilters}
        filteredCount={filteredTemplates.length}
        totalCount={templates.length}
      />

      <TemplateGrid
        templates={filteredTemplates}
        selectedTemplate={selectedTemplate || null}
        onSelect={(templateId) => onSelect?.(templateId)}
        onClearFilters={clearFilters}
      />
    </div>
  );
};
