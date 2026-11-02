import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { corporateClientFormSchema } from '@/domain/zodSchemas';
import Breadcrumbs from '@/theme/breadcrumbs';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import Input from '@/theme/input';
import LoadingArea from '@/theme/loadingArea';
import PageHeader from '@/theme/pageHeader';
import { useConfirmRemoveModal, useFormValidation } from '@/utils/hooks';
import styles from './EditCorporateClient.module.scss';

const EditCorporateClient = (): JSX.Element | null => {
  const navigate = useNavigate();
  const { userId: idFromParams } = useParams();
  const { corporateClientStore } = useStores();
  const { corporateClient, submitting, loading, updateCorporateClient, fetchCorporateClient, deleteCorporateClient } =
    corporateClientStore;
  const { openModal, confirmRemoveModal } = useConfirmRemoveModal({
    onConfirm: () =>
      corporateClient &&
      deleteCorporateClient(corporateClient.id).then(() => navigate(routes.CorporateClients.path('list'))),
    name: corporateClient?.name || 'this corporate client',
    submitting,
  });

  useEffect(() => {
    if (idFromParams) fetchCorporateClient(idFromParams);
  }, []);

  const { formMethods, resetValidation, clearValidationErrors } = useFormValidation(corporateClientFormSchema, {
    name: corporateClient?.name || '',
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  useEffect(() => {
    return () => {
      resetValidation();
    };
  }, []);

  const submit = handleSubmit(({ name }) => {
    if (!corporateClient) return;

    updateCorporateClient({ name }).then(() => navigate(routes.CorporateClients.path('list')));
  });

  const BREADCRUMBS = [
    { label: 'Companies', route: 'CorporateClients', param: 'list' },
    { label: `${corporateClient?.name || ''}`, route: 'CorporateClient', param: `${corporateClient?.id}` },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={BREADCRUMBS} className={styles.breadcrumbs} />
      <LoadingArea loading={loading} className={styles.loadingArea}>
        <PageHeader title="Edit company" className={styles.header} titleSize="large">
          <Button
            text="Remove company"
            onClick={() => openModal()}
            disabled={!corporateClient}
            variant="secondary"
            icon={<Icon icon={icons.remove} size={iconSize.medium} />}
          />
        </PageHeader>
        <div className={styles.details}>
          <form onSubmit={submit} className={clsx('modal-form', styles.form)}>
            <Input
              label="Company name"
              placeholder="Enter company name"
              error={errors.name?.message}
              {...register('name')}
              onChange={(e) => {
                clearValidationErrors(['name']);
                register('name').onChange(e);
              }}
              maxWidth
            />
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

export default observer(EditCorporateClient);
