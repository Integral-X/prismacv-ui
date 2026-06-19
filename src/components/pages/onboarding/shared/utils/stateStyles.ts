/**
 * State-based styling utilities
 */

export type UploadState =
  | "idle"
  | "hover"
  | "dragover"
  | "uploading"
  | "success"
  | "error";

export type ImportState = "idle" | "hover" | "importing" | "success" | "error";

/**
 * Gets border color class based on upload state
 */
export const getUploadBorderColor = (state: UploadState): string => {
  switch (state) {
    case "dragover":
      return "border-primary";
    case "error":
      return "border-feedback-error";
    case "success":
      return "border-feedback-success";
    default:
      return "border-dashed border-border-strong";
  }
};

/**
 * Gets background color class based on upload state
 */
export const getUploadBackgroundColor = (state: UploadState): string => {
  switch (state) {
    case "dragover":
      return "bg-primary/5";
    case "error":
      return "bg-feedback-error/10";
    case "success":
      return "bg-feedback-success/10";
    default:
      return "bg-surface-card";
  }
};

/**
 * Gets border color class based on import state
 */
export const getImportBorderColor = (state: ImportState): string => {
  switch (state) {
    case "hover":
      return "border-primary/50";
    case "error":
      return "border-feedback-error";
    case "success":
      return "border-feedback-success";
    default:
      return "border-dashed border-border-strong";
  }
};

/**
 * Gets background color class based on import state
 */
export const getImportBackgroundColor = (state: ImportState): string => {
  switch (state) {
    case "hover":
      return "bg-primary/5";
    case "error":
      return "bg-feedback-error/10";
    case "success":
      return "bg-feedback-success/10";
    default:
      return "bg-surface-card";
  }
};
