import { useCallback, useEffect, useRef } from 'react';
export function useRoundTimers() {
  const pending = useRef(new Set<number>());
  const clearTimers = useCallback(() => {
    pending.current.forEach(id => window.clearTimeout(id));
    pending.current.clear();
  }, []);
  useEffect(() => clearTimers, [clearTimers]);
  const schedule = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => { pending.current.delete(id); callback(); }, delay);
    pending.current.add(id);
  }, []);
  return { schedule, clearTimers };
}
