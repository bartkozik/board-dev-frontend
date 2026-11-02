import clsx from 'clsx';
import styles from './AlignmentBar.module.scss';

interface AlignmentBarProps {
  title?: string;
  className?: string;
}

const AlignmentBar = ({ title, className }: AlignmentBarProps): JSX.Element => {
  return <div className={clsx(styles.root, className)}>{title}</div>;
};

export default AlignmentBar;
