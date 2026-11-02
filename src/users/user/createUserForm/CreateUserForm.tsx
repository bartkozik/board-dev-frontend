import React, { useEffect } from 'react';
import { UseFormRegister, FieldErrors, FieldPath, UseFormSetValue } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { z } from 'zod';
import { useStores } from '@/RootStore';
import { userFormSchema } from '@/domain/zodSchemas';
import Button from '@/theme/button';
import Input from '@/theme/input';
import LoadingArea from '@/theme/loadingArea/';
import Select from '@/theme/select';
import { SelectOption } from '@/theme/select/Select';
import { RawUserRole, UserRole } from '@/users/types';
import { useAvailableRoleOptions } from '@/utils/hooks';
import styles from './CreateUserForm.module.scss';

interface CreateUserFormProps {
  className?: string;
  clearValidationErrors: (fields: FieldPath<z.infer<typeof userFormSchema>>[]) => void;
  errors: FieldErrors<z.infer<typeof userFormSchema>>;
  onCancel?: () => void;
  onSubmit: ((event: React.FormEvent) => void) | ((event: React.FormEvent) => Promise<void>);
  register: UseFormRegister<z.infer<typeof userFormSchema>>;
  submitButtonText: string;
  submitting: boolean;
  userData?: z.infer<typeof userFormSchema>;
  onSelect?: UseFormSetValue<z.infer<typeof userFormSchema>>;
  isCompanySelectorDisabled?: boolean;
}

const CreateUserForm = ({
  className,
  clearValidationErrors,
  errors,
  onCancel,
  onSubmit,
  register,
  submitButtonText,
  submitting,
  userData,
  onSelect,
  isCompanySelectorDisabled,
}: CreateUserFormProps): JSX.Element => {
  const { corporateClientsStore } = useStores();
  const { fetchCorporateClients, corporateClientsSelectOptions, loading } = corporateClientsStore;

  const roleOptions = useAvailableRoleOptions({ withoutAdminRoles: Boolean(userData?.corporateClientId) });

  const disableCompanySelect = userData?.roles?.[0] === UserRole.Admin || isCompanySelectorDisabled;
  const isNonprofit = userData?.roles?.[0] === RawUserRole.NPO;
  
  useEffect(() => {
    fetchCorporateClients();
    register('organizationName');
    onSelect && onSelect('organizationName', '');
  }, []);

  return (
    <LoadingArea loading={loading} className={styles.root}>
      <form onSubmit={onSubmit} className={clsx(styles.form, className)}>
        <Input
          label="User full name"
          placeholder="Enter user full name"
          error={errors.name?.message}
          {...register('name')}
          onChange={(e) => {
            clearValidationErrors(['name']);
            register('name').onChange(e);
          }}
          maxWidth
        />
        {isNonprofit && (
          <Input
            label="Organization name"
            placeholder="Enter organization name"
            error={errors.organizationName?.message}
            {...register('organizationName')}
            onChange={(e) => {
              clearValidationErrors(['organizationName']);
              register('organizationName').onChange(e);
            }}
            maxWidth
          />
        )}
        <Input
          label="User email address"
          placeholder="Enter user email"
          error={errors.email?.message}
          {...register('email')}
          onChange={(e) => {
            clearValidationErrors(['email']);
            register('email').onChange(e);
          }}
          maxWidth
        />
        <Select
          label="Company (optional)"
          placeholder="Select company"
          options={corporateClientsSelectOptions}
          value={userData?.corporateClientId || ''}
          {...register('corporateClientId')}
          onSelect={(option: SelectOption) => {
            clearValidationErrors(['corporateClientId']);
            onSelect && onSelect('corporateClientId', option.value);
          }}
          disabled={disableCompanySelect}
          className={clsx({ [styles.companySelect]: !userData?.corporateClientId })}
        />
        <Select
          label="Account type"
          error={errors.roles?.[0]?.message}
          placeholder="Select user type"
          options={roleOptions}
          {...register('roles.0')}
          onSelect={(option: SelectOption) => {
            clearValidationErrors(['roles.0']);
            onSelect && onSelect('roles.0', option.value as keyof typeof UserRole);
            onSelect && onSelect('organizationName', '');
          }}
          value={userData?.roles?.[0]}
        />
        <div className={styles.actions}>
          {onCancel && <Button onClick={onCancel} text="Cancel" variant="secondary" />}
          <Button text={submitButtonText} loading={submitting} disabled={submitting} type="submit" />
        </div>
      </form>
    </LoadingArea>
  );
};

export default observer(CreateUserForm);
