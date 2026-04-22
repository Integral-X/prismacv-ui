import { useState, useCallback, useRef, useEffect } from "react";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearIntervalSafe = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const start = useCallback(() => {
    clearIntervalSafe();
    setProgress(0);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          onComplete?.();
          return 100;
        }
        return prev + increment;
      });
    }, intervalMs);
  }, [intervalMs, increment, onComplete, clearIntervalSafe]);

  const reset = useCallback(() => {
    clearIntervalSafe();
    setProgress(0);
  }, [clearIntervalSafe]);

  return {
    progress,
    isRunning,
    start,
    reset,
  };
};
