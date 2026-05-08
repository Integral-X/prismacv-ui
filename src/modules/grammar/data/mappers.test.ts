import { toGrammarCheckResult } from './mappers';

describe('toGrammarCheckResult', () => {
  it('maps issues and score', () => {
    const result = toGrammarCheckResult({
      issues: [
        {
          type: 'grammar',
          message: 'Passive voice',
          suggestion: 'Use active voice',
          startIndex: 0,
          endIndex: 5,
          severity: 'warning',
        },
      ],
      score: 88,
      summary: 'Minor improvements suggested.',
    });

    expect(result.score).toBe(88);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]?.severity).toBe('warning');
    expect(result.summary).toContain('Minor');
  });
});
