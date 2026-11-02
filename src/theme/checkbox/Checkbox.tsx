import React, { ChangeEvent, ReactNode, forwardRef, LegacyRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import Icon, { icons, iconSize } from '../icon';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  error?: string;
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readonly?: boolean;
  variant?: 'default' | 'neutral';
}

const Checkbox = (
  {
    checked,
    error = '',
    label,
    className,
    labelClassName = '',
    name,
    disabled,
    readonly,
    variant = 'default',
    onChange,
    onBlur,
  }: CheckboxProps,
  ref: LegacyRef<HTMLInputElement>
): React.JSX.Element => {
  return (
    <label className={clsx(styles.root, { [styles.disabled]: disabled, [styles.readonly]: readonly }, className)}>
      <input
        id={name}
        type="checkbox"
        className={clsx(styles.input, styles[variant], { [styles.readonlyInput]: readonly })}
        defaultChecked={readonly ? Boolean(checked) : undefined}
        checked={!readonly ? Boolean(checked) : undefined}
        disabled={disabled}
        onChange={!readonly ? onChange : undefined}
        onBlur={onBlur}
        ref={ref}
      />
      {readonly && (
        <Icon icon={checked ? icons.checkmark : icons.notActive} size={iconSize.medium} className={styles.icon} />
      )}

      {label && (
        <div className={clsx(styles.labelText, { [styles.disabledLabel]: disabled || readonly }, labelClassName)}>
          {label}
          {error && <span className={styles.error}>{error}</span>}
        </div>
      )}
    </label>
  );
};

export default forwardRef(Checkbox);
