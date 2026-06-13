import type { CvSuggestion } from '@/modules/ai/data/mappers';
import type { EditorDocument } from './editor-model';
import { resolveSuggestionTarget } from './apply-suggestion';

function buildDoc(overrides: Partial<EditorDocument> = {}): EditorDocument {
  return {
    cvId: 'cv_1',
    templateId: 'horizon',
    personalInfo: null,
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    ...overrides,
  };
}

function suggestion(overrides: Partial<CvSuggestion> = {}): CvSuggestion {
  return {
    section: 'summary',
    type: 'improvement',
    message: 'Tighten the summary.',
    originalText: null,
    suggestedText: 'A sharper summary.',
    ...overrides,
  };
}

describe('resolveSuggestionTarget', () => {
  it('returns null when there is no suggested text', () => {
    expect(
      resolveSuggestionTarget(buildDoc(), suggestion({ suggestedText: null }))
    ).toBeNull();
    expect(
      resolveSuggestionTarget(buildDoc(), suggestion({ suggestedText: '   ' }))
    ).toBeNull();
  });

  it('targets the summary for summary/profile sections', () => {
    expect(
      resolveSuggestionTarget(buildDoc(), suggestion({ section: 'Summary' }))
    ).toEqual({ kind: 'summary' });
    expect(
      resolveSuggestionTarget(
        buildDoc(),
        suggestion({ section: 'Professional Profile' })
      )
    ).toEqual({ kind: 'summary' });
  });

  it('matches an experience description by its original text', () => {
    const doc = buildDoc({
      experiences: [
        {
          id: 'exp_1',
          company: 'A',
          title: 'Engineer',
          location: null,
          startDate: new Date('2024-01-01T00:00:00.000Z'),
          endDate: null,
          current: false,
          description: 'Led   the\nplatform migration.',
          sortOrder: 0,
        },
      ],
    });

    const target = resolveSuggestionTarget(
      doc,
      suggestion({
        section: 'experience',
        type: 'improvement',
        // Whitespace differs from the stored value — normalization must still match.
        originalText: 'Led the platform migration.',
        suggestedText: 'Drove a zero-downtime platform migration for 2M users.',
      })
    );

    expect(target).toEqual({
      kind: 'description',
      section: 'experiences',
      entryId: 'exp_1',
    });
  });

  it('matches a project description across sections', () => {
    const doc = buildDoc({
      projects: [
        {
          id: 'proj_1',
          name: 'Atlas',
          url: null,
          description: 'A mapping toolkit.',
          startDate: null,
          endDate: null,
          sortOrder: 0,
        },
      ],
    });

    const target = resolveSuggestionTarget(
      doc,
      suggestion({
        section: 'projects',
        originalText: 'A mapping toolkit.',
        suggestedText: 'An open-source geospatial mapping toolkit.',
      })
    );

    expect(target).toEqual({
      kind: 'description',
      section: 'projects',
      entryId: 'proj_1',
    });
  });

  it('returns null for a description suggestion with no matching entry', () => {
    const doc = buildDoc({
      experiences: [
        {
          id: 'exp_1',
          company: 'A',
          title: 'Engineer',
          location: null,
          startDate: new Date('2024-01-01T00:00:00.000Z'),
          endDate: null,
          current: false,
          description: 'Built internal tools.',
          sortOrder: 0,
        },
      ],
    });

    expect(
      resolveSuggestionTarget(
        doc,
        suggestion({
          section: 'experience',
          originalText: 'Something the AI hallucinated.',
          suggestedText: 'A rewrite.',
        })
      )
    ).toBeNull();
  });

  it('returns null for a non-summary suggestion lacking original text', () => {
    expect(
      resolveSuggestionTarget(
        buildDoc(),
        suggestion({ section: 'experience', originalText: null })
      )
    ).toBeNull();
  });
});
