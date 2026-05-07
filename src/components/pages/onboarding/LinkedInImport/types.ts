/**
 * LinkedInImport component types
 */

export interface LinkedInImportProps {
  onImport?: (url: string, importId?: string) => void;
  onRemove?: () => void;
  importFn?: (url: string) => Promise<{ importId: string }>;
  className?: string;
}

export interface ImportedProfile {
  url: string;
  displayName: string;
  importId?: string;
}
