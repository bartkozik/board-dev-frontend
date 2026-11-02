import { routes } from '@/app/routes';
import Button from '@/theme/button';
import Chip from '@/theme/chip';
import Icon, { icons } from '@/theme/icon';
import IconButton from '@/theme/iconButton';
import { User, UserRole } from '@/users/types';
import styles from './UserToMatch.module.scss';

interface UserToMatchProps {
  user?: User;
  className?: string;
  onRemove?: () => void;
}
const UserToMatch = ({ user, className, onRemove }: UserToMatchProps): JSX.Element => {
  if (!user) return <></>;

  return (
    <div className={(styles.root, className)}>
      <div className={styles.user}>
        <div className={styles.name}>{user.name}</div>
        {onRemove && <IconButton icon={icons.close} onClick={onRemove} className={styles.icon} />}
      </div>
      <div className={styles.row}>
        {user.roles && <Chip label={UserRole[user.roles[0]]} />}
        {user.corporateClientName ? (
          <Chip label={user.corporateClientName} variant="data" />
        ) : (
          <Chip label="Public" variant="regular" />
        )}
        <Button
          text="View profile"
          icon={<Icon icon={icons.external} />}
          variant="text"
          externalHref={routes.ReadyMatchDetails.path(user.id)}
          className={styles.button}
        />
      </div>
    </div>
  );
};

export default UserToMatch;
