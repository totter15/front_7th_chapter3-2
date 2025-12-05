import { useEffect } from "react";

export const useLocalStorage = <T>(key: string, value: T, options?: { removeIfEmpty?: boolean }) => {
  useEffect(() => {
    if (options?.removeIfEmpty && Array.isArray(value) && value.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, options?.removeIfEmpty]);
};
