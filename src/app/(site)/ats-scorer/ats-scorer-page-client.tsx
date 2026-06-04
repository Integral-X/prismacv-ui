'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scoreAtsAction } from '@/modules/ats/data/actions';
import type { AtsScoreResult } from '@/modules/ats/data/mappers';

export function AtsScorerPageClient() {
  const [cvText, setCvText] = React.useState('');
  const [jobDescription, setJobDescription] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<AtsScoreResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cv = cvText.trim();
    const jd = jobDescription.trim();
    if (cv.length < 20) {
      toast.error('Paste more CV text (at least a few sentences).');
      return;
    }
    if (jd.length < 20) {
      toast.error('Paste a fuller job description for a useful score.');
      return;
    }
    setPending(true);
    try {
      const res = await scoreAtsAction({ cvText: cv, jobDescription: jd });
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      setResult(res.data ?? null);
      toast.success('ATS score ready.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className='container max-w-4xl py-10 px-4'>
      <div className='mb-8'>
        <h1 className='text-3xl font-semibold text-content-primary'>
          ATS match scorer
        </h1>
        <p className='mt-2 text-content-secondary'>
          Compare your resume text against a job description. Uses the same
          keyword engine as the CV optimizer — no saved CV required.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='ats-cv'>Resume text</Label>
          <Textarea
            id='ats-cv'
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder='Paste plain text from your CV…'
            rows={12}
            className='font-mono text-sm'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='ats-jd'>Job description</Label>
          <Textarea
            id='ats-jd'
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder='Paste the job posting…'
            rows={10}
            className='font-mono text-sm'
          />
        </div>
        <Button type='submit' disabled={pending}>
          {pending ? (
            <Loader2 className='mr-2 size-4 animate-spin' />
          ) : (
            <BarChart3 className='mr-2 size-4' />
          )}
          Score match
        </Button>
      </form>

      {result && (
        <div className='mt-10 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Overall score</CardTitle>
              <CardDescription>
                Keyword match rate: {Math.round(result.keywordMatchRate)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-4xl font-bold text-content-primary'>
                {Math.round(result.overallScore)}
              </p>
            </CardContent>
          </Card>

          {result.missingKeywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Missing keywords</CardTitle>
                <CardDescription>
                  Terms from the job description not clearly found in your CV
                  text.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-wrap gap-2'>
                {result.missingKeywords.map((k) => (
                  <Badge key={k} variant='secondary'>
                    {k}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='list-disc space-y-2 pl-5 text-sm text-content-secondary'>
                  {result.suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Section scores</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {result.sectionScores.map((s) => (
                <div
                  key={s.name}
                  className='rounded-md border border-subtle p-3'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-medium text-content-primary'>
                      {s.name}
                    </span>
                    <Badge variant='outline'>{Math.round(s.score)}</Badge>
                  </div>
                  <p className='mt-1 text-sm text-content-secondary'>
                    {s.feedback}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
