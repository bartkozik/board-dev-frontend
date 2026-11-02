import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { z } from 'zod';
import { useStores } from '@/RootStore';
import { userFormSchema } from '@/domain/zodSchemas';
import Modal from '@/theme/modal';
import { RawUserRole, UserFormData } from '@/users/types';
import { useFormValidation } from '@/utils/hooks';
import CreateUserForm from '../../createUserForm';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddUserModal({ isOpen, onClose }: AddUserModalProps): JSX.Element {
  const { userStore, usersStore } = useStores();
  const { createUser, submitting } = userStore;
  const { checkIfEmailUnique } = usersStore;

  const { formMethods, resetValidation, clearValidationErrors } =
    useFormValidation<z.infer<typeof userFormSchema>>(userFormSchema);

  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
  } = formMethods;

  const onModalClose = (): void => {
    onClose();
    resetValidation();
  };

  const submit = handleSubmit(async (data) => {
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

    const userFormData: UserFormData = {
      email: data.email.trim(),
      name: data.organizationName || data.name,
      primaryContactFullName: isNonprofit ? data.name : undefined,
      roles: data.roles,
      corporateClientId: data.corporateClientId || undefined,
    };

    await createUser(userFormData);
    onModalClose();
  });

  return (
    <Modal close={onModalClose} isOpen={isOpen} title="Add user">
      <CreateUserForm
        className={clsx('modal-form')}
        register={register}
        errors={errors}
        clearValidationErrors={clearValidationErrors}
        userData={getValues()}
        onSubmit={submit}
        onCancel={onModalClose}
        submitting={submitting}
        submitButtonText="Create"
        onSelect={setValue}
      />
    </Modal>
  );
}

export default observer(AddUserModal);
