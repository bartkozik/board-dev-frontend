import { forwardRef, LegacyRef, ReactNode, useState } from 'react';
import clsx from 'clsx';
import Checkbox from '../checkbox';
import styles from './Checklist.module.scss';

export type ChecklistElement = { value: boolean; label: string; key: string };
interface FilterChecklistProps {
  listItems: ChecklistElement[];
  onChange: (value: boolean, key: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  error?: string;
  maxSelection?: number;
  children?: React.ReactNode;
  name: string;
}

const Checklist = (
  { listItems, label: listLabel, error, onChange, onBlur, name, maxSelection, children }: FilterChecklistProps,
  ref: LegacyRef<HTMLInputElement>
): JSX.Element => {
  const [warning, setWarning] = useState<string | null>(null);

  const handleCheckboxChange = (isChecked: boolean, key: string): void => {
    const selectedCount = listItems.filter((item) => item.value).length;

    if (isChecked && maxSelection && selectedCount >= (maxSelection as number)) {
      setWarning(`You can select up to ${maxSelection} options.`);
      return;
    }

    setWarning(null);
    onChange(isChecked, key);
  };

  const handleOnBlure = (event: React.FocusEvent<HTMLInputElement>): void => {
    setWarning(null);
    onBlur && onBlur(event);
  };

  const list = listItems.map(({ label, value, key }: ChecklistElement, index) => {
    return (
      <Checkbox
        key={key + index}
        label={label}
        name={key}
        checked={value}
        onChange={(e) => handleCheckboxChange(e.target.checked, key)}
        labelClassName={styles.checkboxLabel}
        onBlur={handleOnBlure}
      />
    );
  });

  const infoElement = <span className={clsx(styles.error, { [styles.warning]: warning })}>{error || warning}</span>;

  return (
    <div className={styles.root}>
      {listLabel && <div className={styles.label}>{listLabel}</div>}
      {list}
      {children && (
        <div className={styles.children}>
          {children} {<span className={clsx(styles.passedWarning, { [styles.warning]: warning })}>{warning}</span>}
        </div>
      )}
      {!children && infoElement}
      <input type="hidden" name={name} ref={ref} />
    </div>
  );
};

export default forwardRef(Checklist);
