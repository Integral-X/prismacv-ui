import { useState, useCallback } from 'react';

interface UseProgressSimulationOptions {
  intervalMs?: number;
  increment?: number;
  onComplete?: () => void;
}

/**
 * Hook to simulate progress from 0 to 100
 * Useful for upload/import progress indicators
 */
export const useProgressSimulation = (
  options: UseProgressSimulationOptions = {}
) => {
  const { intervalMs = 200, increment = 10, onComplete } = options;
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setProgress(0);
    setIsRunning(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          onComplete?.();
          return 100;
        }
        return prev + increment;
      });
    }, intervalMs);

    // Return cleanup function
    return () => {
      clearInterval(interval);
      setIsRunning(false);
    };
  }, [intervalMs, increment, onComplete]);

  const reset = useCallback(() => {
    setProgress(0);
    setIsRunning(false);
  }, []);

  return {
    progress,
    isRunning,
    start,
    reset,
  };
};
