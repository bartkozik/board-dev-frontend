import { useIntersection } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { SortByFormAnswer, SortByParams } from '@/domain/sorting';
import { FilterState } from '@/domain/types';
import { MatchUserKey } from '@/matches/types';
import Button from '@/theme/button';
import Checkbox from '@/theme/checkbox';
import Icon, { icons } from '@/theme/icon';
import Loader from '@/theme/loader';
import OnSelectedUsersActionsBar from '@/theme/onSelectedUsersActionsBar';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import { NonAdminUserRole, User } from '@/users/types';
import { useExportComparisonToXLS, useRoleBasedTableParams, useUsersReadyToMatch } from '@/utils/hooks';
import styles from './UsersTable.module.scss';
import { USER_ROLE_FIELD_MAPPINGS } from './columnsConfig';
import UsersTableColumns from './usersTableColumns';
import UsersTableRow from './usersTableRow';

interface UsersTableProps {
  role: NonAdminUserRole;
  selectedFilters?: FilterState;
  onMatchUser: (key: MatchUserKey, user: User) => void;
  filtersAreInitialized: boolean;
}

const UsersTable = ({ role, selectedFilters, filtersAreInitialized, onMatchUser }: UsersTableProps): JSX.Element => {
  const { matchStore } = useStores();
  const { matchedUsers } = matchStore;
  const { phrase, sortBy, sortByFormAnswer, sortColumnName, sortDirection, techLeaderUserId, npoUserId, updateSort } =
    useRoleBasedTableParams(SortByParams.userNameAsc, role);
  const { usersReadyToMatch, fetchNextPage, loadingUsers, hasMoreUsers } = useUsersReadyToMatch({
    phrase,
    role,
    sortBy: sortBy as SortByParams,
    sortByFormAnswer: sortByFormAnswer as SortByFormAnswer,
    selectedFilters,
  });
  const { exportComparisonToXLS } = useExportComparisonToXLS();
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);
  const columnsLabels: string[] = USER_ROLE_FIELD_MAPPINGS[role].map((field) => field.label);
  const baseMatchUserId = techLeaderUserId || npoUserId;

  const navigate = useNavigate();

  const noUsersFound = usersReadyToMatch.length === 0 && !loadingUsers;

  const { ref, entry } = useIntersection({
    rootMargin: '650px',
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasMoreUsers) {
      fetchNextPage();
    }
  }, [entry, hasMoreUsers]);

  const handleExportClick = (): void => {
    const baseUser = matchedUsers.find((user) => user.id === baseMatchUserId);
    const comparedUsers = usersReadyToMatch.filter((user) => selectedUsersIds.includes(user.id));

    if (baseUser) exportComparisonToXLS({ baseUser, comparedUsers });
  };

  const handleSelectUser = (id: string): void => {
    const updatedSelectedUsersIds = selectedUsersIds.includes(id)
      ? selectedUsersIds.filter((i) => i !== id)
      : [...selectedUsersIds, id];

    setSelectedUsersIds(updatedSelectedUsersIds);
  };

  const onSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedUsersIds(event.target.checked ? usersReadyToMatch.map((user) => user.id) : []);
  };

  const handleCompareUsers = (): void => {
    if (baseMatchUserId) navigate(routes.CompareUsersFromNewMatch.path(baseMatchUserId, selectedUsersIds.join(',')));
  };

  return (
    <>
      <TableLayout
        loadingContent={(loadingUsers && usersReadyToMatch.length === 0) || !filtersAreInitialized}
        className={styles.root}
      >
        <Table className={styles.table}>
          <Table.Header className={styles.header}>
            <th className={styles.selectAll}>
              <Checkbox
                checked={selectedUsersIds.length > 0}
                onChange={onSelectAll}
                name="selectAll"
                variant="neutral"
              />
            </th>
            <UsersTableColumns
              role={role}
              sortColumn={sortColumnName}
              sortDirection={sortDirection}
              updateSort={updateSort}
            />
          </Table.Header>
          <Table.Spacer className={styles.spacer} />
          <Table.Body>
            {usersReadyToMatch.map((user) => {
              const isSelected = selectedUsersIds.includes(user.id);
              return (
                <UsersTableRow
                  key={user.id}
                  user={user}
                  onMatchUser={onMatchUser}
                  onSelectUser={handleSelectUser}
                  selected={isSelected}
                />
              );
            })}
            <Table.NoItems noItemsFound={noUsersFound} text="No users found" />
            <Table.Row>
              <td colSpan={columnsLabels.length + 1}>
                {hasMoreUsers && (
                  <div ref={ref} className={styles.loader}>
                    <Loader loading={loadingUsers} small />
                  </div>
                )}
              </td>
            </Table.Row>
          </Table.Body>
        </Table>
      </TableLayout>

      <OnSelectedUsersActionsBar selectedCount={selectedUsersIds.length} onDeselect={() => setSelectedUsersIds([])}>
        <Button icon={<Icon icon={icons.table} />} text="Export xls" variant="secondary" onClick={handleExportClick} />
        <Button text="Compare users" onClick={handleCompareUsers} />
      </OnSelectedUsersActionsBar>
    </>
  );
};

export default observer(UsersTable);
