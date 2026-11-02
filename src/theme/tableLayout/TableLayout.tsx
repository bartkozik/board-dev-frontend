import clsx from 'clsx';
import DetailsLayout from '../detailsLayout';
import LoadingArea from '../loadingArea';
import styles from './TableLayout.module.scss';

interface TableLayoutProps {
  loadingContent: boolean;
  children: React.ReactNode;
  className?: string;
  loadingAreaClassName?: string;
}

const TableLayout = ({
  className,
  loadingAreaClassName,
  loadingContent = false,
  children,
}: TableLayoutProps): JSX.Element => {
  return (
    <DetailsLayout loading={loadingContent} className={clsx(styles.root, className)}>
      <LoadingArea className={clsx(styles.loader, loadingAreaClassName)} loading={loadingContent}>
        {children}
      </LoadingArea>
    </DetailsLayout>
  );
};

export default TableLayout;
