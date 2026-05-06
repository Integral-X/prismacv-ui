'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { analyzeCvAction } from '@/modules/ai/data/actions';
import type { CvAnalysisResult } from '@/modules/ai/data/mappers';

interface AiAnalysisPanelProps {
  cvId: string;
  onClose: () => void;
}

const SEVERITY_ICON = {
  high: AlertTriangle,
  medium: Info,
  low: CheckCircle2,
} as const;

const SEVERITY_COLOR = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
} as const;

export function AiAnalysisPanel({ cvId, onClose }: AiAnalysisPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CvAnalysisResult | null>(null);

  function handleAnalyze() {
    startTransition(async () => {
      const response = await analyzeCvAction(cvId);
      if (response.ok && response.data) {
        setResult(response.data);
      } else if (!response.ok) {
        toast.error(response.message);
      }
    });
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <div className='rounded-lg border border-border-subtle bg-surface-card'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-border-subtle p-4'>
        <div className='flex items-center gap-2'>
          <Sparkles className='size-4 text-brand-primary' />
          <h3 className='text-sm font-medium text-content-primary'>
            AI Analysis
          </h3>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleAnalyze}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Sparkles className='size-4' />
            )}
            {result ? 'Re-analyze' : 'Analyze CV'}
          </Button>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='size-4' />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        {!result && !isPending && (
          <div className='py-6 text-center'>
            <Sparkles className='mx-auto mb-3 size-8 text-content-tertiary opacity-50' />
            <p className='text-sm text-content-secondary'>
              Click Analyze CV to get AI-powered feedback on your resume
            </p>
          </div>
        )}

        {isPending && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='size-6 animate-spin text-brand-primary' />
          </div>
        )}

        {result && !isPending && (
          <div className='space-y-4'>
            {/* Scores */}
            <div className='grid grid-cols-2 gap-3'>
              <ScoreCard
                label='Overall'
                score={result.overallScore}
                color={getScoreColor(result.overallScore)}
              />
              <ScoreCard
                label='ATS'
                score={result.atsScore}
                color={getScoreColor(result.atsScore)}
              />
              <ScoreCard
                label='Grammar'
                score={result.grammarScore}
                color={getScoreColor(result.grammarScore)}
              />
              <ScoreCard
                label='Readability'
                score={result.readabilityScore}
                color={getScoreColor(result.readabilityScore)}
              />
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div>
                <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                  Issues ({result.issues.length})
                </h4>
                <div className='space-y-2'>
                  {result.issues.map((issue, idx) => {
                    const Icon = SEVERITY_ICON[issue.severity];
                    return (
                      <div
                        key={idx}
                        className='rounded-md border border-border-subtle p-2.5'
                      >
                        <div className='flex items-start gap-2'>
                          <Icon
                            className={cn(
                              'mt-0.5 size-3.5',
                              SEVERITY_COLOR[issue.severity]
                            )}
                          />
                          <div className='flex-1'>
                            <p className='text-xs font-medium text-content-primary'>
                              {issue.message}
                            </p>
                            {issue.suggestion && (
                              <p className='mt-0.5 text-xs text-content-secondary'>
                                {issue.suggestion}
                              </p>
                            )}
                            <Badge
                              variant='secondary'
                              className='mt-1 text-[10px]'
                            >
                              {issue.section} · {issue.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div>
                <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                  Suggestions ({result.suggestions.length})
                </h4>
                <div className='space-y-2'>
                  {result.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className='rounded-md border border-border-subtle p-2.5'
                    >
                      <p className='text-xs text-content-primary'>
                        {suggestion.message}
                      </p>
                      {suggestion.suggestedText && (
                        <p className='mt-1 rounded bg-green-50 p-1.5 text-xs text-green-800'>
                          {suggestion.suggestedText}
                        </p>
                      )}
                      <Badge
                        variant='secondary'
                        className='mt-1 text-[10px]'
                      >
                        {suggestion.section} · {suggestion.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className='rounded-md border border-border-subtle p-2.5'>
      <div className='flex items-center justify-between'>
        <span className='text-xs text-content-secondary'>{label}</span>
        <span className={cn('text-sm font-bold', color)}>{score}</span>
      </div>
      <Progress value={score} className='mt-1.5 h-1.5' />
    </div>
  );
}
