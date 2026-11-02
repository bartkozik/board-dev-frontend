import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { SortColumn } from '@/domain/sorting';
import Pagination from '@/theme/pagination';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import { useConfirmRemoveModal } from '@/utils/hooks';
import styles from './CorporateClientUsersTable.module.scss';
import CorporateClientUsersTableRow from './corporateClientUsersTableRow';

const CorporateClientUsersTable = (): JSX.Element => {
  const { userStore, usersStore } = useStores();
  const { selectedUser, deleteUser, submitting } = userStore;
  const {
    sortBy,
    loadingUsers,
    activePage,
    sortColumn,
    sortDirection,
    allUsersCount,
    allPagesCount,
    fetchUsers,
    updateSort,
    setActivePage,
    removeUserFromList,
    users,
  } = usersStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const sortByFromUrl = searchParams.get('sortBy');
  const { userId: corporateClientId } = useParams();
  const { openModal, confirmRemoveModal, closeModal } = useConfirmRemoveModal({
    onConfirm: () =>
      deleteUser(selectedUser?.id || '').then(() => {
        removeUserFromList(selectedUser?.id || '');
        closeModal();
      }),
    name: selectedUser?.name || 'this user',
    submitting,
  });

  const handlePageChange = (page: number): void => {
    setActivePage(page);
    searchParams.set('pageNumber', page.toString());
    setSearchParams(searchParams);
  };

  const noUsersFound = !loadingUsers && users.length === 0;

  useEffect(() => {
    if (sortByFromUrl === sortBy) return;
    searchParams.set('sortBy', sortBy.toString());
    setSearchParams(searchParams);
  }, [sortBy]);

  useEffect(() => {
    fetchUsers({ corporateClientId });
  }, [sortBy, activePage, corporateClientId]);

  return (
    <>
      <TableLayout loadingContent={loadingUsers}>
        <Table className={styles.table}>
          <Table.Header className={styles.header}>
            <SortableTableHeadCell
              column={SortColumn.User}
              sortColumn={sortColumn.user}
              sortDirection={sortDirection}
              updateSort={updateSort('user')}
            />
            <th data-th={SortColumn.Status}>{SortColumn.Status}</th>
            <SortableTableHeadCell
              column={SortColumn.Type}
              sortColumn={sortColumn.user}
              sortDirection={sortDirection}
              updateSort={updateSort('user')}
            />
            <SortableTableHeadCell
              column={SortColumn.DateAdded}
              sortColumn={sortColumn.user}
              sortDirection={sortDirection}
              updateSort={updateSort('user')}
            />
            <th data-th="Action" />
          </Table.Header>
          <Table.Spacer className={styles.spacer} />
          <Table.Body>
            {users.map((u) => (
              <CorporateClientUsersTableRow key={u.id} user={u} onUserRemove={openModal} />
            ))}
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
      {confirmRemoveModal}
    </>
  );
};

export default observer(CorporateClientUsersTable);
