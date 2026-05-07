'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Target, Loader2, X, AlertTriangle, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { optimizeCvAction } from '@/modules/ai/data/actions';
import type { CvOptimizationResult } from '@/modules/ai/data/mappers';

interface AiOptimizePanelProps {
  cvId: string;
  onClose: () => void;
}

export function AiOptimizePanel({ cvId, onClose }: AiOptimizePanelProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CvOptimizationResult | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  function handleOptimize() {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error('Please fill in both fields.');
      return;
    }
    startTransition(async () => {
      const response = await optimizeCvAction(cvId, {
        jobDescription: `${jobTitle.trim()}\n\n${jobDescription.trim()}`,
      });
      if (response.ok && response.data) {
        setResult(response.data);
      } else if (response.ok && !response.data) {
        toast.error('Optimization returned no data. Please try again.');
      } else if (!response.ok) {
        toast.error(response.message);
      }
    });
  }

  return (
    <div className='rounded-lg border border-border-subtle bg-surface-card'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-border-subtle p-4'>
        <div className='flex items-center gap-2'>
          <Target className='size-4 text-brand-primary' />
          <h3 className='text-sm font-medium text-content-primary'>
            Job Optimizer
          </h3>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
          aria-label='Close job optimizer'
        >
          <X className='size-4' />
        </Button>
      </div>

      {/* Input */}
      <div className='space-y-3 border-b border-border-subtle p-4'>
        <Input
          placeholder='Job title (e.g. Senior React Developer)'
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          aria-label='Job title'
        />
        <Textarea
          placeholder='Paste job description here…'
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          aria-label='Job description'
        />
        <Button
          className='w-full'
          size='sm'
          onClick={handleOptimize}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Target className='size-4' />
          )}
          Optimize for this role
        </Button>
      </div>

      {/* Results */}
      {result && !isPending && (
        <div className='space-y-4 p-4'>
          {/* Match Score */}
          <div className='rounded-md border border-border-subtle p-3'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-content-secondary'>
                Match Score
              </span>
              <span
                className={cn(
                  'text-lg font-bold',
                  result.matchScore >= 80
                    ? 'text-feedback-success'
                    : result.matchScore >= 60
                      ? 'text-feedback-warning'
                      : 'text-feedback-error'
                )}
              >
                {result.matchScore}%
              </span>
            </div>
            <Progress value={result.matchScore} className='mt-2 h-2' />
          </div>

          {/* Missing Keywords */}
          {result.missingKeywords.length > 0 && (
            <div>
              <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                Missing Keywords
              </h4>
              <div className='flex flex-wrap gap-1.5'>
                {result.missingKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant='destructive'
                    className='text-[10px]'
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Section Recommendations */}
          {result.sectionRecommendations.length > 0 && (
            <div>
              <h4 className='mb-2 text-xs font-medium uppercase text-content-secondary'>
                Recommendations
              </h4>
              <div className='space-y-2'>
                {result.sectionRecommendations.map((rec, idx) => {
                  const Icon =
                    rec.action === 'add'
                      ? Plus
                      : rec.action === 'remove'
                        ? Minus
                        : AlertTriangle;
                  return (
                    <div
                      key={idx}
                      className='rounded-md border border-border-subtle p-2.5'
                    >
                      <div className='flex items-start gap-2'>
                        <Icon className='mt-0.5 size-3.5 text-content-tertiary' />
                        <div>
                          <p className='text-xs text-content-primary'>
                            {rec.message}
                          </p>
                          <Badge
                            variant='secondary'
                            className='mt-1 text-[10px]'
                          >
                            {rec.section} · {rec.priority}
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
                Content Suggestions
              </h4>
              <div className='space-y-2'>
                {result.suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className='rounded-md border border-border-subtle p-2.5'
                  >
                    <p className='text-xs text-content-primary'>{s.message}</p>
                    {s.suggestedText && (
                      <p className='mt-1 rounded bg-feedback-success/10 p-1.5 text-xs text-feedback-success'>
                        {s.suggestedText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
