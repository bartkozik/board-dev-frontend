import NumberAvatar from '@/theme/numberAvatar';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import UserNameWithAvatar from '@/theme/userNameWithAvatar';
import { RawUser } from '@/users/types';
import styles from './ComparedAvatarsGroup.module.scss';

const VISIBLE_USERS_LIMIT = 3;

interface ComparedAvatarsGroupProps {
  comparedUsers: RawUser[];
}

const ComparedAvatarsGroup = ({ comparedUsers }: ComparedAvatarsGroupProps): JSX.Element => {
  const visibleUsers = comparedUsers.slice(0, VISIBLE_USERS_LIMIT);
  const hiddenUserNames = comparedUsers.slice(VISIBLE_USERS_LIMIT).map((user) => user.name);

  const isOnlyOneUser = visibleUsers.length === 1;

  const multipleUsersDisplay = visibleUsers.map((user) => (
    <UserInitialsAvatar key={`user-${user.id}`} item={user} withTooltip stringToInitialize={user.name} />
  ));

  const displayedAvatars = isOnlyOneUser ? (
    <UserNameWithAvatar userName={visibleUsers[0].name} />
  ) : (
    multipleUsersDisplay
  );

  return (
    <div className={styles.root}>
      {displayedAvatars}
      {comparedUsers.length > VISIBLE_USERS_LIMIT && <NumberAvatar itemsList={hiddenUserNames} />}
    </div>
  );
};

export default ComparedAvatarsGroup;
