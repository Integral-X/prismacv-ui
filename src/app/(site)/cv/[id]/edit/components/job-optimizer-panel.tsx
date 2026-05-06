'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CvOptimizationResult } from '@/modules/ai/data/mappers';
import { optimizeCvAction } from '@/modules/ai/data/actions';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Target,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface JobOptimizerPanelProps {
  cvId: string;
  onClose: () => void;
}

export function JobOptimizerPanel({ cvId, onClose }: JobOptimizerPanelProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CvOptimizationResult | null>(null);

  async function handleOptimize() {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await optimizeCvAction(cvId, {
        jobDescription: jobDescription.trim(),
      });
      if (res.ok && res.data) {
        setResult(res.data);
      } else if (res.ok && !res.data) {
        toast.error('Analysis returned no data. Please try again.');
      } else if (!res.ok) {
        toast.error(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function scoreColor(score: number) {
    if (score >= 80) return 'text-feedback-success';
    if (score >= 60) return 'text-feedback-warning';
    return 'text-feedback-error';
  }

  function priorityIcon(priority: 'low' | 'medium' | 'high') {
    switch (priority) {
      case 'high':
        return <AlertTriangle className='size-4 shrink-0 text-feedback-error' />;
      case 'medium':
        return <AlertTriangle className='size-4 shrink-0 text-feedback-warning' />;
      case 'low':
        return <CheckCircle2 className='size-4 shrink-0 text-feedback-info' />;
    }
  }

  return (
    <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Target className='size-5 text-content-primary' />
          <h3 className='text-sm font-semibold text-content-primary'>
            ATS Job Match Optimizer
          </h3>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
          className='size-7'
          aria-label='Close job match optimizer'
          disabled={isLoading}
        >
          <X className='size-4' />
        </Button>
      </div>

      {!result ? (
        <>
          <p className='mb-3 text-xs text-content-secondary'>
            Paste a job description to see how well your CV matches and get
            optimization suggestions.
          </p>
          <label htmlFor='job-description' className='sr-only'>Job description</label>
          <textarea
            id='job-description'
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Paste the job description here...'
            className='mb-3 h-32 w-full resize-none rounded-md border border-border-subtle bg-surface-page p-3 text-sm text-content-primary placeholder:text-content-muted focus:border-border-interactive focus:outline-none'
          />
          <Button
            onClick={handleOptimize}
            disabled={isLoading || !jobDescription.trim()}
            className='w-full'
            size='sm'
          >
            {isLoading ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              <>
                <Target className='size-4' />
                Analyze Match
              </>
            )}
          </Button>
        </>
      ) : (
        <div className='space-y-4'>
          {/* Match Score */}
          <div className='flex items-center gap-3 rounded-md bg-surface-page p-3'>
            <span
              className={cn('text-3xl font-bold', scoreColor(result.matchScore))}
            >
              {result.matchScore}%
            </span>
            <div>
              <p className='text-sm font-medium text-content-primary'>
                Job Match Score
              </p>
              <p className='text-xs text-content-secondary'>
                {result.matchScore >= 80
                  ? 'Excellent match!'
                  : result.matchScore >= 60
                    ? 'Good match with room to improve'
                    : 'Needs significant optimization'}
              </p>
            </div>
          </div>

          {/* Missing Keywords */}
          {result.missingKeywords.length > 0 && (
            <div>
              <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                Missing Keywords ({result.missingKeywords.length})
              </h4>
              <div className='flex flex-wrap gap-1.5'>
                {result.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className='rounded-full bg-feedback-error/10 px-2 py-0.5 text-xs font-medium text-feedback-error'
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section Recommendations */}
          {result.sectionRecommendations.length > 0 && (
            <div>
              <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                Section Recommendations
              </h4>
              <ul className='space-y-2'>
                {result.sectionRecommendations.map((rec) => (
                  <li
                    key={`${rec.section}-${rec.action}-${rec.priority}`}
                    className='rounded-md border border-border-subtle bg-surface-page p-2'
                  >
                    <div className='flex items-start gap-2'>
                      {priorityIcon(rec.priority)}
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-1.5'>
                          <span className='text-xs font-medium text-content-primary'>
                            {rec.section}
                          </span>
                          <span className='rounded bg-surface-card px-1 py-0.5 text-[10px] capitalize text-content-muted'>
                            {rec.action}
                          </span>
                        </div>
                        <p className='mt-0.5 text-xs text-content-secondary'>
                          {rec.message}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div>
              <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                Content Suggestions ({result.suggestions.length})
              </h4>
              <ul className='space-y-2'>
                {result.suggestions.map((s) => (
                  <li
                    key={`${s.section}-${s.message.slice(0, 30)}`}
                    className='rounded-md border border-border-subtle bg-surface-page p-2'
                  >
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
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Try again */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => setResult(null)}
            className='w-full'
          >
            Try another job description
          </Button>
        </div>
      )}
    </div>
  );
}
