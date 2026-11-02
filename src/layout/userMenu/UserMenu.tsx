import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import DropdownMenu, { DropdownItem } from '@/theme/dropdownMenu';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import { User } from '@/users/types';
import styles from './UserMenu.module.scss';

const UserMenu = (): JSX.Element | null => {
  const { authStore, userStore } = useStores();
  const { loggedInUser, logout } = authStore;
  const { fetchAvatarDetails, loadingAvatar } = userStore;

  const [avatarDetails, setAvatarDetails] = useState<User | undefined>(undefined);

  useEffect(() => {
    const loggedId = loggedInUser?.id;
    if (loggedId) {
      (async () => {
        const details = await fetchAvatarDetails(loggedId);
        setAvatarDetails(details);
      })();
    }
  }, [loggedInUser]);

  const handleLogout = (): void => {
    logout().then(() => window.location.replace(location.origin + routes.Login.path()));
  };

  const menuActions: DropdownItem[] = [{ id: 'logout', label: 'Logout', action: handleLogout }];

  if (!loggedInUser) return null;

  return (
    <div className={styles.root}>
      <DropdownMenu items={menuActions} dropdownClassName={styles.dropdownMenu}>
        <UserInitialsAvatar item={avatarDetails} className={styles.avatar} size="regular" loader={loadingAvatar} />
      </DropdownMenu>
    </div>
  );
};

export default observer(UserMenu);
