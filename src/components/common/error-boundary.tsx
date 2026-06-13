'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw, TriangleAlert } from 'lucide-react';
import { captureUiException } from '@/shared/monitoring/sentry';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Identifies the failing widget in telemetry (e.g. 'editor-ai-analyze'). */
  boundary: string;
  /** Replaces the default compact fallback shown in place of the widget. */
  fallback?: ReactNode;
  /** Short label used by the default fallback (e.g. 'analysis panel'). */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Contains a render/runtime failure to a single widget so a crash in one part
 * of a screen (an AI panel, the document canvas) degrades locally instead of
 * blanking the whole route. Reports through the shared Sentry helper, tagged by
 * `boundary`, and offers an in-place retry.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureUiException(error, {
      tags: { boundary: this.props.boundary },
      extra: { componentStack: info.componentStack ?? undefined },
    });
  }

  private readonly handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div
        role='alert'
        className='flex flex-col items-center gap-2 rounded-lg border border-subtle bg-surface-card p-4 text-center'
      >
        <TriangleAlert className='size-5 text-feedback-error' />
        <p className='text-sm text-content-secondary'>
          The {this.props.label ?? 'section'} couldn&apos;t load.
        </p>
        <button
          type='button'
          onClick={this.handleRetry}
          className='flex items-center gap-1.5 text-sm font-medium text-interactive-link hover:underline'
        >
          <RotateCw className='size-3.5' />
          Try again
        </button>
      </div>
    );
  }
}
