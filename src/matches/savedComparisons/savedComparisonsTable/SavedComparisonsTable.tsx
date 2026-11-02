import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { SortColumn } from '@/domain/sorting';
import Pagination from '@/theme/pagination/Pagination';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import styles from './SavedComparisonsTable.module.scss';
import SavedComparisonsTableRow from './savedComparisonsTableRow';

const COLUMNS = [SortColumn.TechLeader, SortColumn.NonProfit, SortColumn.DateAdded];

const SavedComparisonsTable = (): JSX.Element => {
  const { savedComparisonsStore } = useStores();
  const {
    comparisons,
    loadingComparisons,
    activePage,
    allComparisonsCount,
    allPagesCount,
    sortColumn,
    updateSort,
    setActivePage,
    sortDirection,
  } = savedComparisonsStore;

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number): void => {
    searchParams.set('pageNumber', page.toString());
    setSearchParams(searchParams);
    setActivePage(page);
  };

  const noComparesFound = !loadingComparisons && comparisons.length === 0;

  return (
    <>
      <TableLayout loadingContent={loadingComparisons}>
        <Table className={styles.table}>
          <Table.Header className={styles.header}>
            {COLUMNS.map((column) => (
              <SortableTableHeadCell
                key={column}
                column={column}
                sortColumn={sortColumn.comparison}
                sortDirection={sortDirection}
                updateSort={updateSort('comparison')}
              />
            ))}
          </Table.Header>
          <Table.Spacer className={styles.spacer} />
          <Table.Body>
            {comparisons.map((comparison) => (
              <SavedComparisonsTableRow key={`comparison-${comparison.id}`} comparison={comparison} />
            ))}
            <Table.NoItems noItemsFound={noComparesFound} text="No comparisons found" />
          </Table.Body>
        </Table>

        <Pagination
          pages={allPagesCount}
          activePage={activePage}
          onChangeActivePage={handlePageChange}
          allItemsCount={allComparisonsCount}
        />
      </TableLayout>
    </>
  );
};

export default observer(SavedComparisonsTable);
