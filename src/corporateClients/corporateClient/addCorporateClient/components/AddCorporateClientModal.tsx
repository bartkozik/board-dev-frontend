import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import { CorporateClient } from '@/corporateClients/types';
import { corporateClientFormSchema } from '@/domain/zodSchemas';
import Button from '@/theme/button';
import Input from '@/theme/input';
import Modal from '@/theme/modal';
import { useFormValidation } from '@/utils/hooks';
import styles from './AddCorporateClientModal.module.scss';

interface AddCorporateClientModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

function AddCorporateClientModal({ isOpen, closeModal }: AddCorporateClientModalProps): JSX.Element {
  const { corporateClientStore } = useStores();
  const { createCorporateClient, submitting } = corporateClientStore;

  const { formMethods, resetValidation, clearValidationErrors } = useFormValidation(corporateClientFormSchema);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const onModalClose = (): void => {
    closeModal();
    resetValidation();
  };

  const submit = handleSubmit(({ name }) => {
    const formData: Partial<CorporateClient> = {
      name,
    };
    createCorporateClient(formData).then(() => onModalClose());
  });

  return (
    <Modal close={onModalClose} isOpen={isOpen} title="Add company">
      <form onSubmit={submit} className={clsx('modal-form', styles.root)}>
        <Input
          label="Company name"
          placeholder="Enter company name"
          error={errors.name?.message || ''}
          {...register('name')}
          onChange={(e) => {
            clearValidationErrors(['name']);
            register('name').onChange(e);
          }}
          maxWidth
        />
        <div className={styles.actions}>
          <Button onClick={onModalClose} text="Cancel" variant="secondary" />
          <Button text="Create" loading={submitting} disabled={submitting} type="submit" />
        </div>
      </form>
    </Modal>
  );
}

export default observer(AddCorporateClientModal);
