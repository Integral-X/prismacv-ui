/**
 * FileUpload component types
 */

export interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  maxSizeMB?: number;
  acceptedFormats?: readonly string[];
  className?: string;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: string;
}
