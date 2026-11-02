import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { z } from 'zod';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { userFormSchema } from '@/domain/zodSchemas';
import Breadcrumbs from '@/theme/breadcrumbs';
import Button from '@/theme/button';
import LoadingArea from '@/theme/loadingArea';
import PageHeader from '@/theme/pageHeader';
import RadioGroup from '@/theme/radioGroup/';
import Select, { SelectOption } from '@/theme/select';
import { RawUserRole, User, UserRole } from '@/users/types';
import CreateUserForm from '@/users/user/createUserForm';
import { useFormValidation } from '@/utils/hooks';
import styles from './AddCorporateClientUser.module.scss';

enum UserAddOptions {
  CreateAndAddNewUser = 'create_new_user',
  AddFromExistingUser = 'from_existing_user',
}

const USER_ADD_OPTIONS = [
  {
    value: UserAddOptions.CreateAndAddNewUser,
    label: 'Create and add new user',
  },
  {
    value: UserAddOptions.AddFromExistingUser,
    label: 'Add from existing user',
  },
];

function AddCorporateClientUser(): JSX.Element {
  const { userId: corporateClientId, companyName } = useParams();
  const navigate = useNavigate();

  const { userStore, usersStore } = useStores();
  const { usersWithoutCompany, fetchUsers, checkIfEmailUnique } = usersStore;
  const { createUser, updateUser, submitting, selectedUser, setSelectedUserById } = userStore;

  const [assignUserMethod, setAssignUserMethod] = useState('create_new_user');
  const [userFromSelect, setUserFromSelect] = useState<User | null>(null);

  const { formMethods, resetValidation, clearValidationErrors } = useFormValidation(userFormSchema);

  const isAssigningMethodFromExistingUser = assignUserMethod === 'from_existing_user';
  const submitButtonAndPageLabel = isAssigningMethodFromExistingUser ? 'Assign user' : 'Add user';

  useEffect(() => {
    fetchUsers({
      phrase: undefined,
      pageSize: 200,
    });
  }, []);

  useEffect(() => {
    setSelectedUserById(userFromSelect?.id || '');
  }, [userFromSelect]);

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
    setError,
  } = formMethods;

  const handleRadioChange = (value: string): void => {
    setAssignUserMethod(value);
    clearValidationErrors(['email', 'name', 'roles']);
  };

  const handleSelectChange = (option: SelectOption): void => {
    const selectedUser = usersWithoutCompany.find((u) => u.id === option.value);
    if (selectedUser) setUserFromSelect(selectedUser);
  };

  const handleSubmissionComplete = (): void => {
    resetValidation();
    corporateClientId && navigate(routes.CorporateClient.path(corporateClientId));
  };

  const submitIfCreated = handleSubmit(async (data: z.infer<typeof userFormSchema>) => {
    const isEmailUnique = await checkIfEmailUnique(data.email.trim());
    const role = data.roles[0];
    const isNonprofit = role === RawUserRole.NPO;

    if (!isEmailUnique) {
      setError('email', {
        type: 'custom',
        message: 'There is already a user with this email. Email must be unique.',
      });
      return;
    }

    const userFormData = {
      email: data.email.trim(),
      name: data.organizationName || data.name,
      primaryContactFullName: isNonprofit ? data.name : undefined,
      roles: data.roles,
      corporateClientId,
    };
    await createUser(userFormData).then(handleSubmissionComplete);
  });

  const submitIfUpdated = (event: React.FormEvent): void => {
    event.preventDefault();
    if (selectedUser?.id === userFromSelect?.id) updateUser({ corporateClientId }).then(handleSubmissionComplete);
  };

  const submit = isAssigningMethodFromExistingUser ? submitIfUpdated : submitIfCreated;

  const BREADCRUMBS = [
    { label: 'Companies', route: 'CorporateClients', param: 'list' },
    { label: `${companyName}`, route: 'CorporateClient', param: `${corporateClientId}` },
  ];

  const assignUserFromExisting = (
    <form onSubmit={submit} className={clsx('modal-form', styles.form)}>
      <Select
        name="userId"
        label="Available users"
        options={usersWithoutCompany.map((user) => ({
          value: user.id,
          label: user.name,
        }))}
        placeholder="Select user"
        value={userFromSelect?.id}
        onSelect={handleSelectChange}
        className={styles.select}
      />
      <div className={styles.actions}>
        <Button text={submitButtonAndPageLabel} loading={submitting} disabled={submitting} type="submit" />
      </div>
    </form>
  );

  const addingNewUser = (
    <CreateUserForm
      className={styles.createUserForm}
      register={register}
      errors={errors}
      clearValidationErrors={clearValidationErrors}
      onSubmit={submit}
      submitting={submitting}
      submitButtonText={submitButtonAndPageLabel}
      userData={{
        email: getValues('email'),
        name: getValues('name'),
        organizationName: getValues('organizationName'),
        roles: getValues('roles') as (keyof typeof UserRole)[],
        corporateClientId,
      }}
      onSelect={setValue}
      isCompanySelectorDisabled
    />
  );

  return (
    <div>
      <Breadcrumbs breadcrumbs={BREADCRUMBS} className={styles.breadcrumbs} />
      <LoadingArea loading={submitting} className={styles.loadingArea}>
        <PageHeader title={submitButtonAndPageLabel} className={styles.header} titleSize="large" />
        <div className={styles.userDetails}>
          <RadioGroup
            name="select-user-type"
            groupLabel="Choose how you want to add a user"
            options={USER_ADD_OPTIONS}
            onChange={handleRadioChange}
            selectedValue={assignUserMethod}
          />
          {isAssigningMethodFromExistingUser ? assignUserFromExisting : addingNewUser}
        </div>
      </LoadingArea>
    </div>
  );
}

export default observer(AddCorporateClientUser);
