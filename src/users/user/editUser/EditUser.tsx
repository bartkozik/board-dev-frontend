import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { userFormSchema } from '@/domain/zodSchemas';
import Breadcrumbs from '@/theme/breadcrumbs';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import Input from '@/theme/input';
import LoadingArea from '@/theme/loadingArea/';
import PageHeader from '@/theme/pageHeader';
import Select from '@/theme/select';
import { SelectOption } from '@/theme/select/Select';
import { RawUserRole, UserRole } from '@/users/types';
import { showErrorToast } from '@/utils/helpers';
import { useFormValidation, useConfirmRemoveModal, useUserMatch, useAvailableRoleOptions } from '@/utils/hooks';
import styles from './EditUser.module.scss';

const EditUser = (): JSX.Element | null => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const { corporateClientsStore, toastsStore, userStore, formStore } = useStores();
  const { fetchCorporateClients, corporateClientsSelectOptions, loading } = corporateClientsStore;
  const { selectedUser, submitting, updateUser, fetchUser, deleteUser } = userStore;
  const { removeUserForm } = formStore;
  const { toastMessages } = toastsStore;
  const { userMatchExists, loading: loadingMatches } = useUserMatch(selectedUser);

  const { openModal, confirmRemoveModal } = useConfirmRemoveModal({
    onConfirm: () => selectedUser && deleteUser(selectedUser.id).then(() => navigate(routes.Users.path('list'))),
    name: selectedUser?.name || 'this user',
    submitting,
  });

  const { formMethods, resetValidation, clearValidationErrors } = useFormValidation(userFormSchema);

  useEffect(() => {
    if (userId) fetchUser({ userId });
  }, [userId]);

  useEffect(() => {
    if (selectedUser) {
      const { name, email, primaryContactFullName, roles, corporateClientId } = selectedUser;
      const isNonprofit = roles[0] === RawUserRole.NPO;
      const defaultValues = {
        name: isNonprofit ? primaryContactFullName : name,
        email: email,
        organizationName: isNonprofit ? name : '',
        roles: roles,
        corporateClientId: corporateClientId || '',
      };

      formMethods.reset(defaultValues);
    }
  }, [selectedUser, formMethods]);

  useEffect(() => {
    fetchCorporateClients();

    return () => {
      resetValidation();
    };
  }, []);

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
  } = formMethods;

  const roleValue = watch('roles.0');
  const companyValue = watch('corporateClientId');

  const roleOptions = useAvailableRoleOptions({ withoutAdminRoles: Boolean(companyValue) });

  const disableCompanySelect = roleValue === UserRole.Admin;

  const submit = handleSubmit((data) => {
    if (!selectedUser) return;

    const companyId = data.corporateClientId || undefined;
    const roleIsDifferent = data.roles[0] !== selectedUser.roles[0];
    const formKeys = selectedUser.formattedFormData.map((field) => field.key);
    const isNonprofit = data.roles[0] === RawUserRole.NPO;
    updateUser({
      name: data.organizationName || data.name,
      primaryContactFullName: isNonprofit ? data.name : undefined,
      role: data.roles[0],
      corporateClientId: companyId,
      formCompleted: roleIsDifferent ? false : undefined,
    })
      .then(() => {
        roleIsDifferent && formKeys.length > 0 && removeUserForm(selectedUser.id, formKeys);
      })
      .catch((error) =>
        showErrorToast({ 404: toastMessages.USERS.NO_USER, default: toastMessages.USERS.UPDATE_ERROR }, error)
      )
      .finally(() => {
        navigate(routes.User.path(selectedUser.id));
      });
  });

  const BREADCRUMBS = [
    { label: 'User list', route: 'Users', param: 'list' },
    { label: `${selectedUser?.name}`, route: 'User', param: `${selectedUser?.id}` },
  ];

  if (!selectedUser) return null;

  const accountTypeElement = userMatchExists ? (
    <Input
      label="Account type"
      {...register('roles.0')}
      value={UserRole[roleValue]}
      readOnly
      tooltipText="Account type cannot be changed"
      maxWidth
    />
  ) : (
    <Select
      label="Account type"
      error={errors.roles?.[0]?.message}
      placeholder="Select user type"
      options={roleOptions}
      value={roleValue}
      {...register('roles.0')}
      onSelect={(option: SelectOption) => {
        clearValidationErrors(['roles']);
        setValue('roles.0', option.value as keyof typeof UserRole);
      }}
      maxWidth
    />
  );

  return (
    <>
      <Breadcrumbs breadcrumbs={BREADCRUMBS} className={styles.breadcrumbs} />
      <LoadingArea loading={submitting || loading || loadingMatches} className={styles.loadingArea}>
        <PageHeader title="Edit user" className={styles.header} titleSize="large">
          <Button
            text="Remove user"
            onClick={() => openModal()}
            disabled={!selectedUser}
            variant="secondary"
            icon={<Icon icon={icons.remove} size={iconSize.medium} />}
          />
        </PageHeader>
        <div className={styles.userDetails}>
          <form onSubmit={submit} className={clsx('modal-form', styles.form)}>
            <Input
              label="User full name"
              placeholder="Enter full name"
              error={errors.name?.message}
              {...register('name')}
              onChange={() => clearValidationErrors(['name'])}
              maxWidth
            />
            {roleValue === RawUserRole.NPO && (
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
              placeholder="Enter name"
              {...register('email')}
              readOnly
              tooltipText="Email address cannot be changed"
              maxWidth
            />
            <Select
              label="Company"
              placeholder="Select company (optional)"
              value={companyValue}
              options={corporateClientsSelectOptions}
              {...register('corporateClientId')}
              onSelect={(option: SelectOption) => {
                setValue('corporateClientId', option.value);
              }}
              maxWidth
              disabled={disableCompanySelect}
            />
            {accountTypeElement}
            <Button
              className={styles.submitButton}
              text="Save changes"
              loading={submitting}
              disabled={submitting}
              type="submit"
            />
          </form>
        </div>
      </LoadingArea>
      {confirmRemoveModal}
    </>
  );
};

export default observer(EditUser);
