import { ReactElement } from 'react';
import { Controller, Control, ControllerRenderProps, FieldError } from 'react-hook-form';

interface ControlledFormFieldProps {
  name: string;
  control: Control;
  shouldUnregister?: boolean;
  children: (field: ControllerRenderProps, fieldState: { error?: FieldError }) => ReactElement;
}

const ControlledFormField = ({
  name,
  control,
  shouldUnregister = false,
  children,
}: ControlledFormFieldProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => children(field, fieldState)}
    />
  );
};

export default ControlledFormField;
