import { FilterOption } from '@/matches/types';
import Checklist from '@/theme/checklist';

interface ChecklistFilterProps {
  options: FilterOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  name: string;
}

const ChecklistFilter = ({ options, selected, onChange, name }: ChecklistFilterProps): JSX.Element => {
  const fields = options?.map((option) => ({
    ...option,
    value: selected.includes(option.key),
  }));

  const handleChangeSelectedFilters = (value: boolean, key: string): void => {
    const updatedSelectedFilters = value ? [...selected, key] : selected.filter((filter) => filter !== key);
    onChange(updatedSelectedFilters);
  };

  return <Checklist listItems={fields || []} onChange={handleChangeSelectedFilters} name={name} />;
};

export default ChecklistFilter;
