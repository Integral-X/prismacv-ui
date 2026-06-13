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
import type { CvOptimizationResult } from '@/modules/ai/data/mappers';
import { queueAiOptimizeAction } from '@/modules/queue/data/actions';
import {
  toQueueCvOptimizationResult,
  type QueueJobState,
} from '@/modules/queue/data/mappers';
import { pollQueueJob } from '@/modules/queue/ui/poll-queue-job';
import { useFlushPendingEdits } from '@/modules/cv/editor/editor-provider';
import { SuggestionCard } from './suggestion-card';

interface AiOptimizePanelProps {
  cvId: string;
  onClose: () => void;
}

export function AiOptimizePanel({ cvId, onClose }: AiOptimizePanelProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CvOptimizationResult | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobState, setJobState] = useState<QueueJobState | null>(null);
  const flushPendingEdits = useFlushPendingEdits();

  function handleOptimize() {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error('Please fill in both fields.');
      return;
    }
    startTransition(async () => {
      // Persist any pending inline edits so the AI optimises current content.
      await flushPendingEdits();
      setJobState('waiting');
      const queued = await queueAiOptimizeAction({
        cvId,
        jobDescription: `${jobTitle.trim()}\n\n${jobDescription.trim()}`,
      });
      if (!queued.ok || !queued.data) {
        setJobState(null);
        toast.error(
          queued.ok ? 'Unable to queue CV optimization.' : queued.message
        );
        return;
      }

      try {
        const status = await pollQueueJob({
          jobId: queued.data.jobId,
          onStatus: (nextStatus) => setJobState(nextStatus.state),
        });

        if (status.state === 'failed') {
          toast.error(
            status.error ?? 'CV optimization failed. Please try again.'
          );
          return;
        }

        const optimization = toQueueCvOptimizationResult(status.result);
        if (!optimization) {
          toast.error('Optimization returned no data. Please try again.');
          return;
        }

        setResult(optimization);
        toast.success('CV optimization complete.');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Unable to optimize your CV.'
        );
      } finally {
        setJobState(null);
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
        {isPending && jobState && (
          <div className='space-y-2'>
            <Progress value={jobState === 'active' ? 65 : 25} />
            <p className='text-center text-xs text-content-secondary'>
              Optimization {jobState.replace('-', ' ')}
            </p>
          </div>
        )}
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
                  <SuggestionCard key={idx} suggestion={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
