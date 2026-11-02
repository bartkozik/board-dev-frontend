import styles from './SummaryWrapper.module.scss';

interface SummaryWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const SummaryWrapper = ({ children, title }: SummaryWrapperProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{title || 'Summary'}</h2>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default SummaryWrapper;
