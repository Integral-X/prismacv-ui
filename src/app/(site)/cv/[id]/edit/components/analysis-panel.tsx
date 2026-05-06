'use client';

import { cn } from '@/lib/utils';
import type { CvAnalysisResult, CvIssue } from '@/modules/ai/data/mappers';
import { AlertTriangle, CheckCircle2, Info, SpellCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisPanelProps {
  result: CvAnalysisResult;
  onClose: () => void;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80
      ? 'text-feedback-success'
      : score >= 60
        ? 'text-feedback-warning'
        : 'text-feedback-error';

  return (
    <div className='flex flex-col items-center gap-1'>
      <span className={cn('text-2xl font-bold', color)}>{score}</span>
      <span className='text-xs text-content-secondary'>{label}</span>
    </div>
  );
}

function severityIcon(severity: CvIssue['severity']) {
  switch (severity) {
    case 'high':
      return <AlertTriangle className='size-4 shrink-0 text-feedback-error' />;
    case 'medium':
      return (
        <AlertTriangle className='size-4 shrink-0 text-feedback-warning' />
      );
    case 'low':
      return <Info className='size-4 shrink-0 text-feedback-info' />;
  }
}

function typeLabel(type: CvIssue['type']) {
  switch (type) {
    case 'grammar':
      return 'Grammar';
    case 'readability':
      return 'Readability';
    case 'ats':
      return 'ATS';
    case 'content':
      return 'Content';
  }
}

export function AnalysisPanel({ result, onClose }: AnalysisPanelProps) {
  const hasIssues = result.issues.length > 0;
  const hasSuggestions = result.suggestions.length > 0;

  return (
    <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SpellCheck className='size-5 text-content-primary' />
          <h3 className='text-sm font-semibold text-content-primary'>
            Content Analysis
          </h3>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
          className='size-7'
          aria-label='Close analysis panel'
        >
          <X className='size-4' />
        </Button>
      </div>

      {/* Scores */}
      <div className='mb-4 grid grid-cols-4 gap-2 rounded-md bg-surface-page p-3'>
        <ScoreRing score={result.overallScore} label='Overall' />
        <ScoreRing score={result.grammarScore} label='Grammar' />
        <ScoreRing score={result.readabilityScore} label='Clarity' />
        <ScoreRing score={result.atsScore} label='ATS' />
      </div>

      {/* Issues */}
      {hasIssues && (
        <div className='mb-4'>
          <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
            Issues ({result.issues.length})
          </h4>
          <ul className='space-y-2'>
            {result.issues.map((issue, i) => (
              <li
                key={i}
                className='rounded-md border border-border-subtle bg-surface-page p-2'
              >
                <div className='flex items-start gap-2'>
                  {severityIcon(issue.severity)}
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-xs font-medium text-content-primary'>
                        {issue.section}
                      </span>
                      <span className='rounded bg-surface-card px-1 py-0.5 text-[10px] text-content-muted'>
                        {typeLabel(issue.type)}
                      </span>
                    </div>
                    <p className='mt-0.5 text-xs text-content-secondary'>
                      {issue.message}
                    </p>
                    {issue.suggestion && (
                      <p className='mt-1 text-xs italic text-feedback-success'>
                        Suggestion: {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {hasSuggestions && (
        <div>
          <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
            Suggestions ({result.suggestions.length})
          </h4>
          <ul className='space-y-2'>
            {result.suggestions.map((s, i) => (
              <li
                key={i}
                className='rounded-md border border-border-subtle bg-surface-page p-2'
              >
                <div className='flex items-start gap-2'>
                  <CheckCircle2 className='size-4 shrink-0 text-feedback-success' />
                  <div className='min-w-0 flex-1'>
                    <span className='text-xs font-medium text-content-primary'>
                      {s.section}
                    </span>
                    <p className='mt-0.5 text-xs text-content-secondary'>
                      {s.message}
                    </p>
                    {s.suggestedText && (
                      <p className='mt-1 rounded bg-feedback-success/10 px-1.5 py-0.5 text-xs text-feedback-success'>
                        {s.suggestedText}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasIssues && !hasSuggestions && (
        <div className='flex items-center gap-2 rounded-md bg-feedback-success/10 p-3'>
          <CheckCircle2 className='size-5 text-feedback-success' />
          <p className='text-sm text-feedback-success'>
            Your CV looks great! No issues found.
          </p>
        </div>
      )}
    </div>
  );
}
