import React, { ChangeEvent, InputHTMLAttributes, forwardRef, LegacyRef } from 'react';
import clsx from 'clsx';
import Icon, { icons } from '@/theme/icon';
import IconButton from '../iconButton';
import Label from '../label';
import styles from './Input.module.scss';

export type InputType = 'text' | 'password' | 'search' | 'email' | 'number';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  label?: string;
  secondaryLabel?: React.ReactNode;
  name: string;
  icon?: JSX.Element;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: InputType;
  value?: string | number;
  autoCompleteOff?: boolean;
  maxWidth?: boolean;
  tooltipText?: string;
  disabled?: boolean;
}

const Input = (
  {
    className = '',
    error = '',
    label,
    secondaryLabel,
    name,
    icon,
    onChange,
    onReset,
    onKeyDown,
    onBlur,
    placeholder,
    readOnly = false,
    type = 'text',
    value,
    autoCompleteOff,
    maxWidth = false,
    tooltipText,
    disabled = false,
    ...rest
  }: InputProps,
  ref: LegacyRef<HTMLInputElement>
): React.JSX.Element => {
  const handleReset = (): void => {
    onChange?.({ target: { name, value: '' } } as ChangeEvent<HTMLInputElement>);
    onReset && onReset();
  };

  const isSearchInput = type === 'search';
  const hasValue = value !== undefined && value !== '';
  return (
    <div className={clsx(styles.root, className, { [styles.maxWidth]: maxWidth })}>
      {label && <Label label={label} name={name} tooltipText={tooltipText} secondaryLabel={secondaryLabel} />}
      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          ref={ref}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoCompleteOff ? 'new-password' : name}
          aria-label={`${name} input`}
          className={clsx(styles.input, {
            [styles.searchInput]: isSearchInput && !hasValue,
            [styles.inputError]: error,
            [styles.readOnly]: readOnly,
          })}
          {...rest}
        />
        {!disabled && <span className={styles.icon}>{icon && icon}</span>}
        {isSearchInput && !hasValue && <Icon icon={icons.search} className={styles.searchIcon} />}
        {isSearchInput && hasValue && (
          <IconButton icon={icons.close} className={styles.resetButton} onClick={handleReset} />
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default forwardRef(Input);
