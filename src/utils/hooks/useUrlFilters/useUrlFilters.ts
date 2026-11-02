import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '@/domain/types';
import { FILTER_KEYS_BY_ROLE } from '@/matches/constants';
import { NonAdminUserRole } from '@/users/types';

function mergeFilterStateWithSearchParams(
  currentSearchParams: URLSearchParams,
  filterState: FilterState
): URLSearchParams {
  const newSearchParams = new URLSearchParams(currentSearchParams);
  Object.entries(filterState).forEach(([key, values]) => {
    newSearchParams.delete(key);
    values.forEach((val) => {
      newSearchParams.append(key, val);
    });
  });
  return newSearchParams;
}

export interface UrlFiltersActions {
  selectedFilters: FilterState;
  applyFilters: (filters: FilterState) => void;
  removeFilters: (filterKey?: string, filterValue?: string) => void;
  filterCount: number;
  clearAllFilters: () => void;
}

export const useUrlFilters = (role: NonAdminUserRole): UrlFiltersActions => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const keys = FILTER_KEYS_BY_ROLE[role] ?? [];

    const filtersFromUrl = keys.reduce((acc, key) => {
      const values = searchParams.getAll(key);
      return { ...acc, [key]: values };
    }, {} as FilterState);

    setSelectedFilters(filtersFromUrl);
  }, [searchParams, role]);

  const applyFilters = (filters: FilterState): void => {
    const newSearchParams = mergeFilterStateWithSearchParams(searchParams, filters);
    setSearchParams(newSearchParams);
  };

  const removeFilters = (filterKey?: string, filterValue?: string): void => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (!filterKey) {
      const filterKeys = FILTER_KEYS_BY_ROLE[role] ?? [];
      filterKeys.forEach((key) => {
        newSearchParams.delete(key);
      });
    } else {
      if (!filterValue) newSearchParams.delete(filterKey);
      else {
        const currentValues = newSearchParams.getAll(filterKey);
        const filteredValues = currentValues.filter((v) => v !== filterValue);

        newSearchParams.delete(filterKey);
        filteredValues.forEach((v) => newSearchParams.append(filterKey, v));
      }
    }

    setSearchParams(newSearchParams);
  };

  const filterCount = selectedFilters
    ? Object.values(selectedFilters).reduce((acc, value) => acc + value.length, 0)
    : 0;

  const clearAllFilters = (): void => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    const allKeys = new Set(Object.values(FILTER_KEYS_BY_ROLE).flat());

    allKeys.forEach((key) => {
      newSearchParams.delete(key);
    });

    setSearchParams(newSearchParams);
  };

  return { selectedFilters, applyFilters, removeFilters, filterCount, clearAllFilters };
};
