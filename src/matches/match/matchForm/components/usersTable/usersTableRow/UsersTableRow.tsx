import clsx from 'clsx';
import { SortColumn } from '@/domain/sorting';
import { MatchUserKey } from '@/matches/types';
import Button from '@/theme/button';
import Checkbox from '@/theme/checkbox';
import Chip from '@/theme/chip';
import Icon, { icons } from '@/theme/icon';
import Table from '@/theme/table';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import { User } from '@/users/types';
import { getKeyBaseOnUserRole } from '@/utils/helpers/getKeyBaseOnUserRole';
import { USER_ROLE_FIELD_MAPPINGS } from '../columnsConfig';
import styles from './UsersTableRow.module.scss';

interface UsersTableRowProps {
  user: User;
  selected: boolean;
  onMatchUser: (key: MatchUserKey, user: User) => void;
  onSelectUser: (id: string) => void;
}

const UsersTableRow = ({ user, selected, onSelectUser, onMatchUser }: UsersTableRowProps): JSX.Element => {
  const userRole = user.roles[0];
  return (
    <Table.Row key={user.id} className={clsx(styles.root, { [styles.selected]: selected })}>
      <Table.Cell label="">
        <Checkbox checked={selected} name={user.name} onChange={() => onSelectUser(user.id)} />
      </Table.Cell>
      {USER_ROLE_FIELD_MAPPINGS[userRole].map((column) => {
        switch (column.label) {
          case SortColumn.NonProfit:
          case SortColumn.TechLeader:
            return (
              <Table.Cell label={column.label} key={column.label + user.id}>
                <div className={styles.userDetails}>
                  <UserInitialsAvatar item={user} />
                  <div className={styles.username} title={user.name}>
                    {user.name}
                  </div>
                </div>
              </Table.Cell>
            );
          case SortColumn.Company:
            return (
              <Table.Cell label={column.label} key={column.label + user.id}>
                <Chip
                  label={user.corporateClientName || 'Public'}
                  variant={user.corporateClientName ? 'data' : 'regular'}
                />
              </Table.Cell>
            );
          case SortColumn.Location:
          case SortColumn.Meetings:
          case SortColumn.DirectDonation:
          case SortColumn.Experience:
            return (
              <Table.Cell label={column.label} key={column.label + user.id}>
                <div className={styles.defaultCell}>{column.getValue ? column.getValue(user) : ''}</div>
              </Table.Cell>
            );
          case '':
            return (
              <Table.Cell label="Action" key={column.label + user.id}>
                <div className={styles.action}>
                  <Button
                    icon={<Icon icon={icons.match} />}
                    variant="text"
                    text="Make a match"
                    onClick={() => onMatchUser(getKeyBaseOnUserRole(user.roles[0]), user)}
                    className={styles.matchButton}
                  />
                </div>
              </Table.Cell>
            );
          default:
            return null;
        }
      })}
    </Table.Row>
  );
};

export default UsersTableRow;
