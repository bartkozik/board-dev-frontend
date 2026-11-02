import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseFakeScrollReturn {
  fakeScrollWidth: number;
  isFakeScrollVisible: boolean;
}

export const useFakeScroll = (containerRef: RefObject<HTMLElement>, deps: unknown[] = []): UseFakeScrollReturn => {
  const [fakeScrollWidth, setFakeScrollWidth] = useState(0);
  const [isFakeScrollVisible, setIsFakeScrollVisible] = useState(false);

  const measure = useCallback(() => {
    if (!containerRef.current) return;

    const contentScrollWidth = containerRef.current.scrollWidth;

    const containerWidth = containerRef.current.clientWidth;

    if (contentScrollWidth > containerWidth) setFakeScrollWidth(contentScrollWidth);
    else setFakeScrollWidth(0);

    const rect = containerRef.current.getBoundingClientRect();
    const bottom = rect.bottom;

    const hasVerticalOverflow = bottom > window.innerHeight;
    const hasHorizontalOverflow = contentScrollWidth > containerWidth;

    if (hasVerticalOverflow && hasHorizontalOverflow) setIsFakeScrollVisible(true);
    else setIsFakeScrollVisible(false);
  }, [containerRef]);

  useEffect(() => {
    measure();
  }, [measure, ...deps]);

  useEffect(() => {
    const handleWindowChange = (): void => measure();

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [measure]);

  return { fakeScrollWidth, isFakeScrollVisible };
};
