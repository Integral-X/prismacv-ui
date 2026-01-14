'use client';

import * as React from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

type UploadState =
  | 'idle'
  | 'hover'
  | 'dragover'
  | 'uploading'
  | 'success'
  | 'error';

interface UploadedFile {
  file: File;
  name: string;
  size: string;
}

export const FileUpload = ({
  onFileSelect,
  onFileRemove,
  maxSizeMB = 5,
  acceptedFormats = ['.pdf', '.doc', '.docx'],
  className,
}: FileUploadProps) => {
  const [state, setState] = React.useState<UploadState>('idle');
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      return {
        valid: false,
        error: `Invalid file format. Please upload ${acceptedFormats.join(', ')} files.`,
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit. Please upload a smaller file.`,
      };
    }

    return { valid: true };
  };

  const simulateUpload = (file: File) => {
    setState('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setState('success');
          setUploadedFile({
            file,
            name: file.name,
            size: formatFileSize(file.size),
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFile = (file: File) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      setState('error');
      setErrorMessage(validation.error || 'Invalid file');
      setTimeout(() => {
        setState('idle');
        setErrorMessage('');
      }, 4000);
      return;
    }

    simulateUpload(file);
    onFileSelect?.(file);
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
    setUploadProgress(0);
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

  const getBorderColor = () => {
    switch (state) {
      case 'dragover':
        return 'border-primary';
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
      case 'dragover':
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
  if (state === 'success' && uploadedFile) {
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
                {uploadedFile.name}
              </p>
              <p className="text-sm text-gray-500">{uploadedFile.size}</p>
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

          {/* Parsing status */}
          <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
            <div className="shrink-0 w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span>Analyzing your CV...</span>
          </div>
        </div>
      </div>
    );
  }

  // Uploading state
  if (state === 'uploading') {
    return (
      <div className={cn('w-full', className)}>
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-primary font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default, hover, dragover, and error states
  return (
    <div className={cn('w-full', className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CV file - drag and drop or click to browse"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => state === 'idle' && setState('hover')}
        onMouseLeave={() => state === 'hover' && setState('idle')}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative border-2 rounded-lg p-8 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          getBorderColor(),
          getBackgroundColor(),
          state === 'hover' && 'border-primary/50 bg-primary/5',
          state === 'dragover' && 'scale-[1.02]'
        )}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
              state === 'error' ? 'bg-red-100' : 'bg-primary/10',
              state === 'hover' && 'scale-110',
              state === 'dragover' && 'scale-110 bg-primary/20'
            )}
          >
            {state === 'error' ? (
              <AlertCircle className="w-10 h-10 text-red-600" />
            ) : (
              <Upload
                className={cn(
                  'w-10 h-10 text-primary transition-transform duration-300',
                  state === 'dragover' && 'scale-110'
                )}
              />
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {state === 'error' ? 'Upload Failed' : 'Drag & drop your CV here'}
            </h3>
            {state === 'error' ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : (
              <p className="text-sm text-gray-600">or click to browse</p>
            )}
          </div>

          {/* File format info */}
          <p className="text-xs text-gray-500">
            Supports {acceptedFormats.join(', ').toUpperCase()} (Max {maxSizeMB}
            MB)
          </p>

          {/* Browse button */}
          <Button
            type="button"
            variant="default"
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Browse File
          </Button>
        </div>
      </div>
    </div>
  );
};
