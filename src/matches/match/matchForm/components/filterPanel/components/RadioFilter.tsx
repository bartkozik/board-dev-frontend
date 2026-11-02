import RadioGroup from '@/theme/radioGroup';
import { RadioOption } from '@/theme/radioGroup/RadioGroup';
import styles from './FilterComponent.module.scss';

interface RadioFilterProps {
  options: RadioOption[];
  selected: string[];
  name: string;
  onChange?: (value: string) => void;
}

const RadioFilter = ({ options, selected, name, onChange }: RadioFilterProps): JSX.Element => {
  return (
    <RadioGroup
      options={options}
      selectedValue={selected?.[0] || ''}
      name={name}
      className={styles.radio}
      onChange={onChange}
    />
  );
};

export default RadioFilter;
