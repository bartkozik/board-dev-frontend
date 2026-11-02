import clsx from 'clsx';
import UserInitialsAvatar from '../userInitialsAvatar';
import styles from './UserNameWithAvatar.module.scss';

interface UserNameWithAvatarProps {
  userName?: string;
  className?: string;
}

const UserNameWithAvatar = ({ userName, className }: UserNameWithAvatarProps): JSX.Element => {
  return (
    <div className={clsx(styles.root, className)} title={userName}>
      <UserInitialsAvatar stringToInitialize={userName} />
      <span>{userName}</span>
    </div>
  );
};

export default UserNameWithAvatar;
