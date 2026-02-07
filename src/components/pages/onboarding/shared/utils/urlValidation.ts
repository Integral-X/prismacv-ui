/**
 * URL validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * LinkedIn URL validation patterns
 */
const LINKEDIN_PATTERNS = [
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i,
  /^https?:\/\/(www\.)?linkedin\.com\/pub\/[\w-]+\/?$/i,
  /^linkedin\.com\/in\/[\w-]+\/?$/i,
  /^linkedin\.com\/pub\/[\w-]+\/?$/i,
] as const;

/**
 * Validates a LinkedIn profile URL
 */
export const validateLinkedInUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return {
      valid: false,
      error: 'Please enter a LinkedIn profile URL',
    };
  }

  const isValid = LINKEDIN_PATTERNS.some((pattern) => pattern.test(url.trim()));

  if (!isValid) {
    return {
      valid: false,
      error:
        'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)',
    };
  }

  return { valid: true };
};

/**
 * Normalizes a LinkedIn URL by adding https:// if missing
 */
export const normalizeLinkedInUrl = (url: string): string => {
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  return normalized;
};

/**
 * Extracts display name from LinkedIn URL
 */
export const extractLinkedInDisplayName = (url: string): string => {
  const match = url.match(/linkedin\.com\/in\/([\w-]+)/i);
  return match ? match[1] : 'LinkedIn Profile';
};
