import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues, FieldPath } from 'react-hook-form';
import { z } from 'zod';

export interface UseFormValidationReturn<TFormValues extends FieldValues> {
  formMethods: UseFormReturn<TFormValues>;
  resetValidation: () => void;
  clearValidationErrors: (keys?: FieldPath<TFormValues>[]) => void;
}

export function useFormValidation<TFormValues extends FieldValues>(
  schema: z.ZodSchema<TFormValues>,
  defaultValues?: DefaultValues<TFormValues>,
  mode: 'onChange' | 'onSubmit' | 'all' | 'onBlur' = 'onSubmit'
): UseFormValidationReturn<TFormValues> {
  const formMethods = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: mode,
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  });

  const { reset, clearErrors } = formMethods;

  const resetValidation = useCallback((): void => {
    reset(undefined, { keepErrors: false, keepDirty: false });
  }, [reset]);

  const clearValidationErrors = (keys?: FieldPath<TFormValues>[]): void => {
    clearErrors(keys);
  };

  return {
    formMethods,
    resetValidation,
    clearValidationErrors,
  };
}
