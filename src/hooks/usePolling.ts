import { useEffect, useRef, useCallback } from 'react';

/**
 * Generic polling hook with auto-pause on tab hidden.
 */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, intervalMs);
  }, [intervalMs]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }

    start();

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        savedCallback.current(); // refresh immediately on return
        start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled, start, stop]);
}
