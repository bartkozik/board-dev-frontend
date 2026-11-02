import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { SortColumn } from '@/domain/sorting';
import Button from '@/theme/button';
import Checkbox from '@/theme/checkbox';
import Icon, { icons } from '@/theme/icon';
import OnSelectedUsersActionsBar from '@/theme/onSelectedUsersActionsBar';
import Pagination from '@/theme/pagination';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import { useExportFormResponsesToXLS } from '@/utils/hooks/useExportFormResponsesToXLS';
import styles from './ReadyMatchTable.module.scss';
import ReadyMatchTableRow from './readyMatchTableRow/ReadyMatchTableRow';

const ReadyMatchTable = (): JSX.Element => {
  const { usersStore } = useStores();
  const {
    loadingUsers,
    activePage,
    sortColumn,
    sortDirection,
    allUsersCount,
    allPagesCount,
    setActivePage,
    updateSort,
    users,
  } = usersStore;
  const { exportFormResponsesToXLS } = useExportFormResponsesToXLS();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUsersIds, setSelectedUsersIds] = useState<string[]>([]);

  const handlePageChange = (page: number): void => {
    searchParams.set('pageNumber', page.toString());
    setSearchParams(searchParams);
    setActivePage(page);
  };

  const handleExportClick = (): void => {
    const usersToExport = users.filter((user) => selectedUsersIds.includes(user.id));

    if (usersToExport) exportFormResponsesToXLS(usersToExport);
  };

  const handleSelectUser = (id: string): void => {
    const updatedSelectedUsersIds = selectedUsersIds.includes(id)
      ? selectedUsersIds.filter((i) => i !== id)
      : [...selectedUsersIds, id];

    setSelectedUsersIds(updatedSelectedUsersIds);
  };

  const onSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedUsersIds(event.target.checked ? users.map((user) => user.id) : []);
  };

  const noUsersFound = users.length === 0;

  return (
    <>
      <TableLayout loadingContent={loadingUsers}>
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
            <SortableTableHeadCell
              column={SortColumn.User}
              sortColumn={sortColumn.readyToMatch}
              sortDirection={sortDirection}
              updateSort={updateSort('readyToMatch')}
            />
            <SortableTableHeadCell
              column={SortColumn.Company}
              sortColumn={sortColumn.readyToMatch}
              sortDirection={sortDirection}
              updateSort={updateSort('readyToMatch')}
            />
            <SortableTableHeadCell
              column={SortColumn.Type}
              sortColumn={sortColumn.readyToMatch}
              sortDirection={sortDirection}
              updateSort={updateSort('readyToMatch')}
            />
            <th data-th={SortColumn.Interests}>{SortColumn.Interests}</th>
            <SortableTableHeadCell
              column={SortColumn.FormUpdate}
              sortColumn={sortColumn.readyToMatch}
              sortDirection={sortDirection}
              updateSort={updateSort('readyToMatch')}
            />
            <SortableTableHeadCell
              column={SortColumn.WaitingForMatch}
              sortColumn={sortColumn.readyToMatch}
              sortDirection={sortDirection}
              updateSort={updateSort('readyToMatch')}
            />
          </Table.Header>
          <Table.Spacer className={styles.spacer} />
          <Table.Body>
            {users.map((user) => {
              const isSelected = selectedUsersIds.includes(user.id);
              return (
                <ReadyMatchTableRow key={user.id} user={user} onSelectUser={handleSelectUser} selected={isSelected} />
              );
            })}
            <Table.NoItems noItemsFound={noUsersFound} text="No users found" />
          </Table.Body>
        </Table>
        <Pagination
          pages={allPagesCount}
          activePage={activePage}
          onChangeActivePage={handlePageChange}
          allItemsCount={allUsersCount}
        />
      </TableLayout>

      <OnSelectedUsersActionsBar selectedCount={selectedUsersIds.length} onDeselect={() => setSelectedUsersIds([])}>
        <Button icon={<Icon icon={icons.table} />} text="Export xls" variant="secondary" onClick={handleExportClick} />
      </OnSelectedUsersActionsBar>
    </>
  );
};

export default observer(ReadyMatchTable);
