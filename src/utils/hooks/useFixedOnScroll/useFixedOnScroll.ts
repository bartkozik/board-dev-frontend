import { useState, useEffect, RefObject } from 'react';

export const useFixedOnScroll = (elementRef: RefObject<HTMLElement>): boolean => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      if (elementRef.current) {
        const { top } = elementRef.current.getBoundingClientRect();
        setIsFixed(top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef]);

  return isFixed;
};
