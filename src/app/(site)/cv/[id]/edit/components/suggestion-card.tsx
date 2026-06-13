'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CvSuggestion } from '@/modules/ai/data/mappers';
import {
  useApplySuggestion,
  useCanApplySuggestion,
} from '@/modules/cv/editor/editor-provider';

/**
 * One AI suggestion rendered as a review-diff: the original text (when echoed)
 * above the proposed rewrite, with an Apply control that writes the rewrite into
 * the draft. Apply only shows when the suggestion resolves to a concrete field;
 * otherwise the card stays informational.
 */
export function SuggestionCard({ suggestion }: { suggestion: CvSuggestion }) {
  const applySuggestion = useApplySuggestion();
  const canApply = useCanApplySuggestion(suggestion);
  const [applied, setApplied] = useState(false);

  function handleApply() {
    if (applySuggestion(suggestion)) {
      setApplied(true);
      toast.success('Suggestion applied to your CV.');
    } else {
      toast.error(
        "Couldn't match this suggestion to a section — edit it manually."
      );
    }
  }

  return (
    <div className='rounded-md border border-border-subtle p-2.5'>
      <p className='text-xs text-content-primary'>{suggestion.message}</p>

      {suggestion.originalText && (
        <p className='mt-1.5 rounded bg-surface-elevated p-1.5 text-xs text-content-tertiary line-through'>
          {suggestion.originalText}
        </p>
      )}

      {suggestion.suggestedText && (
        <p className='mt-1 rounded bg-feedback-success/10 p-1.5 text-xs text-feedback-success'>
          {suggestion.suggestedText}
        </p>
      )}

      <div className='mt-2 flex items-center justify-between gap-2'>
        <Badge variant='secondary' className='text-[10px]'>
          {suggestion.section} · {suggestion.type}
        </Badge>

        {applied ? (
          <span className='flex items-center gap-1 text-[10px] font-medium text-feedback-success'>
            <Check className='size-3' />
            Applied
          </span>
        ) : (
          canApply && (
            <Button
              variant='outline'
              size='sm'
              className='h-6 px-2 text-[10px]'
              onClick={handleApply}
            >
              <Wand2 className='size-3' />
              Apply
            </Button>
          )
        )}
      </div>
    </div>
  );
}
