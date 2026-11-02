import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { SortColumn } from '@/domain/sorting';
import Pagination from '@/theme/pagination/Pagination';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import Table from '@/theme/table';
import TableLayout from '@/theme/tableLayout';
import styles from './MatchesTable.module.scss';
import MatchesTableRow from './matchesTableRow';

const COLUMNS = [SortColumn.TechLeader, SortColumn.NonProfit, SortColumn.DateAdded];

const MatchesTable = (): JSX.Element => {
  const { matchesStore, matchStore } = useStores();
  const {
    matches,
    loadingMatches,
    activePage,
    allMatchesCount,
    allPagesCount,
    sortColumn,
    updateSort,
    setActivePage,
    sortDirection,
  } = matchesStore;
  const { setIsEditing } = matchStore;

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number): void => {
    searchParams.set('pageNumber', page.toString());
    setSearchParams(searchParams);
    setActivePage(page);
  };

  const noMatchesFound = !loadingMatches && matches.length === 0;

  return (
    <>
      <TableLayout loadingContent={loadingMatches}>
        <Table className={styles.table}>
          <Table.Header className={styles.header}>
            {COLUMNS.map((c) => (
              <SortableTableHeadCell
                key={c}
                column={c}
                sortColumn={sortColumn.match}
                sortDirection={sortDirection}
                updateSort={updateSort('match')}
              />
            ))}
          </Table.Header>
          <Table.Spacer className={styles.spacer} />
          <Table.Body>
            {matches.map((match) => (
              <MatchesTableRow
                key={match.npoUserId + match.techLeaderUserId}
                match={match}
                onClick={() => setIsEditing(false)}
              />
            ))}
            <Table.NoItems noItemsFound={noMatchesFound} text="No matches found" />
          </Table.Body>
        </Table>

        <Pagination
          pages={allPagesCount}
          activePage={activePage}
          onChangeActivePage={handlePageChange}
          allItemsCount={allMatchesCount}
        />
      </TableLayout>
    </>
  );
};

export default observer(MatchesTable);
