import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { HOME_PAGE } from '@/domain/constants';
import { supportInfo } from '@/domain/supportInfo';
import { userFormSchema } from '@/domain/zodSchemas';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import Input from '@/theme/input';
import Logo from '@/theme/logo';
import PageHeader from '@/theme/pageHeader';
import Select, { SelectOption } from '@/theme/select';
import SupportInfo from '@/theme/supportInfo';
import { RawUserRole, UserFormData, UserRole } from '@/users/types';
import { useFormValidation, useTitle } from '@/utils/hooks';
import styles from './Signup.module.scss';
import UserCreatedMessage from './components/UserCreatedMessage';

const SELECT_OPTIONS = Object.entries(UserRole)
  .filter(([role]) => role !== UserRole.Admin)
  .map(([role, label]) => ({
    value: role,
    label,
  }));

const Signup = (): React.JSX.Element => {
  useTitle('Signup');
  const { authStore, corporateClientStore } = useStores();
  const [searchParams] = useSearchParams();
  const [userWasCreated, setUserWasCreated] = useState(false);
  const invitation = searchParams.get('invitation');
  const { submitting, createUser } = authStore;
  const { corporateClient, loading, fetchCorporateClient } = corporateClientStore;
  const { formMethods, clearValidationErrors } = useFormValidation(userFormSchema);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = formMethods;

  const submit = handleSubmit((data) => {
    const role = data.roles[0];
    const isNonprofit = role === RawUserRole.NPO;
    const userFormData: UserFormData = {
      email: data.email.trim(),
      name: data.organizationName || data.name,
      primaryContactFullName: isNonprofit ? data.name : undefined,
      roles: data.roles,
      corporateClientId: invitation || undefined,
    };
    createUser(userFormData, false).then(() => setUserWasCreated(true));
  });

  useEffect(() => {
    register('organizationName');
    setValue('organizationName', '');
  }, []);

  const formElement = (
    <>
      <PageHeader title="Sign up" />
      <form onSubmit={submit} className={styles.form}>
        <Select
          label="I am a..."
          error={errors.roles?.[0]?.message}
          placeholder="select option"
          options={SELECT_OPTIONS}
          {...register('roles.0')}
          onSelect={(option: SelectOption) => {
            clearValidationErrors();
            setValue('roles.0', option.value as keyof typeof UserRole);
            setValue('organizationName', '');
          }}
          value={getValues('roles.0')}
        />

        <Input
          label="Full name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register('name')}
          onChange={(e) => {
            clearValidationErrors(['name']);
            register('name').onChange(e);
          }}
          maxWidth
        />
        {getValues('roles.0') === RawUserRole.NPO && (
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
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
          onChange={(e) => {
            clearValidationErrors(['email']);
            register('email').onChange(e);
          }}
          maxWidth
        />
        {invitation && !loading && (
          <div className={styles.invitation}>
            You are using an invitation from {corporateClient?.name || 'company'}. By creating an account, you will be
            automatically assigned to this company.
          </div>
        )}
        <Button text="Sign up" type="submit" maxWidth loading={submitting} />
      </form>
    </>
  );

  useEffect(() => {
    if (invitation) fetchCorporateClient(invitation);
  }, []);

  return (
    <div className={styles.root}>
      <Logo withoutRedirect size="small" />
      <div className={styles.card}>
        {userWasCreated ? <UserCreatedMessage /> : formElement}
        <SupportInfo supportInfo={supportInfo.SIGN_IN} />
      </div>
      <Button
        className={styles.linkButton}
        to={HOME_PAGE}
        icon={<Icon icon={icons.back} size={iconSize.medium} />}
        text="Go back to homepage"
        variant="text"
      />
    </div>
  );
};

export default observer(Signup);
