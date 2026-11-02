import { forwardRef, LegacyRef, ReactNode } from 'react';
import clsx from 'clsx';
import Icon, { icons, iconSize } from '../icon';
import styles from './RadioButton.module.scss';

interface RadioButtonProps {
  name: string;
  label: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  isGrayscaled?: boolean;
}

const RadioButton = (
  { name, checked, disabled, readonly, label, className, onChange, onBlur, isGrayscaled }: RadioButtonProps,
  ref: LegacyRef<HTMLInputElement>
): JSX.Element => {
  return (
    <div className={styles.inputGroup}>
      <input
        ref={ref}
        type="radio"
        id={name}
        name={name}
        value={name}
        className={clsx(
          styles.input,
          { [styles.readonlyInput]: readonly, [styles.disabledInput]: disabled, [styles.grayscaled]: isGrayscaled },
          className
        )}
        checked={checked}
        disabled={disabled || readonly}
        onChange={onChange}
        onBlur={onBlur}
      />
      {!checked && readonly && (
        <Icon
          icon={icons.notActive}
          size={iconSize.medium}
          className={clsx(styles.notCheckedIcon, { [styles.notCheckedIconGrayscaled]: isGrayscaled })}
        />
      )}
      <label
        htmlFor={name}
        className={clsx(styles.label, { [styles.disabledLabel]: disabled, [styles.readOnlyLabel]: readonly })}
      >
        {label}
      </label>
    </div>
  );
};

export default forwardRef(RadioButton);
