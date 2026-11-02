import { useEffect, RefObject } from 'react';

export const useConnectedElementsScroll = (
  elementRefs: RefObject<HTMLElement>[],
  isContentLoading: boolean,
  deps: unknown[] = []
): void => {
  useEffect(() => {
    if (isContentLoading) return;

    const validElements = elementRefs.map((ref) => ref.current).filter(Boolean) as HTMLElement[];

    if (!validElements.length) return;

    const onScroll = (e: Event): void => {
      const source = e.currentTarget as HTMLElement;
      const { scrollLeft } = source;
      validElements.forEach((el) => {
        if (el !== source) {
          el.scrollLeft = scrollLeft;
        }
      });
    };

    validElements.forEach((el) => {
      el.addEventListener('scroll', onScroll);
    });

    return () => {
      validElements.forEach((el) => {
        el.removeEventListener('scroll', onScroll);
      });
    };
  }, [elementRefs, isContentLoading, ...deps]);
};
