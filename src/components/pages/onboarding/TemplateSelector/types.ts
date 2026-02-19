/**
 * TemplateSelector component types
 */

export interface Template {
  id: string;
  name: string;
  image: string;
  hasHeadshot: boolean;
  layout: 'single' | 'two-column';
  category: string;
}

export interface TemplateSelectorProps {
  onSelect?: (templateId: string) => void;
  selectedTemplate?: string | null;
}

export type TemplateLayout = 'single' | 'two-column';
