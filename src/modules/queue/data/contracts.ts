export interface QueueJobAcceptedContract {
  jobId: string;
  statusUrl: string;
}

export interface QueueJobStatusContract {
  id: string;
  state:
    | 'waiting'
    | 'active'
    | 'completed'
    | 'failed'
    | 'delayed'
    | 'paused'
    | 'waiting-children'
    | 'unknown';
  type: 'pdf_export' | 'ai_analyze' | 'ai_optimize' | string;
  result?: unknown;
  error?: string | null;
  processedOn: string | null;
  finishedOn: string | null;
}

export interface QueuePdfExportRequestContract {
  cvId: string;
}

export interface QueueAiAnalyzeRequestContract {
  cvId: string;
}

export interface QueueAiOptimizeRequestContract {
  cvId: string;
  jobDescription: string;
}
