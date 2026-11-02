import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { routes } from '@/app/routes';
import { SortColumn } from '@/domain/sorting';
import Checkbox from '@/theme/checkbox';
import Chip from '@/theme/chip';
import Table from '@/theme/table';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import { DEFAULT_USER_TAB } from '@/users/constants';
import { User } from '@/users/types';
import { getUserName } from '@/users/utils';
import { PublicChip } from '../../components';
import UserMatchGap from '../userMatchGap';
import styles from './ReadyMatchTableRow.module.scss';

interface InterestsChipsProps {
  interests?: string[];
}

const InterestsChips = ({ interests = [] }: InterestsChipsProps): JSX.Element => {
  const multipleInterests =
    interests.length !== 0 && interests.sort().map((interest) => <Chip key={interest} label={interest} />);

  return <div className={styles.interests}>{multipleInterests}</div>;
};

interface ReadyMatchTableRowProps {
  user: User;
  selected: boolean;
  onSelectUser: (id: string) => void;
}

const ReadyMatchTableRow = ({ user, selected, onSelectUser }: ReadyMatchTableRowProps): JSX.Element => {
  const navigate = useNavigate();

  const handleDetailsClick = (userId: string): void => {
    navigate(routes.ReadyMatchDetails.path(userId, DEFAULT_USER_TAB));
  };

  const userName = getUserName(user);

  return (
    <Table.Row
      key={user.id}
      onClick={() => handleDetailsClick(user.id)}
      className={clsx(styles.root, { [styles.selected]: selected })}
    >
      <Table.Cell label="Select">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} name={user.name} onChange={() => onSelectUser(user.id)} />
        </div>
      </Table.Cell>
      <Table.Cell label={SortColumn.User}>
        <div className={styles.userDetails}>
          <UserInitialsAvatar stringToInitialize={user.name} />
          <span className={styles.username} title={user.name}>
            {userName}
          </span>
          {user.isNewUser && <Chip label="New!" variant="status" />}
        </div>
      </Table.Cell>
      <Table.Cell label={SortColumn.Company}>
        {user.corporateClientName ? (
          <Chip label={user.corporateClientName} variant="data" className={styles.companyChip} />
        ) : (
          <PublicChip role={user.roles[0]} />
        )}
      </Table.Cell>
      <Table.Cell label={SortColumn.Type}>
        <Chip label={user.type} />
      </Table.Cell>
      <Table.Cell label={SortColumn.Interests}>
        <InterestsChips interests={user.interests} />
      </Table.Cell>
      <Table.Cell label={SortColumn.FormUpdate}>
        {user.lastFormUpdateAt && <Chip label={user.formattedLastFormUpdateAt} variant="important" />}
      </Table.Cell>
      <Table.Cell label={SortColumn.WaitingForMatch}>
        <UserMatchGap matchGap={user.matchWaitingTime} />
      </Table.Cell>
    </Table.Row>
  );
};

export default observer(ReadyMatchTableRow);
