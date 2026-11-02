import Chip from '@/theme/chip';
import styles from './UserStatus.module.scss';

const UserStatus = ({ status }: { status: string }): JSX.Element => (
  <div className={styles.root}>
    <span>Your status:</span>
    <Chip label={status} className={styles.statusChip} />
  </div>
);

export default UserStatus;
