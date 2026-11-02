import { ChangeEvent, ReactNode, forwardRef, LegacyRef } from 'react';
import clsx from 'clsx';
import Label from '../label';
import styles from './TextArea.module.scss';

export interface TextAreaProps {
  name: string;
  value?: string;
  label?: ReactNode;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  tooltipText?: string;
  className?: string;
}

const TextArea = (
  {
    value,
    label,
    name,
    error,
    placeholder,
    maxLength,
    disabled,
    tooltipText,
    onChange,
    onBlur,
    onKeyDown,
    className,
    ...rest
  }: TextAreaProps,
  ref: LegacyRef<HTMLTextAreaElement>
): JSX.Element => {
  return (
    <div className={clsx(styles.root, className)}>
      {label && <Label label={label} name={name} tooltipText={tooltipText} />}
      <textarea
        ref={ref}
        id={name}
        name={name}
        className={clsx(styles.textarea, { [styles.withError]: error })}
        placeholder={placeholder}
        spellCheck={false}
        maxLength={maxLength}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        value={value}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default forwardRef(TextArea);
