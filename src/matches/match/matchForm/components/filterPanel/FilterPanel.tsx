import { useEffect, useState } from 'react';
import { useStores } from '@/RootStore';
import { FilterState } from '@/domain/types';
import { FILTER_KEYS_BY_ROLE } from '@/matches/constants';
import { FilterType, FilterKind } from '@/matches/types';
import Button from '@/theme/button';
import SlidingPanel from '@/theme/slidingPanel';
import { NonAdminUserRole, UserRole } from '@/users/types';
import { useFormAnswerFilters } from '@/utils/hooks';
import styles from './FilterPanel.module.scss';
import { ChipsGroup, ChecklistFilter, RadioFilter } from './components';
import { FILTERS_CONFIG } from './filterBaseOnRole';

const getInitialFilters = (role: NonAdminUserRole): FilterState =>
  FILTER_KEYS_BY_ROLE[role].reduce((acc, key) => ({ ...acc, [key]: [] }), {} as FilterState);

interface SectionProps {
  children: JSX.Element;
  title?: string;
}

const Section = ({ children, title }: SectionProps): JSX.Element => (
  <div className={styles.section}>
    <p className={styles.label}>{title}</p>
    {children}
  </div>
);

interface FilterPanelProps {
  selectedFiltersFromUrl: FilterState;
  filterStorageKey: string;
  role: NonAdminUserRole;
  isOpen: boolean;
  onSave: (filters: FilterState) => void;
  onClose: () => void;
}

const FilterPanel = ({
  role,
  isOpen,
  selectedFiltersFromUrl,
  filterStorageKey,
  onSave,
  onClose,
}: FilterPanelProps): JSX.Element => {
  const { corporateClientsStore } = useStores();
  const { corporateClientsFilterOptions, fetchCorporateClients } = corporateClientsStore;
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const formAnswersAsFilters = useFormAnswerFilters({ role });

  useEffect(() => {
    fetchCorporateClients();
  }, [isOpen]);

  useEffect(() => {
    setSelectedFilters(selectedFiltersFromUrl);
  }, [selectedFiltersFromUrl]);

  const handleFilterChange = (filterKey: string, value: string[]): void => {
    setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleApplyFilters = (): void => {
    onSave(selectedFilters);
  };

  const handleResetFilters = (): void => {
    const emptyFilters = getInitialFilters(role);
    setSelectedFilters(emptyFilters);
  };

  const getFilterField = (filter: FilterType): JSX.Element => {
    const { type, formKey } = filter;
    switch (type) {
      case FilterKind.Chips: {
        const filterOptions =
          formKey === 'Company' ? corporateClientsFilterOptions : filter.options || formAnswersAsFilters[formKey] || [];

        return (
          <ChipsGroup
            withSearch={filter.withSearch}
            chips={filterOptions}
            selected={selectedFilters[formKey] || []}
            onChange={(value) => handleFilterChange(formKey, value)}
            filterStorageKey={filterStorageKey}
          />
        );
      }
      case FilterKind.Checklist:
        return (
          <ChecklistFilter
            options={filter.options}
            name={filter.label}
            selected={selectedFilters[formKey] || []}
            onChange={(value) => handleFilterChange(formKey, value)}
          />
        );
      case FilterKind.Radio:
        return (
          <RadioFilter
            options={filter.options}
            name={filter.label}
            selected={selectedFilters[formKey]}
            onChange={(value) => handleFilterChange(formKey, [value])}
          />
        );

      default:
        return <></>;
    }
  };

  const anyFilterSelected = Object.values(selectedFilters).some((arr) => arr.length > 0);

  return (
    <SlidingPanel onClose={onClose} isOpen={isOpen}>
      <SlidingPanel.Header title={`Filter ${UserRole[role]}s`}>
        {anyFilterSelected && (
          <Button text="Reset all" onClick={handleResetFilters} variant="text" className={styles.reset} />
        )}
      </SlidingPanel.Header>
      <SlidingPanel.Body>
        <div className={styles.filtersList}>
          {FILTERS_CONFIG[role].map((filter, index) => (
            <Section key={index} title={filter.label}>
              {getFilterField(filter)}
            </Section>
          ))}
        </div>
        <Button text="Apply filters" onClick={handleApplyFilters} maxWidth />
      </SlidingPanel.Body>
    </SlidingPanel>
  );
};

export default FilterPanel;
