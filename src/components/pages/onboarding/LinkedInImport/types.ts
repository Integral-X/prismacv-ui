/**
 * LinkedInImport component types
 */

export interface LinkedInImportProps {
  onImport?: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export interface ImportedProfile {
  url: string;
  displayName: string;
}
