import { useState, useEffect } from "react";

/**
 * useDebounce
 * Returns a debounced value that updates only after a delay.
 *
 * @param value - The input value to debounce
 * @param delay - Delay in milliseconds (default 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after `delay`
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: if value changes before delay, reset the timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
