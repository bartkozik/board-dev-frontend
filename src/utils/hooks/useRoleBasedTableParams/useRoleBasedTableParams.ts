import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortByParams, SortDirection, SortColumn, SortByFormAnswer } from '@/domain/sorting';
import { SORT_BY_FORM_ANSWER_KEYS } from '@/matches/constants';
import { USER_ROLE_FIELD_MAPPINGS } from '@/matches/match/matchForm/components/usersTable/columnsConfig';
import { NonAdminUserRole } from '@/users/types';

interface UseRoleBasedTableParamsReturn {
  phrase: string;
  sortBy: SortByParams;
  sortByFormAnswer: SortByFormAnswer;
  sortColumnName: SortColumn;
  sortDirection: SortDirection;
  techLeaderUserId: string | null;
  npoUserId: string | null;
  updateSort: (column: SortColumn) => void;
}

export const useRoleBasedTableParams = (
  defaultSortBy: SortByParams,
  role: NonAdminUserRole
): UseRoleBasedTableParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const phrase = searchParams.get('phrase') || '';
  const sortBy = searchParams.get('sortBy') as SortByParams;
  const sortByFormAnswer = searchParams.get('sortByFormAnswer') as SortByFormAnswer;
  const techLeaderUserId = searchParams.get('techLeaderUserId');
  const npoUserId = searchParams.get('npoUserId');
  const currentSort = sortBy || sortByFormAnswer || '';
  const sortDirection = currentSort.includes(SortDirection.Asc) ? SortDirection.Asc : SortDirection.Desc;
  const sortColumn = currentSort.replace(sortDirection, '') as SortColumn;
  const sortColumnName =
    (USER_ROLE_FIELD_MAPPINGS[role].find((field) => field.sortParam === sortColumn)?.label as SortColumn) || '';

  const updateSort = (column: SortColumn): void => {
    const newSortParam = USER_ROLE_FIELD_MAPPINGS[role].find((field) => field.label === column)?.sortParam || '';
    const newDirection =
      sortColumnName === column && sortDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
    const searchParamName = SORT_BY_FORM_ANSWER_KEYS.includes(newSortParam) ? 'sortByFormAnswer' : 'sortBy';
    searchParams.delete('sortByFormAnswer');
    searchParams.delete('sortBy');
    searchParams.set(searchParamName, `${newSortParam}${newDirection}`);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!sortBy && !sortByFormAnswer) {
      searchParams.set('sortBy', defaultSortBy);
      setSearchParams(searchParams);
    }
  }, []);

  return {
    phrase,
    sortBy,
    sortByFormAnswer,
    sortColumnName,
    sortDirection,
    techLeaderUserId,
    npoUserId,
    updateSort,
  };
};
