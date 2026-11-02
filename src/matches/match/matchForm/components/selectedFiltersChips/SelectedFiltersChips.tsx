import React from 'react';
import { FilterState } from '@/domain/types';
import Button from '@/theme/button';
import Chip from '@/theme/chip';
import styles from './SelectedFiltersChips.module.scss';

interface SelectedFiltersChipsProps {
  selectedFilters: FilterState;
  onRemoveSingleFilter: (filterKey: string, filterValue: string) => void;
  onClearAllFilters: () => void;
}

const SelectedFiltersChips = ({
  selectedFilters,
  onRemoveSingleFilter,
  onClearAllFilters,
}: SelectedFiltersChipsProps): JSX.Element | null => {
  if (!selectedFilters || Object.keys(selectedFilters).length === 0) return null;

  return (
    <div className={styles.root}>
      <div className={styles.selectedFilters}>
        {Object.entries(selectedFilters).map(([filterKey, filterValues]) =>
          filterValues.map((value, index) => (
            <Chip
              key={`${filterKey}-${value}-${index}`}
              label={`${filterKey}: ${value}`}
              clickable
              withCloseIcon
              variant="status"
              className={styles.selectedFilterChip}
              onClick={() => onRemoveSingleFilter(filterKey, value)}
            />
          ))
        )}
      </div>
      <Button text="clear filters" onClick={onClearAllFilters} variant="text" className={styles.clearFiltersButton} />
    </div>
  );
};

export default SelectedFiltersChips;
