'use client';

import * as React from 'react';
import { LinkedInImportProps, ImportedProfile } from './types';
import { ERROR_DISPLAY_DURATION_MS } from './constants';
import {
  validateLinkedInUrl,
  normalizeLinkedInUrl,
  extractLinkedInDisplayName,
} from '../shared/utils/urlValidation';
import { useProgressSimulation } from '../shared/hooks/useProgressSimulation';
import type { ImportState } from '../shared/utils/stateStyles';
import { LinkedInImportSuccess } from './LinkedInImportSuccess';
import { LinkedInImportProgress } from './LinkedInImportProgress';
import { LinkedInImportForm } from './LinkedInImportForm';

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
  const pendingUrlRef = React.useRef<string | null>(null);
  const errorResetTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  React.useEffect(() => {
    return () => {
      if (errorResetTimeoutRef.current !== null) {
        clearTimeout(errorResetTimeoutRef.current);
        errorResetTimeoutRef.current = null;
      }
    };
  }, []);

  const {
    progress,
    start: startProgress,
    reset: resetProgress,
  } = useProgressSimulation({
    onComplete: () => {
      if (pendingUrlRef.current) {
        const normalizedUrl = normalizeLinkedInUrl(pendingUrlRef.current);
        const displayName = extractLinkedInDisplayName(normalizedUrl);
        setImportedProfile({
          url: normalizedUrl,
          displayName,
        });
        setState('success');
        onImport?.(normalizedUrl);
        pendingUrlRef.current = null;
      }
    },
  });

  const handleImport = () => {
    const validation = validateLinkedInUrl(linkedInUrl);

    if (!validation.valid) {
      if (errorResetTimeoutRef.current !== null) {
        clearTimeout(errorResetTimeoutRef.current);
        errorResetTimeoutRef.current = null;
      }
      setState('error');
      setErrorMessage(validation.error || 'Invalid LinkedIn URL');
      errorResetTimeoutRef.current = setTimeout(() => {
        errorResetTimeoutRef.current = null;
        setState('idle');
        setErrorMessage('');
      }, ERROR_DISPLAY_DURATION_MS);
      return;
    }

    setState('importing');
    pendingUrlRef.current = linkedInUrl;
    startProgress();
  };

  const handleRemove = () => {
    setImportedProfile(null);
    setLinkedInUrl('');
    setState('idle');
    resetProgress();
    onRemove?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleImport();
    }
  };

  // Success state
  if (state === 'success' && importedProfile) {
    return (
      <LinkedInImportSuccess
        importedProfile={importedProfile}
        state={state}
        onRemove={handleRemove}
        className={className}
      />
    );
  }

  // Importing state
  if (state === 'importing') {
    return <LinkedInImportProgress progress={progress} className={className} />;
  }

  // Default, hover, and error states
  return (
    <LinkedInImportForm
      state={state}
      linkedInUrl={linkedInUrl}
      errorMessage={errorMessage}
      onUrlChange={setLinkedInUrl}
      onImport={handleImport}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => state === 'idle' && setState('hover')}
      onMouseLeave={() => state === 'hover' && setState('idle')}
      className={className}
    />
  );
};
