import clsx from 'clsx';
import Button from '@/theme/button';
import Card from '@/theme/card';
import Icon, { icons, iconSize } from '@/theme/icon';
import IconButton from '@/theme/iconButton';
import UserNameWithAvatar from '@/theme/userNameWithAvatar';
import { User } from '@/users/types';
import styles from './ComparisonCardHeader.module.scss';

interface ComparisonCardHeaderProps {
  user?: User;
  className?: string;
  isComparedCard?: boolean;
  onMatchUser?: (user: User) => void;
  onRemoveUser?: (user: User) => void;
}

const ComparisonCardHeader = ({
  user,
  className,
  isComparedCard,
  onMatchUser,
  onRemoveUser,
}: ComparisonCardHeaderProps): JSX.Element => {
  if (!user) return <></>;

  return (
    <Card className={clsx(styles.root, className)}>
      <div className={styles.actions}>
        {isComparedCard && (
          <IconButton
            icon={icons.close}
            size={iconSize.medium}
            onClick={() => onRemoveUser && onRemoveUser(user)}
            className={styles.closeButton}
          />
        )}
        <UserNameWithAvatar userName={user?.name} className={styles.avatar} />

        {isComparedCard && (
          <Button
            text="Choose this user and make a match"
            icon={<Icon icon={icons.match} />}
            variant="secondary"
            maxWidth
            onClick={() => onMatchUser && onMatchUser(user)}
          />
        )}
      </div>
    </Card>
  );
};

export default ComparisonCardHeader;
