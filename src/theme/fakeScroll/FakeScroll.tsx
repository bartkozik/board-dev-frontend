import { RefObject } from 'react';
import clsx from 'clsx';
import styles from './FakeScroll.module.scss';

interface FakeScrollProps {
  scrollbarRef: RefObject<HTMLDivElement>;
  isFakeScrollVisible: boolean;
  fakeScrollWidth: number;
  className?: string;
}

export const FakeScroll = ({
  scrollbarRef,
  isFakeScrollVisible,
  fakeScrollWidth,
  className,
}: FakeScrollProps): JSX.Element => {
  return (
    <div
      className={clsx(styles.root, className)}
      ref={scrollbarRef}
      style={{
        visibility: isFakeScrollVisible ? 'visible' : 'hidden',
        pointerEvents: isFakeScrollVisible ? 'auto' : 'none',
      }}
    >
      <div style={{ width: `${fakeScrollWidth}px` }} />
    </div>
  );
};

export default FakeScroll;
