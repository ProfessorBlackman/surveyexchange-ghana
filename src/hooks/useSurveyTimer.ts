import { useRef, useCallback } from 'react';

export function useSurveyTimer() {
  const startTimeRef = useRef(Date.now());

  const getElapsedSeconds = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  return { getElapsedSeconds };
}
