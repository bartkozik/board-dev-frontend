import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { TrainingMaterialsFormData, trainingMaterialsSchema } from '@/domain/zodSchemas';
import Checkbox from '@/theme/checkbox/Checkbox';
import TrainingMaterialsForm from '@/theme/trainingMaterialsForm';
import { EditUserParams } from '@/users/types';
import { useDebounce, useFormValidation } from '@/utils/hooks';

const UserTrainingMaterials = (): JSX.Element | null => {
  const { corporateClientStore, userStore } = useStores();
  const { selectedUser, updateUser } = userStore;
  const { fetchCorporateClient, corporateClient, loading, resetCorporateClient } = corporateClientStore;

  if (!selectedUser) return null;

  const areTrainingMaterialsEqual = selectedUser.trainingMaterialsUrl === corporateClient?.trainingMaterialsUrl;

  const { formMethods } = useFormValidation<TrainingMaterialsFormData>(
    trainingMaterialsSchema,
    {
      trainingMaterialsUrl: selectedUser.trainingMaterialsUrl || '',
      accessToTrainingMaterials: selectedUser.accessToTrainingMaterials,
      accessToCompanyTrainingMaterials: Boolean(corporateClient?.trainingMaterialsUrl) && areTrainingMaterialsEqual,
    },
    'onChange'
  );

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const watchedUrl = watch('trainingMaterialsUrl');
  const watchedAccess = watch('accessToTrainingMaterials');
  const watchedCompanyMaterialsAccess = watch('accessToCompanyTrainingMaterials');

  const debouncedUrl = useDebounce(watchedUrl, 900);

  const userDataUpdate = (
    data: Pick<EditUserParams, 'trainingMaterialsUrl' | 'accessToTrainingMaterials'>
  ): Promise<void> => {
    return updateUser({
      ...selectedUser,
      ...data,
    });
  };

  const handleCompanyMaterials = (): void => {
    if (corporateClient?.trainingMaterialsUrl)
      if (watchedCompanyMaterialsAccess) {
        if (!selectedUser.trainingMaterialsUrl || !areTrainingMaterialsEqual) {
          userDataUpdate({
            trainingMaterialsUrl: corporateClient?.trainingMaterialsUrl,
            accessToTrainingMaterials: true,
          });
        }

        setValue('trainingMaterialsUrl', corporateClient?.trainingMaterialsUrl || '');
        setValue('accessToTrainingMaterials', false);
      } else if (watchedAccess && watchedUrl && areTrainingMaterialsEqual && selectedUser.trainingMaterialsUrl !== '') {
        setValue('accessToCompanyTrainingMaterials', true);
        setValue('accessToTrainingMaterials', false);
      }
  };

  const handleUserMaterialsUpdate = (): void => {
    if (watchedAccess && !errors.trainingMaterialsUrl && !watchedCompanyMaterialsAccess) {
      const currentTrainingMaterials = selectedUser.trainingMaterialsUrl ?? '';

      if (debouncedUrl !== currentTrainingMaterials) {
        const trimmedUrl = debouncedUrl.trim();
        const isEmpty = trimmedUrl === '';

        if (isEmpty) setValue('accessToTrainingMaterials', false);

        userDataUpdate({
          trainingMaterialsUrl: trimmedUrl,
          accessToTrainingMaterials: !isEmpty,
        });
      }
    }
  };

  const handleClearUserTrainingMaterials = (): void => {
    if (selectedUser.trainingMaterialsUrl && !watchedAccess && !watchedCompanyMaterialsAccess && watchedUrl) {
      setValue('trainingMaterialsUrl', '');

      userDataUpdate({
        trainingMaterialsUrl: '',
        accessToTrainingMaterials: false,
      });
    }
  };

  useEffect(() => {
    if (selectedUser.corporateClientId) fetchCorporateClient(selectedUser.corporateClientId);
  }, [selectedUser, fetchCorporateClient]);

  useEffect(() => {
    handleCompanyMaterials();
  }, [watchedCompanyMaterialsAccess, watchedUrl, watchedAccess, corporateClient, setValue]);

  useEffect(() => {
    handleUserMaterialsUpdate();
  }, [
    watchedAccess,
    watchedUrl,
    debouncedUrl,
    errors,
    watchedCompanyMaterialsAccess,
    selectedUser,
    updateUser,
    setValue,
  ]);

  useEffect(() => {
    handleClearUserTrainingMaterials();
  }, [watchedAccess, watchedCompanyMaterialsAccess, watchedUrl, selectedUser, updateUser, setValue]);

  useEffect(() => {
    return () => {
      resetCorporateClient();
    };
  }, []);

  const dataChangeDisabled = watchedCompanyMaterialsAccess || !watchedAccess;

  return (
    <TrainingMaterialsForm
      title="You can provide training materials for the user here"
      formMethods={formMethods}
      loading={loading}
      dataChangeDisabled={dataChangeDisabled}
    >
      {corporateClient?.trainingMaterialsUrl && (
        <Checkbox
          label="Provide the user with available corporate training materials"
          {...register('accessToCompanyTrainingMaterials')}
          checked={watchedCompanyMaterialsAccess ?? false}
          onChange={() => {
            setValue('accessToCompanyTrainingMaterials', !watchedCompanyMaterialsAccess);
          }}
        />
      )}
      <Checkbox
        label="Provide the user with training materials"
        {...register('accessToTrainingMaterials')}
        checked={watchedAccess ?? false}
        disabled={Boolean(selectedUser.corporateClientId) && watchedCompanyMaterialsAccess}
        onChange={() => {
          setValue('accessToTrainingMaterials', !watchedAccess);
        }}
      />
    </TrainingMaterialsForm>
  );
};

export default observer(UserTrainingMaterials);
