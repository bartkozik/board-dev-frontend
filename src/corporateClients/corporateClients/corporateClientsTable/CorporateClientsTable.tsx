import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { SortColumn } from '@/domain/sorting';
import Pagination from '@/theme/pagination';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import { useConfirmRemoveModal } from '@/utils/hooks';
import styles from './CorporateClientsTable.module.scss';
import CorporateClientsTableRow from './corporateClientsTableRow';

const COLUMNS = [SortColumn.CompanyName, SortColumn.Members, SortColumn.DateAdded];

const CorporateClientsTable = (): JSX.Element => {
  const { corporateClientsStore, corporateClientStore } = useStores();
  const { corporateClient, deleteCorporateClient, submitting } = corporateClientStore;
  const {
    activePage,
    allPagesCount,
    allUsersCount,
    corporateClients,
    loading,
    sortColumn,
    sortDirection,
    setActivePage,
    updateSort,
    removeCorporateClientFromList,
  } = corporateClientsStore;
  const [searchParams, setSearchParams] = useSearchParams();

  const { openModal, confirmRemoveModal, closeModal } = useConfirmRemoveModal({
    onConfirm: () =>
      corporateClient &&
      deleteCorporateClient(corporateClient.id).then(() => {
        removeCorporateClientFromList(corporateClient.id);
        closeModal();
      }),
    name: corporateClient?.name || 'this company',
    submitting,
  });

  const handlePageChange = (page: number): void => {
    searchParams.set('pageNumber', page.toString());
    setSearchParams(searchParams);
    setActivePage(page);
  };

  const noCorporateClients = corporateClients.length === 0;

  return (
    <>
      <TableLayout loadingContent={loading}>
        <Table className={styles.table}>
          <Table.Header>
            {COLUMNS.map((c) => (
              <SortableTableHeadCell
                key={c}
                column={c}
                sortColumn={sortColumn.corporateClient}
                sortDirection={sortDirection}
                updateSort={updateSort('corporateClient')}
              />
            ))}
            <th data-th="Action" />
          </Table.Header>
          <Table.Spacer />
          <Table.Body>
            {corporateClients.map((corporateClient) => (
              <CorporateClientsTableRow
                key={corporateClient.id}
                corporateClient={corporateClient}
                onUserRemove={openModal}
              />
            ))}
            <Table.NoItems noItemsFound={noCorporateClients} text="No users found" />
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

export default observer(CorporateClientsTable);
