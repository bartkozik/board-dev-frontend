import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { SortColumn } from '@/domain/sorting';
import Pagination from '@/theme/pagination';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import { useConfirmRemoveModal, useToggleBlockUserModal } from '@/utils/hooks';
import styles from './UsersTable.module.scss';
import UsersTableRow from './usersTableRow/';

const COLUMNS = [SortColumn.User, SortColumn.Company, SortColumn.Type, SortColumn.FormUpdate, SortColumn.DateAdded];

const UsersTable = (): JSX.Element => {
  const { userStore, usersStore } = useStores();
  const { selectedUser, deleteUser, submitting, updateUser } = userStore;
  const {
    loadingUsers,
    activePage,
    sortColumn,
    sortDirection,
    allUsersCount,
    allPagesCount,
    updateSort,
    setActivePage,
    removeUserFromList,
    users,
  } = usersStore;
  const [searchParams, setSearchParams] = useSearchParams();

  const { openModal, confirmRemoveModal, closeModal } = useConfirmRemoveModal({
    onConfirm: () =>
      selectedUser &&
      deleteUser(selectedUser.id).then(() => {
        removeUserFromList(selectedUser.id);
        closeModal();
      }),
    name: selectedUser?.name || 'this user',
    submitting,
  });

  const { openToggleBlockModal, closeToggleBlockModal, confirmToggleBlockModal } = useToggleBlockUserModal({
    onConfirm: () =>
      selectedUser &&
      updateUser({ corporateClientId: selectedUser.corporateClientId, isBlocked: !selectedUser.isBlocked }).then(
        closeToggleBlockModal
      ),
    name: selectedUser?.name || 'this user',
    submitting,
    isBlocked: selectedUser?.isBlocked,
  });

  const handlePageChange = (page: number): void => {
    searchParams.set('pageNumber', page.toString());
    setSearchParams(searchParams);
    setActivePage(page);
  };

  const noUsersFound = users.length === 0 && !loadingUsers;

  return (
    <>
      <TableLayout loadingContent={loadingUsers} className={styles.root}>
        <Table className={styles.table}>
          <Table.Header className={styles.header}>
            {COLUMNS.map((c) => (
              <SortableTableHeadCell
                key={c}
                column={c}
                sortColumn={sortColumn.user}
                sortDirection={sortDirection}
                updateSort={updateSort('user')}
              />
            ))}
            <th data-th="Action" />
          </Table.Header>
          <Table.Spacer className={styles.spacer} />
          <Table.Body>
            {users.map((u) => (
              <UsersTableRow key={u.id} user={u} onUserRemove={openModal} onToggleBlockUser={openToggleBlockModal} />
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
      {confirmToggleBlockModal}
    </>
  );
};

export default observer(UsersTable);
