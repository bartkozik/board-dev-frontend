import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import Icon, { icons, iconSize } from '../icon';
import styles from './Chip.module.scss';

export type ChipVariant = 'info' | 'status' | 'data' | 'warning' | 'important' | 'regular' | 'filter';

interface ChipProps extends PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  isSelected?: boolean;
  variant?: ChipVariant;
  label?: string;
  type?: 'outlined';
  className?: string;
  withCloseIcon?: boolean;
}

const Chip = ({
  variant = 'info',
  type,
  children,
  label,
  className,
  clickable = false,
  isSelected = false,
  withCloseIcon = false,
  onClick,
}: ChipProps): React.JSX.Element => {
  const classNames = clsx(styles.root, styles[variant], type && styles[type], className, {
    [styles.isSelected]: isSelected,
  });

  return (
    <div
      className={clsx(classNames, { [styles.withCursorPointer]: clickable, [styles.smallPadding]: withCloseIcon })}
      onClick={clickable ? onClick : undefined}
    >
      {isSelected && <Icon icon={icons.tick} size={iconSize.medium} className={styles.icon} />}
      <label className={styles.label} title={label}>
        {label}
      </label>

      {withCloseIcon && clickable && <Icon icon={icons.close} size={iconSize.small} className={styles.icon} />}
      {children}
    </div>
  );
};

export default Chip;
