import { useState } from 'react';
import { parseFilters } from '@/utils/hooks/useLocalStorageFilters/useLocalStorageFilters';
import { FilterOption } from '@/matches/types';
import Chip from '@/theme/chip';
import Input from '@/theme/input';
import styles from './FilterComponent.module.scss';

const AMOUNT_OF_VISIBLE_CHIPS = 10;

const getFiltersFromStorage = (key: string): Set<string> => {
  const stored = localStorage.getItem(key);
  if (stored) {
    const parsedFilters = parseFilters(stored) ?? {};

    const selectedValues = Object.values(parsedFilters).reduce((acc, values) => {
      values.forEach((value) => acc.add(value));
      return acc;
    }, new Set<string>());

    return selectedValues;
  }
  return new Set();
};

interface ChipsGroupProps {
  chips: FilterOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  withSearch?: boolean;
  filterStorageKey: string;
}

const ChipsGroup = ({ selected, chips, onChange, withSearch, filterStorageKey }: ChipsGroupProps): JSX.Element => {
  const [searchChip, setSearchChip] = useState('');

  const previouslySelectedKeys = getFiltersFromStorage(filterStorageKey);

  const handleClickChip = (value: string): void => {
    const isSelected = selected.includes(value);
    const updatedSelectedChips = isSelected ? selected.filter((chip) => chip !== value) : [...selected, value];
    onChange(updatedSelectedChips);
  };

  const sortedChipsWithPrev = [...chips].sort((a, b) => {
    const aSelected = previouslySelectedKeys.has(a.key) ? -1 : 1;
    const bSelected = previouslySelectedKeys.has(b.key) ? -1 : 1;
    return aSelected - bSelected;
  });

  const chipsToDisplay = sortedChipsWithPrev
    .filter((filter) => filter.key.toLowerCase().includes(searchChip.toLowerCase()))
    .slice(0, AMOUNT_OF_VISIBLE_CHIPS);

  return (
    <div className={styles.wrapper}>
      {withSearch && (
        <Input
          placeholder="Search..."
          type="search"
          value={searchChip}
          className={styles.search}
          name="search"
          onChange={(e) => setSearchChip(e.target.value)}
          maxWidth
        />
      )}
      <div className={styles.chips}>
        {chipsToDisplay.map(({ label, key }) => {
          const isSelected = selected.includes(key);
          return (
            <Chip
              key={key}
              label={label}
              clickable
              isSelected={isSelected}
              variant="filter"
              onClick={() => handleClickChip(key)}
              className={styles.chip}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChipsGroup;
