import { z } from 'zod';
import { useState, useEffect, useCallback, SetStateAction, Dispatch } from 'react';
import { LOCAL_STORAGE_FILTERS_KEY, LOCAL_STORAGE_PREVIOUS_FILTERS_KEY } from '@/domain/constants';
import { FilterState } from '@/domain/types';
import { NonAdminUserRole } from '@/users/types';

const filterSchema = z.record(z.array(z.string()));

export function parseFilters(stored: string): FilterState | null {
  try {
    return filterSchema.parse(JSON.parse(stored));
  } catch {
    return null;
  }
}

function removeEmptyArrays(filters: FilterState): FilterState {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) acc[key] = value;
    } else acc[key] = value;

    return acc;
  }, {} as FilterState);
}

function getFiltersForRole(role: NonAdminUserRole): {
  savedFilters: FilterState;
  roleHasSavedFilters: boolean;
} {
  const key = `filters_for_${role}`;
  const stored = localStorage.getItem(key);
  if (!stored) {
    return {
      savedFilters: {},
      roleHasSavedFilters: false,
    };
  }

  const savedFilters = parseFilters(stored);
  return { savedFilters: savedFilters ?? {}, roleHasSavedFilters: savedFilters !== null };
}

export interface FiltersActions {
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  saveFiltersInLS: (filters: FilterState) => void;
  clearFiltersFromLS: (filterKey?: string, filterValue?: string) => void;
  roleHasSavedFilters: boolean;
  filtersAreInitialized: boolean;
}

export function useLocalStorageFilters(role: NonAdminUserRole): FiltersActions {
  const [filterState, setFilterState] = useState<FilterState>({});
  const [filtersAreInitialized, setFiltersAreInitialized] = useState(false);
  const [, setPreviousFilterState] = useState<FilterState>({});

  const storageKey = `${LOCAL_STORAGE_FILTERS_KEY}${role}`;
  const previousStorageKey = `${LOCAL_STORAGE_PREVIOUS_FILTERS_KEY}${role}`;

  const { savedFilters, roleHasSavedFilters } = getFiltersForRole(role);

  useEffect(() => {
    setFilterState(savedFilters);
    setFiltersAreInitialized(true);
  }, [role]);

  const saveFiltersInLS = useCallback(
    (filters: FilterState) => {
      const sanitizedFilters = removeEmptyArrays(filters);

      const hasAnyKey = Object.keys(sanitizedFilters).length > 0;

      if (hasAnyKey) {
        localStorage.setItem(previousStorageKey, JSON.stringify(sanitizedFilters));
        setPreviousFilterState(sanitizedFilters);

        localStorage.setItem(storageKey, JSON.stringify(sanitizedFilters));
        setFilterState(sanitizedFilters);
      } else {
        localStorage.removeItem(storageKey);
        setFilterState({});
      }
    },
    [role, storageKey, previousStorageKey]
  );

  const clearFiltersFromLS = useCallback(
    (filterKey?: string, filterValue?: string) => {
      const stored = localStorage.getItem(storageKey);

      if (!stored) return;

      if (!filterKey) {
        localStorage.removeItem(storageKey);
        setFilterState({});
        return;
      }

      const parsedFilters = parseFilters(stored) ?? {};

      if (!filterValue) delete parsedFilters[filterKey];
      else {
        const currentValues = parsedFilters[filterKey] || [];
        const filteredValues = currentValues.filter((val) => val !== filterValue);

        if (filteredValues.length > 0) parsedFilters[filterKey] = filteredValues;
        else delete parsedFilters[filterKey];
      }

      localStorage.setItem(storageKey, JSON.stringify(parsedFilters));
      setFilterState(parsedFilters);
    },
    [role, storageKey]
  );

  return {
    filterState,
    setFilterState,
    saveFiltersInLS,
    clearFiltersFromLS,
    roleHasSavedFilters,
    filtersAreInitialized,
  };
}
