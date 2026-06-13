import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Cv } from '@/modules/cv/data/mappers';
import { EditorProvider } from '@/modules/cv/editor/editor-provider';
import { EditableText } from './editable-text';

jest.mock('@/modules/cv/data/actions', () => ({
  updatePersonalInfoAction: jest.fn().mockResolvedValue({ ok: true }),
}));

function buildCv(summary: string | null): Cv {
  return {
    id: 'cv_1',
    title: 'My CV',
    slug: 'my-cv',
    status: 'draft',
    templateId: 'horizon',
    isDefault: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    personalInfo: {
      id: 'pi_1',
      fullName: 'Ada Lovelace',
      email: null,
      phone: null,
      location: null,
      website: null,
      linkedinUrl: null,
      summary,
      avatarUrl: null,
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    customSections: [],
  };
}

function renderField(summary: string | null) {
  return render(
    <EditorProvider cv={buildCv(summary)}>
      <EditableText
        field='summary'
        ariaLabel='Professional summary'
        placeholder='Write a short professional summary…'
        as='p'
        multiline
      />
    </EditorProvider>
  );
}

describe('EditableText', () => {
  it('renders the current value in its display state', () => {
    renderField('Original summary.');

    expect(screen.getByText('Original summary.')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows the placeholder when the field is empty', () => {
    renderField(null);

    expect(
      screen.getByText('Write a short professional summary…')
    ).toBeInTheDocument();
  });

  it('swaps to an in-place editor on click and commits the edit on blur', async () => {
    const user = userEvent.setup();
    renderField('Original summary.');

    await user.click(
      screen.getByRole('button', { name: 'Professional summary' })
    );

    const editor = screen.getByRole('textbox', {
      name: 'Professional summary',
    });
    expect(editor).toHaveValue('Original summary.');

    await user.clear(editor);
    await user.type(editor, 'Rewritten summary.');
    await user.tab();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Rewritten summary.')).toBeInTheDocument();
  });
});
