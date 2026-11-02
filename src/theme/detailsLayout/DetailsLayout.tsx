import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './DetailsLayout.module.scss';

interface DetailsLayoutProps {
  children: ReactNode | ReactNode[];
  loading?: boolean;
  className?: string;
}

const DetailsLayout = ({ children, loading = false, className }: DetailsLayoutProps): React.JSX.Element => {
  return <div className={clsx(styles.root, className, { [styles.withBackground]: !loading })}>{children}</div>;
};

export default DetailsLayout;
