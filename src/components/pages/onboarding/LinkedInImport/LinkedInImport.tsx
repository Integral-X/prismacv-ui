"use client";

import * as React from "react";
import { LinkedInImportProps, ImportedProfile } from "./types";
import { ERROR_DISPLAY_DURATION_MS } from "./constants";
import {
  validateLinkedInUrl,
  normalizeLinkedInUrl,
  extractLinkedInDisplayName,
} from "../shared/utils/urlValidation";
import type { ImportState } from "../shared/utils/stateStyles";
import { LinkedInImportSuccess } from "./LinkedInImportSuccess";
import { LinkedInImportProgress } from "./LinkedInImportProgress";
import { LinkedInImportForm } from "./LinkedInImportForm";

export const LinkedInImport = ({
  onImport,
  onRemove,
  importFn,
  className,
}: LinkedInImportProps) => {
  const [state, setState] = React.useState<ImportState>("idle");
  const [linkedInUrl, setLinkedInUrl] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [progress, setProgress] = React.useState(0);
  const [importedProfile, setImportedProfile] =
    React.useState<ImportedProfile | null>(null);
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

  const handleImport = async () => {
    const validation = validateLinkedInUrl(linkedInUrl);

    if (!validation.valid) {
      if (errorResetTimeoutRef.current !== null) {
        clearTimeout(errorResetTimeoutRef.current);
        errorResetTimeoutRef.current = null;
      }
      setState("error");
      setErrorMessage(validation.error || "Invalid LinkedIn URL");
      errorResetTimeoutRef.current = setTimeout(() => {
        errorResetTimeoutRef.current = null;
        setState("idle");
        setErrorMessage("");
      }, ERROR_DISPLAY_DURATION_MS);
      return;
    }

    setState("importing");
    setProgress(20);

    const normalizedUrl = normalizeLinkedInUrl(linkedInUrl);

    if (importFn) {
      try {
        setProgress(50);
        const { importId } = await importFn(normalizedUrl);
        setProgress(100);
        const displayName = extractLinkedInDisplayName(normalizedUrl);
        setImportedProfile({ url: normalizedUrl, displayName, importId });
        setState("success");
        onImport?.(normalizedUrl, importId);
      } catch (error) {
        if (errorResetTimeoutRef.current !== null) {
          clearTimeout(errorResetTimeoutRef.current);
          errorResetTimeoutRef.current = null;
        }
        setState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to import LinkedIn profile. Please try again."
        );
        setProgress(0);
        errorResetTimeoutRef.current = setTimeout(() => {
          errorResetTimeoutRef.current = null;
          setState("idle");
          setErrorMessage("");
        }, ERROR_DISPLAY_DURATION_MS);
      }
    } else {
      // Fallback: no importFn provided, just validate URL and report success
      const displayName = extractLinkedInDisplayName(normalizedUrl);
      setProgress(100);
      setImportedProfile({ url: normalizedUrl, displayName });
      setState("success");
      onImport?.(normalizedUrl);
    }
  };

  const handleRemove = () => {
    setImportedProfile(null);
    setLinkedInUrl("");
    setState("idle");
    setProgress(0);
    onRemove?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleImport();
    }
  };

  // Success state
  if (state === "success" && importedProfile) {
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
  if (state === "importing") {
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
      onMouseEnter={() => state === "idle" && setState("hover")}
      onMouseLeave={() => state === "hover" && setState("idle")}
      className={className}
    />
  );
};
