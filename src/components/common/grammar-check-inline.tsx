'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, SpellCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkGrammarAction } from '@/modules/grammar/data/actions';
import type { GrammarContextContract } from '@/modules/grammar/data/contracts';

export interface GrammarCheckInlineProps {
  getText: () => string;
  context: GrammarContextContract;
  minLen?: number;
  emptyMessage?: string;
}

export function GrammarCheckInline({
  getText,
  context,
  minLen = 10,
  emptyMessage = 'Add a bit more text before running the checker.',
}: GrammarCheckInlineProps) {
  const [pending, setPending] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [issues, setIssues] = React.useState<
    { message: string; suggestion: string }[]
  >([]);

  function onCheck() {
    const text = getText().trim();
    if (text.length < minLen) {
      toast.error(emptyMessage);
      return;
    }
    setPending(true);
    void (async () => {
      const result = await checkGrammarAction({ text, context });
      setPending(false);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      if (!result.data) return;
      setSummary(result.data.summary);
      setIssues(
        result.data.issues.map((i) => ({
          message: i.message,
          suggestion: i.suggestion,
        }))
      );
      if (result.data.issues.length === 0) {
        toast.success(`Looking good (score ${result.data.score}).`);
      } else {
        toast(`Grammar check — score ${result.data.score}`, {
          description: `${result.data.issues.length} suggestion(s). See details below.`,
        });
      }
    })();
  }

  return (
    <div className='mt-2 space-y-2'>
      <Button
        type='button'
        variant='outline'
        size='sm'
        disabled={pending}
        onClick={onCheck}
      >
        {pending ? (
          <Loader2 className='mr-2 size-4 animate-spin' />
        ) : (
          <SpellCheck2 className='mr-2 size-4' />
        )}
        Check grammar
      </Button>
      {summary ? (
        <div className='space-y-2'>
          <p className='rounded-md border border-subtle bg-surface-primary p-3 text-xs text-content-secondary'>
            {summary}
          </p>
          {issues.length > 0 ? (
            <ul className='space-y-2 text-xs text-content-secondary'>
              {issues.slice(0, 8).map((issue, idx) => (
                <li
                  key={`${issue.message}-${idx}`}
                  className='rounded-md border border-subtle p-2'
                >
                  <span className='font-medium text-content-primary'>
                    {issue.message}
                  </span>
                  {issue.suggestion ? (
                    <span className='mt-1 block text-content-muted'>
                      {issue.suggestion}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
