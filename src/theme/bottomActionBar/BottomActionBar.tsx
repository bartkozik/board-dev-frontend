import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BottomActionBar.module.scss';

interface BottomActionBarProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
}

const BottomActionBar = ({ children, isVisible, className }: BottomActionBarProps): JSX.Element | null => {
  if (!isVisible) return null;

  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default BottomActionBar;
