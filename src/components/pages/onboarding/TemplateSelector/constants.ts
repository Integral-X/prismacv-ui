/**
 * TemplateSelector component constants
 */

import { Template } from './types';

export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    image: '/images/onboarding/resume_thumb_1.svg',
    hasHeadshot: true,
    layout: 'single',
    category: 'professional',
  },
  {
    id: 'horizon',
    name: 'Horizon',
    image: '/images/onboarding/resume_thumb_2.svg',
    hasHeadshot: false,
    layout: 'two-column',
    category: 'professional',
  },
  {
    id: 'prism',
    name: 'Prism',
    image: '/images/onboarding/resume_thumb_3.svg',
    hasHeadshot: true,
    layout: 'two-column',
    category: 'modern',
  },
  {
    id: 'executive',
    name: 'Executive',
    image: '/images/onboarding/resume_thumb_1.svg',
    hasHeadshot: false,
    layout: 'single',
    category: 'professional',
  },
  {
    id: 'nova',
    name: 'Nova',
    image: '/images/onboarding/resume_thumb_2.svg',
    hasHeadshot: true,
    layout: 'single',
    category: 'modern',
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    image: '/images/onboarding/resume_thumb_3.svg',
    hasHeadshot: false,
    layout: 'two-column',
    category: 'creative',
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle',
    image: '/images/onboarding/resume_thumb_1.svg',
    hasHeadshot: true,
    layout: 'two-column',
    category: 'professional',
  },
  {
    id: 'slate',
    name: 'Slate',
    image: '/images/onboarding/resume_thumb_2.svg',
    hasHeadshot: false,
    layout: 'single',
    category: 'modern',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    image: '/images/onboarding/resume_thumb_3.svg',
    hasHeadshot: true,
    layout: 'single',
    category: 'creative',
  },
];
