import { useEffect, useRef } from "react";

/**
 * Custom hook to detect clicks outside of a component
 * @param callback - Function to call when clicked outside
 */
export const useClickAway = <T extends HTMLElement = HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);

  return ref;
};
