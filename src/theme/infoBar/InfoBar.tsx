import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './InfoBar.module.scss';

export interface InfoBarProps {
  message: ReactNode;
  variant?: 'warning' | 'info';
}

const InfoBar = ({ message, variant = 'info' }: InfoBarProps): JSX.Element => {
  return <div className={clsx(styles.root, styles[variant])}>{message}</div>;
};

export default InfoBar;
