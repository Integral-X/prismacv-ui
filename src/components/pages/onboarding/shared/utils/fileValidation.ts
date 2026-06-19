/**
 * File validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file against accepted formats and size limits
 */
export const validateFile = (
  file: File,
  acceptedFormats: readonly string[],
  maxSizeMB: number
): ValidationResult => {
  // Check file type
  const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!acceptedFormats.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file format. Please upload ${acceptedFormats.join(", ")} files.`,
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
