'use client';

import * as React from 'react';
import { FileUploadProps, UploadedFile } from './types';
import {
  DEFAULT_MAX_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
  ERROR_DISPLAY_DURATION_MS,
} from './constants';
import { validateFile } from '../shared/utils/fileValidation';
import { formatFileSize } from '../shared/utils/fileFormatting';
import { useProgressSimulation } from '../shared/hooks/useProgressSimulation';
import type { UploadState } from '../shared/utils/stateStyles';
import { FileUploadSuccess } from './FileUploadSuccess';
import { FileUploadProgress } from './FileUploadProgress';
import { FileUploadDropzone } from './FileUploadDropzone';

export const FileUpload = ({
  onFileSelect,
  onFileRemove,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className,
}: FileUploadProps) => {
  const [state, setState] = React.useState<UploadState>('idle');
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const pendingFileRef = React.useRef<{
    file: File;
    formattedFile: UploadedFile;
  } | null>(null);

  const {
    progress,
    start: startProgress,
    reset: resetProgress,
  } = useProgressSimulation({
    onComplete: () => {
      if (pendingFileRef.current) {
        setUploadedFile(pendingFileRef.current.formattedFile);
        setState('success');
        onFileSelect?.(pendingFileRef.current.file);
        pendingFileRef.current = null;
      }
    },
  });

  const handleFile = (file: File) => {
    const validation = validateFile(file, acceptedFormats, maxSizeMB);

    if (!validation.valid) {
      setState('error');
      setErrorMessage(validation.error || 'Invalid file');
      setTimeout(() => {
        setState('idle');
        setErrorMessage('');
      }, ERROR_DISPLAY_DURATION_MS);
      return;
    }

    setState('uploading');

    const formattedFile: UploadedFile = {
      file,
      name: file.name,
      size: formatFileSize(file.size),
    };

    pendingFileRef.current = { file, formattedFile };
    startProgress();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== 'success') {
      setState('dragover');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === 'dragover') {
      setState('idle');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('idle');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setState('idle');
    resetProgress();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove?.();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBrowseClick();
    }
  };

  // Success state
  if (state === 'success' && uploadedFile) {
    return (
      <FileUploadSuccess
        uploadedFile={uploadedFile}
        state={state}
        onRemove={handleRemove}
        className={className}
      />
    );
  }

  // Uploading state
  if (state === 'uploading') {
    return <FileUploadProgress progress={progress} className={className} />;
  }

  // Default, hover, dragover, and error states
  return (
    <FileUploadDropzone
      state={state}
      errorMessage={errorMessage}
      acceptedFormats={acceptedFormats}
      maxSizeMB={maxSizeMB}
      fileInputRef={fileInputRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => state === 'idle' && setState('hover')}
      onMouseLeave={() => state === 'hover' && setState('idle')}
      onKeyDown={handleKeyDown}
      onBrowseClick={handleBrowseClick}
      onFileInput={handleFileInput}
      className={className}
    />
  );
};
