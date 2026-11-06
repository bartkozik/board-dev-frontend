import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import clsx from 'clsx';
import Label from '../label';
import styles from './MarkdownEditArea.module.scss';

interface MarkdownEditAreaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: string;
  tooltipText?: string;
  className?: string;
  defaultValue?: PathValue<T, Path<T>>;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const MarkdownEditArea = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  tooltipText,
  className,
  defaultValue,
  onChange,
}: MarkdownEditAreaProps<T>): JSX.Element => {
  const editorRef = useRef<Editor>(null);
  const [initialized, setInitialized] = useState(false);

  return (
    <div className={clsx(styles.root, className)}>
      {label && <Label label={label} name={String(name)} tooltipText={tooltipText} />}

      <div className={styles.editorWrapper}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => {
            const { onChange: fieldOnChange, value } = field;
            const formattedValue = typeof value === 'string' ? value.replace(/\n/g, '\n\n') : '';

            useEffect(() => {
              if (!initialized && typeof value === 'string' && value && editorRef.current) {
                editorRef.current.getInstance().setMarkdown(value);
                setInitialized(true);
              }
            }, [value, initialized]);

            return (
              <Editor
                ref={editorRef}
                initialEditType="wysiwyg"
                hideModeSwitch
                toolbarItems={[]}
                previewStyle="vertical"
                height="auto"
                initialValue={formattedValue}
                useCommandShortcut={false}
                onChange={() => {
                  const instance = editorRef.current?.getInstance();
                  const markdown = instance?.getMarkdown() || '';
                  fieldOnChange(markdown);
                  onChange?.(markdown);
                }}
              />
            );
          }}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default MarkdownEditArea;
