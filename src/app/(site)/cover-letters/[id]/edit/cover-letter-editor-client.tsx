'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CoverLetter } from '@/modules/cover-letters/data/mappers';
import {
  updateCoverLetterAction,
  generateCoverLetterAction,
} from '@/modules/cover-letters/data/actions';

interface CoverLetterEditorClientProps {
  coverLetter: CoverLetter;
}

export function CoverLetterEditorClient({
  coverLetter: initial,
}: CoverLetterEditorClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [jobTitle, setJobTitle] = useState(initial.jobTitle ?? '');
  const [company, setCompany] = useState(initial.company ?? '');
  const [tone, setTone] = useState(initial.tone);
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const result = await updateCoverLetterAction(initial.id, {
        title,
        content,
        jobTitle: jobTitle || undefined,
        company: company || undefined,
        tone,
      });

      if (result.ok) {
        toast.success('Cover letter saved');
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleGenerate() {
    if (!initial.cvId) {
      toast.error('Link a CV first to generate content');
      return;
    }

    setIsGenerating(true);
    startTransition(async () => {
      const result = await generateCoverLetterAction({
        cvId: initial.cvId!,
        jobTitle: jobTitle || undefined,
        company: company || undefined,
        jobDescription: jobDescription || undefined,
        tone,
      });

      setIsGenerating(false);

      if (result.ok && result.data) {
        setContent(result.data.content);
        toast.success('Cover letter generated');
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className='min-h-screen bg-surface-primary'>
      {/* Header */}
      <header className='sticky top-0 z-10 border-b border-border-subtle bg-surface-card px-4 py-3'>
        <div className='mx-auto flex max-w-5xl items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Link href='/cover-letters'>
              <Button variant='ghost' size='icon' aria-label='Back to cover letters'>
                <ArrowLeft className='size-4' />
              </Button>
            </Link>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label='Cover letter title'
              className='h-8 w-64 border-none bg-transparent text-lg font-semibold focus-visible:ring-1'
            />
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleGenerate}
              disabled={isPending || isGenerating || !initial.cvId}
            >
              {isGenerating ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Sparkles className='size-4' />
              )}
              Generate
            </Button>
            <Button size='sm' onClick={handleSave} disabled={isPending}>
              <Save className='size-4' />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className='mx-auto max-w-5xl px-4 py-6'>
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Left: editor */}
          <div className='space-y-4 lg:col-span-2'>
            <div>
              <Label htmlFor='content'>Cover Letter Content</Label>
              <Textarea
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Write your cover letter here or use Generate to create one from your CV...'
                className='mt-1 min-h-[400px] resize-y font-mono text-sm'
              />
            </div>
          </div>

          {/* Right: settings */}
          <div className='space-y-4'>
            <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
              <h3 className='mb-3 text-sm font-medium text-content-primary'>
                Details
              </h3>
              <div className='space-y-3'>
                <div>
                  <Label htmlFor='jobTitle'>Job Title</Label>
                  <Input
                    id='jobTitle'
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder='e.g. Frontend Engineer'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor='company'>Company</Label>
                  <Input
                    id='company'
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder='e.g. Google'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor='tone'>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id='tone' className='mt-1 w-full'>
                      <SelectValue placeholder='Select tone' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='professional'>Professional</SelectItem>
                      <SelectItem value='casual'>Casual</SelectItem>
                      <SelectItem value='enthusiastic'>Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {initial.cvId && (
              <div className='rounded-lg border border-border-subtle bg-surface-card p-4'>
                <h3 className='mb-3 text-sm font-medium text-content-primary'>
                  AI Generation
                </h3>
                <div>
                  <Label htmlFor='jobDescription'>
                    Job Description (optional)
                  </Label>
                  <Textarea
                    id='jobDescription'
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder='Paste the job description to tailor the letter...'
                    className='mt-1 min-h-[120px] text-sm'
                  />
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleGenerate}
                  disabled={isPending || isGenerating}
                  className='mt-3 w-full'
                >
                  {isGenerating ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    <Sparkles className='size-4' />
                  )}
                  Generate from CV
                </Button>
              </div>
            )}

            {!initial.cvId && (
              <div className='rounded-lg border border-dashed border-border-subtle p-4 text-center'>
                <p className='text-xs text-content-tertiary'>
                  Link this cover letter to a CV to enable AI generation.
                </p>
                <Button
                  variant='link'
                  size='sm'
                  className='mt-1'
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
