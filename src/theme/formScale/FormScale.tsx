import { forwardRef, LegacyRef } from 'react';
import clsx from 'clsx';
import styles from './FormScale.module.scss';

const DEFAULT_SCALE = [1, 2, 3, 4, 5];

interface FormScaleProps {
  onSelect: (value: number) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  selectedValue?: number;
  scale?: { min: string; max: string };
}

const FormScale = (
  { onSelect, selectedValue, scale, onBlur }: FormScaleProps,
  ref: LegacyRef<HTMLDivElement>
): JSX.Element => {
  return (
    <div className={styles.root} tabIndex={0}>
      <span className={clsx({ [styles.isSmaller]: Boolean(scale) })}>{scale?.min || 'Strongly disagree'}</span>
      <div className={styles.scale} ref={ref} onBlur={onBlur}>
        {DEFAULT_SCALE.map((value) => (
          <div
            key={value}
            className={clsx(styles.ratingItem, { [styles.selected]: selectedValue === value })}
            onClick={() => onSelect(value)}
          >
            {value}
          </div>
        ))}
      </div>
      <span className={clsx({ [styles.isSmaller]: Boolean(scale) })}>{scale?.max || 'Strongly agree'}</span>
    </div>
  );
};

export default forwardRef(FormScale);
