'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Edit, MoreHorizontal, Star, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CvListItem } from '@/modules/cv/data/mappers';

interface CvCardProps {
  cv: CvListItem;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function CvCard({ cv, onEdit, onDuplicate, onDelete }: CvCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <Card
      className={cn(
        'bg-surface-card border-subtle shadow-card',
        'relative flex flex-col gap-3 p-5',
        'transition-shadow hover:shadow-lg'
      )}
    >
      <div className='flex items-start justify-between'>
        <h3
          className='text-content-primary truncate text-lg font-semibold'
          title={cv.title}
        >
          {cv.title}
        </h3>
        <div ref={menuRef} className='relative'>
          <button
            type='button'
            onClick={() => setMenuOpen((prev) => !prev)}
            className={cn(
              'text-content-secondary hover:text-content-primary',
              'rounded-md p-1 transition-colors'
            )}
            aria-label='CV actions'
          >
            <MoreHorizontal className='h-5 w-5' />
          </button>
          {menuOpen && (
            <div
              className={cn(
                'bg-surface-card border-subtle shadow-card',
                'absolute right-0 top-8 z-10 w-40',
                'rounded-md border py-1'
              )}
            >
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(cv.id);
                }}
                className={cn(
                  'text-content-primary',
                  'flex w-full items-center gap-2 px-3 py-2',
                  'text-sm hover:bg-surface-primary'
                )}
              >
                <Edit className='h-4 w-4' />
                Edit
              </button>
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate(cv.id);
                }}
                className={cn(
                  'text-content-primary',
                  'flex w-full items-center gap-2 px-3 py-2',
                  'text-sm hover:bg-surface-primary'
                )}
              >
                <Copy className='h-4 w-4' />
                Duplicate
              </button>
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(cv.id);
                }}
                className={cn(
                  'text-feedback-error',
                  'flex w-full items-center gap-2 px-3 py-2',
                  'text-sm hover:bg-surface-primary'
                )}
              >
                <Trash2 className='h-4 w-4' />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Badge
          variant={cv.status === 'published' ? 'default' : 'outline'}
          className={cn(
            cv.status === 'published'
              ? 'bg-feedback-success/15 text-feedback-success border-feedback-success/30'
              : 'border-yellow-400/50 text-yellow-600'
          )}
        >
          {cv.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
        {cv.isDefault && (
          <Badge
            variant='outline'
            className='border-brand-primary/30 text-brand-primary'
          >
            <Star className='mr-1 h-3 w-3' />
            Default
          </Badge>
        )}
      </div>

      <p className='text-content-secondary text-sm'>
        Updated {timeAgo(cv.updatedAt)}
      </p>
    </Card>
  );
}
