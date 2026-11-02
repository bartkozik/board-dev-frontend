import { FunctionComponent, MouseEvent, SVGProps } from 'react';
import clsx from 'clsx';
import Icon, { iconSize } from '@/theme/icon';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  ariaLabel?: string;
  className?: string;
  onClick: ((event: MouseEvent<HTMLElement>) => void) | (() => void);
  title?: string;
  size?: (typeof iconSize)[keyof typeof iconSize];
  variant?: 'regular' | 'rounded';
  disabled?: boolean;
}

const IconButton = ({
  icon,
  ariaLabel,
  className,
  onClick,
  size,
  title,
  variant = 'regular',
  disabled,
}: IconButtonProps): JSX.Element => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={clsx(styles.root, styles[variant], className)}
    title={title}
    disabled={disabled}
  >
    <Icon icon={icon} size={size} />
  </button>
);

export default IconButton;
