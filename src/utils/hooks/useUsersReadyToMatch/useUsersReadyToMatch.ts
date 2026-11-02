import { useEffect, useMemo, useState } from 'react';
import { useStores } from '@/RootStore';
import { SortByFormAnswer, SortByParams } from '@/domain/sorting';
import { FilterState } from '@/domain/types';
import { User, UserRole } from '@/users/types';

type UseUsersReadyToMatchReturn = {
  usersReadyToMatch: User[];
  resetSearchedList: () => void;
  fetchNextPage: () => void;
  loadingUsers: boolean;
  hasMoreUsers: boolean;
};

type UseUsersReadyToMatchParams = {
  phrase: string;
  role?: keyof typeof UserRole;
  pageSize?: number;
  sortBy?: SortByParams;
  sortByFormAnswer?: SortByFormAnswer;
  selectedFilters?: FilterState;
  filterCount?: number;
};

export const useUsersReadyToMatch = ({
  phrase,
  role,
  pageSize = 15,
  selectedFilters,
  sortBy,
  sortByFormAnswer,
}: UseUsersReadyToMatchParams): UseUsersReadyToMatchReturn => {
  const { usersStore, corporateClientsStore } = useStores();
  const { fetchCorporateClients, corporateClientsFilterOptions } = corporateClientsStore;
  const { fetchUsers } = usersStore;
  const [usersReadyToMatch, setUsersReadyToMatch] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [allUsersCount, setAllUsersCount] = useState(0);

  const areCompanyFiltersSelected = useMemo(() => {
    return !!(selectedFilters?.Company && selectedFilters.Company.length > 0);
  }, [selectedFilters]);

  useEffect(() => {
    fetchCorporateClients();
  }, [areCompanyFiltersSelected]);

  const resetSearchedList = (): void => {
    setUsersReadyToMatch([]);
    setCurrentPage(0);
  };

  const filteredCompanies = useMemo((): string[] => {
    return (selectedFilters?.Company ?? [])
      .map((companyName) => {
        if (companyName === 'Public') return 'public';

        const companyOption = corporateClientsFilterOptions.find((option) => option.key === companyName);
        return companyOption ? companyOption.value : companyName;
      })
      .filter((companyId): companyId is string => companyId !== undefined);
  }, [selectedFilters, corporateClientsFilterOptions]);

  const fetchNextPage = (pageNumber?: number): void => {
    setLoadingUsers(true);

    const mappedFiltersToParams = Object.entries(selectedFilters || {})
      .filter(([key]) => key !== 'Company')
      .flatMap(([key, values]) => (values as string[]).map((v) => ({ formKey: key, formValue: v })));

    const filterValues = mappedFiltersToParams.map((v) => v.formValue);
    const filterKeys = mappedFiltersToParams.map((v) => v.formKey);

    const params = {
      readyForMatch: true,
      phrase: phrase || undefined,
      role,
      pageSize,
      pageNumber: pageNumber || currentPage + 1,
      sortBy: sortBy || undefined,
      sortByFormAnswer: sortByFormAnswer || undefined,
      formValue: filterValues,
      formKey: filterKeys,
      corporateClientId: filteredCompanies,
    };

    fetchUsers(params)
      .then((users) => {
        if (users) {
          setAllUsersCount(usersStore.allUsersCount);
          setUsersReadyToMatch(currentPage === 0 ? users : [...usersReadyToMatch, ...users]);
          setCurrentPage(currentPage + 1);
        }
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    resetSearchedList();
  }, [phrase, role, sortBy, sortByFormAnswer, selectedFilters]);

  useEffect(() => {
    currentPage === 0 && fetchNextPage();
  }, [currentPage]);

  const hasMoreUsers = usersReadyToMatch.length < allUsersCount;

  return {
    usersReadyToMatch,
    resetSearchedList,
    fetchNextPage,
    loadingUsers,
    hasMoreUsers,
  };
};
