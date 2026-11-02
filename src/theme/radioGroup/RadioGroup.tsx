import { useState, ReactNode, LegacyRef, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import RadioButton from '../radioButton';
import styles from './RadioGroup.module.scss';

export interface RadioOption {
  value: string;
  label: ReactNode;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  groupLabel?: ReactNode;
  readonly?: boolean;
  children?: React.ReactNode;
}

const RadioGroup = (
  {
    name,
    options,
    selectedValue,
    readonly,
    onChange,
    children,
    className,
    groupLabel,
    error,
    ...rest
  }: RadioGroupProps,
  ref: LegacyRef<HTMLInputElement>
): JSX.Element => {
  const [currentValue, setCurrentValue] = useState<string>(selectedValue);

  useEffect(() => {
    setCurrentValue(selectedValue);
  }, [selectedValue]);

  const handleChange = (value: string): void => {
    setCurrentValue(value);
    onChange && onChange(value);
  };

  return (
    <div className={clsx(styles.root, className)} tabIndex={0}>
      {groupLabel && <div className={styles.groupLabel}>{groupLabel}</div>}
      {options.map((option, index) => (
        <RadioButton
          ref={ref}
          key={option.value + index}
          name={option.value + name}
          label={option.label}
          checked={currentValue === option.value}
          onChange={() => handleChange(option.value)}
          className={clsx({ [styles.radioError]: Boolean(error) })}
          readonly={readonly}
          {...rest}
        />
      ))}
      {children && <div className={clsx(styles.children, { [styles.childrenError]: error })}>{children}</div>}
      <span className={styles.error}>{error}</span>
    </div>
  );
};

export default forwardRef(RadioGroup);
