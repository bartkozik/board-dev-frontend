import clsx from 'clsx';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  tooltipText: string;
  iconClassName?: string;
}

const Tooltip = ({ tooltipText = '', iconClassName }: TooltipProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className={clsx(styles.icon, iconClassName)}>i</div>
      <p className={styles.tooltip}>{tooltipText}</p>
    </div>
  );
};

export default Tooltip;
