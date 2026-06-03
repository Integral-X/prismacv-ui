'use client';

import { useState } from 'react';
import { CloudUpload, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CvListItem } from '@/modules/cv/data/mappers';

interface JobCvPickerProps {
  cvs: CvListItem[];
  selectedCvId: string;
  onCvChange: (cvId: string) => void;
}

export function JobCvPicker({
  cvs,
  selectedCvId,
  onCvChange,
}: JobCvPickerProps) {
  const [switchOpen, setSwitchOpen] = useState(false);
  const selectedCv = cvs.find((cv) => cv.id === selectedCvId) ?? cvs[0] ?? null;

  return (
    <div className='space-y-3'>
      <Label className='text-content-primary'>CV Version</Label>
      <div className='flex items-center justify-between gap-3 rounded-lg border border-subtle bg-surface-page px-4 py-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <FileText className='size-5 shrink-0 text-primary' aria-hidden />
          <span className='truncate font-medium text-content-primary'>
            {selectedCv ? selectedCv.title : 'No resume yet'}
          </span>
        </div>
        {cvs.length > 1 ? (
          switchOpen ? (
            <Select
              value={selectedCv?.id}
              onValueChange={(value) => {
                onCvChange(value);
                setSwitchOpen(false);
              }}
            >
              <SelectTrigger className='h-8 w-[120px]'>
                <SelectValue placeholder='Select CV' />
              </SelectTrigger>
              <SelectContent>
                {cvs.map((cv) => (
                  <SelectItem key={cv.id} value={cv.id}>
                    {cv.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button
              type='button'
              variant='link'
              className='h-auto shrink-0 px-0 text-primary'
              onClick={() => setSwitchOpen(true)}
              disabled={cvs.length === 0}
            >
              Switch
            </Button>
          )
        ) : null}
      </div>

      <div className='relative py-2'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-subtle' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-surface-card px-2 text-content-muted'>OR</span>
        </div>
      </div>

      <div
        className='flex cursor-not-allowed flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-subtle bg-surface-page px-4 py-8 text-center opacity-70'
        aria-disabled
      >
        <CloudUpload className='size-8 text-primary' aria-hidden />
        <p className='text-sm font-medium text-content-primary'>
          Upload PDF or DOC
        </p>
        <p className='text-xs text-content-muted'>
          Used only to improve skill matching. Coming soon.
        </p>
      </div>
    </div>
  );
}
