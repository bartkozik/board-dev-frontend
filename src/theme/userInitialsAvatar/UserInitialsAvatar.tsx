import { Tooltip } from '@mantine/core';
import clsx from 'clsx';
import { AuthUser } from '@/auth/types';
import { RawMatch } from '@/matches/types';
import Icon, { icons, iconSize } from '@/theme/icon';
import { RawUser, User } from '@/users/types';
import Loader from '../loader';
import styles from './UserInitialsAvatar.module.scss';

const INITIALS_LENGTH = 2;

const convertToInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, INITIALS_LENGTH)
    .map((word: string) => word[0])
    .join('');
};

interface UserInitialsAvatarProps<T extends User | RawUser | AuthUser | RawMatch> {
  className?: string;
  item?: T;
  stringToInitialize?: string;
  size?: 'regular' | 'large';
  loader?: boolean;
  withTooltip?: boolean;
}

const UserInitialsAvatar = <T extends User | RawUser | AuthUser | RawMatch>({
  className,
  item,
  stringToInitialize,
  size = 'regular',
  loader = false,
  withTooltip = false,
}: UserInitialsAvatarProps<T>): JSX.Element => {
  const displayInitials = (): string | JSX.Element | null => {
    const fieldsToCheck = ['name', 'techLeaderUserName', 'npoUserName'];

    if (!item) return null;

    for (const field of fieldsToCheck)
      if (field in item && typeof item[field] === 'string') return convertToInitials(item[field]);

    if ('email' in item && typeof item.email === 'string') return item.email.slice(0, INITIALS_LENGTH).toUpperCase();

    return <Icon icon={icons.dots} size={iconSize.medium} />;
  };

  const initials = stringToInitialize ? convertToInitials(stringToInitialize) : displayInitials();

  const isTooltipActive = withTooltip && Boolean(stringToInitialize);

  return (
    <Tooltip
      events={{ hover: isTooltipActive, focus: isTooltipActive, touch: false }}
      arrowPosition="side"
      classNames={{ tooltip: styles.tooltip }}
      label={stringToInitialize}
      withArrow
      position="top-end"
      offset={{ mainAxis: 10, crossAxis: -75 }}
      arrowOffset={50}
      arrowSize={5}
      multiline
      w={155}
    >
      <div className={clsx(styles.root, styles[size], className)}>
        {!loader ? initials : <Loader loading small white />}
      </div>
    </Tooltip>
  );
};

export default UserInitialsAvatar;
