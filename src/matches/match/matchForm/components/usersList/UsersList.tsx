import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_PREVIOUS_FILTERS_KEY } from '@/domain/constants';
import { FilterState } from '@/domain/types';
import { MatchUserKey } from '@/matches/types';
import Button from '@/theme/button';
import Icon, { icons } from '@/theme/icon';
import SearchBar from '@/theme/searchBar';
import { NonAdminUserRole, User } from '@/users/types';
import { FiltersActions, UrlFiltersActions } from '@/utils/hooks';
import FilterPanel from '../filterPanel';
import SelectedFiltersChips from '../selectedFiltersChips';
import UsersTable from '../usersTable';
import styles from './UsersList.module.scss';

function selectedFilterKeyHasOneValue(filters: FilterState): boolean {
  const selectedFiltersKeys = Object.keys(filters);

  if (selectedFiltersKeys.length !== 1) return false;

  const key = selectedFiltersKeys[0];
  const value = filters[key];

  return Array.isArray(value) && value.length === 1;
}

interface UsersListProps {
  role: NonAdminUserRole;
  urlFilters: UrlFiltersActions;
  localStorageFilters: FiltersActions;
  onSelectUser: (key: MatchUserKey, user: User) => void;
}

const UsersList = ({ role, urlFilters, localStorageFilters, onSelectUser }: UsersListProps): JSX.Element => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { selectedFilters, filterCount, applyFilters, removeFilters } = urlFilters;
  const { filterState, roleHasSavedFilters, filtersAreInitialized, saveFiltersInLS, clearFiltersFromLS } =
    localStorageFilters;

  useEffect(() => {
    if (roleHasSavedFilters) applyFilters(filterState);
  }, [filterState, roleHasSavedFilters]);

  const filterButtonText = (
    <div className={styles.filterButtonLabel}>
      <span>Filter</span>
      {filterCount > 0 && <div className={styles.filterCountChip}>{filterCount}</div>}
    </div>
  );

  const handleSaveFilters = (filters: FilterState): void => {
    setIsPanelOpen(false);
    applyFilters(filters);
    saveFiltersInLS(filters);
  };

  const handleRemoveSingleFilter = (filterKey: string, value: string): void => {
    if (selectedFilterKeyHasOneValue(filterState)) handleResetFilters();
    else {
      removeFilters(filterKey, value);
      clearFiltersFromLS(filterKey, value);
    }
  };

  const handleResetFilters = (): void => {
    removeFilters();
    clearFiltersFromLS();
  };

  const previouslyUsedFiltersStorageKey = `${LOCAL_STORAGE_PREVIOUS_FILTERS_KEY}${role}`;

  return (
    <div className={styles.root}>
      <div className={styles.searchAndFilters}>
        <SearchBar placeholder="Search by name" className={styles.searchbar} />

        <Button
          icon={<Icon icon={icons.filter} />}
          onClick={() => setIsPanelOpen(true)}
          variant="secondary"
          text={filterButtonText}
        />
      </div>

      {filterCount > 0 && (
        <SelectedFiltersChips
          selectedFilters={selectedFilters}
          onClearAllFilters={handleResetFilters}
          onRemoveSingleFilter={handleRemoveSingleFilter}
        />
      )}
      <UsersTable
        role={role}
        onMatchUser={onSelectUser}
        selectedFilters={filterState}
        filtersAreInitialized={filtersAreInitialized}
      />
      <FilterPanel
        isOpen={isPanelOpen}
        onSave={handleSaveFilters}
        onClose={() => setIsPanelOpen(false)}
        role={role}
        selectedFiltersFromUrl={selectedFilters}
        filterStorageKey={previouslyUsedFiltersStorageKey}
      />
    </div>
  );
};

export default UsersList;
