import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import Chip from '@/theme/chip';
import DetailsTable, { Detail } from '@/theme/detailsTable';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import { RawUserRole } from '@/users/types';
import styles from './UserDetails.module.scss';

const UserDetails = (): JSX.Element | null => {
  const { userStore } = useStores();
  const { selectedUser, loadingUser } = userStore;

  if (!selectedUser) return null;

  const { name, email, type, formattedCreatedAt, roles, corporateClientName, isBlocked, primaryContactFullName } =
    selectedUser;
  const isNotAdmin = !roles.includes(RawUserRole.Admin);

  const detailsMap: Detail[] = [
    { label: 'Name', value: name },
    primaryContactFullName && { label: '', value: primaryContactFullName },
    { label: 'Email', value: email },
    { label: 'Type', value: <Chip label={type || '---'} /> },
    isNotAdmin && {
      label: 'Company',
      value: <Chip variant={corporateClientName ? 'data' : 'regular'} label={corporateClientName || 'Public'} />,
    },
    { label: 'Date created', value: formattedCreatedAt },
    isBlocked && { label: 'Current access status', value: <Chip variant="warning" label="Blocked" /> },
  ].filter(Boolean) as Detail[];

  return (
    <div className={styles.root}>
      <DetailsTable details={detailsMap} loading={loadingUser} className={styles.detailsTable} />
      <UserInitialsAvatar item={selectedUser} size="large" className={styles.avatar} />
    </div>
  );
};

export default observer(UserDetails);
