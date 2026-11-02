import React, { forwardRef } from 'react';
import clsx from 'clsx';
import Loader from '@/theme/loader';
import styles from './LoadingArea.module.scss';

interface LoadingAreaProps {
  className?: string;
  children: React.ReactNode;
  loading: boolean;
  text?: string;
}

const LoadingArea = forwardRef<HTMLDivElement, LoadingAreaProps>(
  ({ className = '', children, loading, text }: LoadingAreaProps, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, className)}>
        <Loader loading={loading} className={styles.loader} />
        {loading && text && <div className={styles.text}>{text}</div>}
        {!loading && children}
      </div>
    );
  }
);

LoadingArea.displayName = 'LoadingArea';

export default LoadingArea;
