import clsx from 'clsx';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  className?: string;
  title: string;
  titleSize?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  isLongTitleBraked?: boolean;
}

const PageHeader = ({
  className = '',
  title,
  titleSize = 'medium',
  isLongTitleBraked,
  children,
}: PageHeaderProps): JSX.Element => {
  return (
    <div className={clsx(styles.root, className)}>
      <h1 className={clsx(styles.title, styles[titleSize], { [styles.longTitleBreaked]: isLongTitleBraked })}>
        {title}
      </h1>
      {children}
    </div>
  );
};

export default PageHeader;
