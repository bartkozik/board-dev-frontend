import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import styles from './AddUser.module.scss';
import AddUserModal from './addUserModal';

const AddUser = (): React.JSX.Element => {
  const { usersStore } = useStores();
  const { loadingUsers } = usersStore;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className={styles.button}
        text="Add user"
        onClick={() => setIsModalOpen(true)}
        icon={<Icon ariaLabel="Add user" icon={icons.addUser} size={iconSize.medium} />}
        type="button"
        disabled={loadingUsers}
      />
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default observer(AddUser);
