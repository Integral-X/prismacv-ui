'use client';

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  type LucideIcon,
} from 'lucide-react';
import type { TemplateProps } from './index';
import type { PersonalInfoField } from '@/modules/cv/editor/editor-model';
import { EditableText } from '@/modules/cv/components/primitives/editable-text';
import { EditableExperienceList } from '@/modules/cv/components/primitives/editable-experience-list';
import { EditableEducationList } from '@/modules/cv/components/primitives/editable-education-list';
import { EditableProjectList } from '@/modules/cv/components/primitives/editable-project-list';
import { EditableSkillList } from '@/modules/cv/components/primitives/editable-skill-list';
import { EditableCertificationList } from '@/modules/cv/components/primitives/editable-certification-list';
import { EditableLanguageList } from '@/modules/cv/components/primitives/editable-language-list';
import { Section } from './resume-sections';

/**
 * Inline-editable two-column resume. Every section edits directly on the
 * document via the editor store. Client-only and mounted exclusively in edit
 * mode, so the editor's JS never reaches the preview/print/public paths.
 */
export function TwoColumnEditable({ accentColor }: TemplateProps) {
  return (
    <div className='mx-auto min-h-[297mm] w-[210mm] bg-white p-10 text-content-primary shadow-lg'>
      <EditableHeader accentColor={accentColor} />

      <div className='mt-6 grid grid-cols-3 gap-8'>
        {/* Main column (wide, left) */}
        <div className='col-span-2 space-y-5'>
          <Section title='Summary'>
            <EditableText
              field='summary'
              ariaLabel='Professional summary'
              placeholder='Write a short professional summary…'
              as='p'
              multiline
              className='text-xs leading-relaxed text-content-secondary'
            />
          </Section>

          <Section title='Experience'>
            <EditableExperienceList accentColor={accentColor} />
          </Section>

          <Section title='Projects'>
            <EditableProjectList accentColor={accentColor} />
          </Section>
        </div>

        {/* Side column (narrow, right) */}
        <div className='col-span-1 space-y-5'>
          <Section title='Skills'>
            <EditableSkillList accentColor={accentColor} />
          </Section>

          <Section title='Education'>
            <EditableEducationList accentColor={accentColor} />
          </Section>

          <Section title='Certifications'>
            <EditableCertificationList accentColor={accentColor} />
          </Section>

          <Section title='Languages'>
            <EditableLanguageList />
          </Section>
        </div>
      </div>
    </div>
  );
}

function EditableHeader({ accentColor }: { accentColor: string }) {
  return (
    <header className='border-b border-subtle pb-4'>
      <EditableText
        field='fullName'
        ariaLabel='Full name'
        placeholder='Your Name'
        as='h1'
        className='text-3xl font-bold tracking-tight text-content-primary'
      />
      <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary'>
        <ContactField
          icon={Phone}
          field='phone'
          label='Phone'
          placeholder='+1 555 000 0000'
          accentColor={accentColor}
        />
        <ContactField
          icon={Mail}
          field='email'
          label='Email'
          placeholder='email@example.com'
          accentColor={accentColor}
        />
        <ContactField
          icon={Globe}
          field='website'
          label='Website'
          placeholder='website.com'
          accentColor={accentColor}
        />
        <ContactField
          icon={Linkedin}
          field='linkedinUrl'
          label='LinkedIn'
          placeholder='linkedin.com/in/you'
          accentColor={accentColor}
        />
        <ContactField
          icon={MapPin}
          field='location'
          label='Location'
          placeholder='City, Country'
          accentColor={accentColor}
        />
      </div>
    </header>
  );
}

function ContactField({
  icon: Icon,
  field,
  label,
  placeholder,
  accentColor,
}: {
  icon: LucideIcon;
  field: PersonalInfoField;
  label: string;
  placeholder: string;
  accentColor: string;
}) {
  return (
    <span className='flex items-center gap-1'>
      <Icon className='h-3 w-3' style={{ color: accentColor }} />
      <EditableText
        field={field}
        ariaLabel={label}
        placeholder={placeholder}
        className='text-content-secondary'
      />
    </span>
  );
}
