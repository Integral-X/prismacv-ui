'use client';

import * as React from 'react';
import { Linkedin, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkedInImportProps {
  onImport?: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

type ImportState = 'idle' | 'hover' | 'importing' | 'success' | 'error';

interface ImportedProfile {
  url: string;
  displayName: string;
}

export const LinkedInImport = ({
  onImport,
  onRemove,
  className,
}: LinkedInImportProps) => {
  const [state, setState] = React.useState<ImportState>('idle');
  const [linkedInUrl, setLinkedInUrl] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [importedProfile, setImportedProfile] =
    React.useState<ImportedProfile | null>(null);
  const [importProgress, setImportProgress] = React.useState(0);

  const validateLinkedInUrl = (
    url: string
  ): { valid: boolean; error?: string } => {
    if (!url.trim()) {
      return {
        valid: false,
        error: 'Please enter a LinkedIn profile URL',
      };
    }

    // LinkedIn URL patterns
    const linkedInPatterns = [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i,
      /^https?:\/\/(www\.)?linkedin\.com\/pub\/[\w-]+\/?$/i,
      /^linkedin\.com\/in\/[\w-]+\/?$/i,
      /^linkedin\.com\/pub\/[\w-]+\/?$/i,
    ];

    const isValid = linkedInPatterns.some((pattern) =>
      pattern.test(url.trim())
    );

    if (!isValid) {
      return {
        valid: false,
        error:
          'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)',
      };
    }

    return { valid: true };
  };

  const normalizeLinkedInUrl = (url: string): string => {
    let normalized = url.trim();
    if (
      !normalized.startsWith('http://') &&
      !normalized.startsWith('https://')
    ) {
      normalized = `https://${normalized}`;
    }
    return normalized;
  };

  const simulateImport = (url: string) => {
    setState('importing');
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setState('success');
          // Extract username from URL for display
          const match = url.match(/linkedin\.com\/in\/([\w-]+)/i);
          const displayName = match ? match[1] : 'LinkedIn Profile';
          setImportedProfile({
            url: normalizeLinkedInUrl(url),
            displayName,
          });
          onImport?.(normalizeLinkedInUrl(url));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImport = () => {
    const validation = validateLinkedInUrl(linkedInUrl);

    if (!validation.valid) {
      setState('error');
      setErrorMessage(validation.error || 'Invalid LinkedIn URL');
      setTimeout(() => {
        setState('idle');
        setErrorMessage('');
      }, 4000);
      return;
    }

    simulateImport(linkedInUrl);
  };

  const handleRemove = () => {
    setImportedProfile(null);
    setLinkedInUrl('');
    setState('idle');
    setImportProgress(0);
    onRemove?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleImport();
    }
  };

  const getBorderColor = () => {
    switch (state) {
      case 'hover':
        return 'border-primary/50';
      case 'error':
        return 'border-red-500';
      case 'success':
        return 'border-green-500';
      default:
        return 'border-dashed border-gray-300';
    }
  };

  const getBackgroundColor = () => {
    switch (state) {
      case 'hover':
        return 'bg-primary/5';
      case 'error':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      default:
        return 'bg-white';
    }
  };

  // Success state
  if (state === 'success' && importedProfile) {
    return (
      <div className={cn('w-full', className)}>
        <div
          className={cn(
            'relative border-2 rounded-lg p-6 transition-all duration-300',
            getBorderColor(),
            getBackgroundColor()
          )}
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {importedProfile.displayName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {importedProfile.url}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          {/* Importing status */}
          <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
            <div className="shrink-0 w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span>Importing your LinkedIn profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // Importing state
  if (state === 'importing') {
    return (
      <div className={cn('w-full', className)}>
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Importing profile...</span>
                <span className="text-primary font-medium">
                  {importProgress}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default, hover, and error states
  return (
    <div className={cn('w-full', className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Import LinkedIn profile - enter URL or click to focus input"
        onMouseEnter={() => state === 'idle' && setState('hover')}
        onMouseLeave={() => state === 'hover' && setState('idle')}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative border-2 rounded-lg p-8 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          getBorderColor(),
          getBackgroundColor(),
          state === 'hover' && 'scale-[1.01]'
        )}
        onClick={(e) => {
          // Only focus input if clicking on the card itself, not the input/button
          if (e.target === e.currentTarget) {
            const input = e.currentTarget.querySelector('input');
            input?.focus();
          }
        }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* LinkedIn Icon */}
          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
              state === 'error' ? 'bg-red-100' : 'bg-[#0077B5]/10',
              state === 'hover' && 'scale-110 bg-[#0077B5]/20'
            )}
          >
            {state === 'error' ? (
              <AlertCircle className="w-10 h-10 text-red-600" />
            ) : (
              <Linkedin className="w-10 h-10 text-[#0077B5]" />
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {state === 'error'
                ? 'Import Failed'
                : 'Drop your linkedin profile here'}
            </h3>
            {state === 'error' && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>

          {/* Input Field and Import Button */}
          <div className="w-full max-w-md flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Linkedin className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="https://linkedin.com/in/..."
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'pl-10 pr-4 py-6 text-base',
                  state === 'error' && 'border-red-500 focus:border-red-500'
                )}
                aria-label="LinkedIn profile URL"
              />
            </div>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleImport();
              }}
              disabled={!linkedInUrl.trim()}
              className="px-8 py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
