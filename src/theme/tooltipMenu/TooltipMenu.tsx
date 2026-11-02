import clsx from 'clsx';
import styles from './TooltipMenu.module.scss';

interface TooltipMenuProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
}

const TooltipMenu = ({ children, className }: TooltipMenuProps): JSX.Element => {
  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default TooltipMenu;
