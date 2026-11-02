import { useState, useCallback, useRef, ChangeEvent, LegacyRef, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import { useOnClickOutside } from '@/utils/hooks';
import Icon, { icons } from '../icon';
import Input from '../input';
import styles from './Select.module.scss';

export type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps {
  name: string;
  className?: string;
  error?: string;
  options: SelectOption[];
  label?: string;
  value?: string;
  placeholder?: string;
  maxWidth?: boolean;
  onSelect?: (option: SelectOption) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Select = (
  { name, className, label, value, error, options, placeholder, maxWidth, onSelect, disabled, children }: SelectProps,
  ref: LegacyRef<HTMLInputElement>
): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setInputValue(options.find((option) => option.value === value)?.label || '');
  }, [value]);

  const toggleMenu = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClick = (): void => {
    if (!disabled) toggleMenu();
  };

  const handleSelect = (option: SelectOption): void => {
    onSelect && onSelect(option);
    setIsDropdownOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(() => {
    if (isDropdownOpen) setIsDropdownOpen(false);
  }, [isDropdownOpen]);

  useOnClickOutside({
    ref: dropdownRef,
    handler: handleClickOutside,
  });

  return (
    <div
      ref={dropdownRef}
      className={clsx(styles.root, { [styles.error]: error, [styles.disabled]: disabled }, className)}
    >
      <Input
        ref={ref}
        value={inputValue || ''}
        label={label}
        className={clsx({ [styles.active]: isDropdownOpen })}
        name={name}
        type="text"
        placeholder={placeholder}
        error={!children ? error : undefined}
        icon={<Icon icon={icons.back} className={styles.arrow} />}
        maxWidth={maxWidth}
        disabled={disabled}
        onClick={handleClick}
      />

      {isDropdownOpen && (
        <ul className={styles.options}>
          {options.map((option, index) => (
            <li key={index} className={styles.option} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {children && (
        <div className={styles.children}>
          {children}
          <span className={styles.error}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Select);
