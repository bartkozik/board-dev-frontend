import { Controller } from 'react-hook-form';
import Input from '@/theme/input';
import { FormConfigSetup, FormElementConfig } from '../../types';
import styles from './OtherValueInput.module.scss';

interface OtherValueInputProps {
  formConfig: FormConfigSetup;
  item: FormElementConfig;
  onChange?: (key: string, value: string) => void;
}

const OtherValueInput = ({ formConfig, item, onChange }: OtherValueInputProps): JSX.Element => {
  const { formMethods, clearValidationErrors } = formConfig;
  const { control } = formMethods;

  const itemName = `${item.name}OtherValue`;

  return (
    <Controller
      name={itemName}
      control={control}
      shouldUnregister={false}
      render={({ field, fieldState }) => {
        return (
          <Input
            className={styles.input}
            key={itemName}
            label="Please specify"
            maxWidth
            {...field}
            value={typeof field.value === 'string' ? field.value : ''}
            error={fieldState.error?.message}
            onChange={(e) => {
              clearValidationErrors([itemName]);
              field.onChange(e);
            }}
            onBlur={(e) => onChange && onChange(itemName, e.target.value)}
          />
        );
      }}
    />
  );
};

export default OtherValueInput;
