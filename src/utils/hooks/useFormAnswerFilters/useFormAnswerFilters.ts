import { useState, useEffect } from 'react';
import { FILTERS_CONFIG } from '@/matches/match/matchForm/components/filterPanel/filterBaseOnRole';
import { getAllUniqueAnswers } from '@/matches/match/requests';
import { FilterOption, FilterType } from '@/matches/types';
import { NonAdminUserRole } from '@/users/types';

interface UseFormAnswerFiltersProps {
  role: NonAdminUserRole;
}

export const useFormAnswerFilters = ({ role }: UseFormAnswerFiltersProps): Record<string, FilterOption[]> => {
  const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({});

  useEffect(() => {
    const isValidFilter = (filter: FilterType): boolean => !filter.options;

    const loadOptions = async (): Promise<void> => {
      const optionsPromises = FILTERS_CONFIG[role].filter(isValidFilter).map(async (filter) => {
        const { data } = await getAllUniqueAnswers(filter.formKey, role);
        return {
          key: filter.formKey,
          options: data.reduce((acc: FilterOption[], answer: string) => {
            if (answer.trim().length > 0) {
              acc.push({ key: answer, label: answer });
            }
            return acc;
          }, []),
        };
      });

      const optionsData = await Promise.all(optionsPromises);
      const optionsMap = optionsData.reduce((acc, item) => {
        if (item) acc[item.key] = item.options;
        return acc;
      }, {} as Record<string, FilterOption[]>);

      setFilterOptions(optionsMap);
    };

    loadOptions();
  }, [role]);

  return filterOptions;
};
