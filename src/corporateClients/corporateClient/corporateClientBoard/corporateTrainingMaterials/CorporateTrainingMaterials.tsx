import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { TrainingMaterialsFormData, trainingMaterialsSchema } from '@/domain/zodSchemas';
import TrainingMaterialsForm from '@/theme/trainingMaterialsForm/TrainingMaterialsForm';
import { useDebounce, useFormValidation } from '@/utils/hooks';

const FORM_SUBTITLE =
  'Training materials can be added here for all users connected to this company. They will be displayed as default if no individual materials are assigned to a user.';

const CorporateTrainingMaterials = (): JSX.Element => {
  const { corporateClientStore } = useStores();
  const { corporateClient, updateCorporateClient } = corporateClientStore;

  const { formMethods } = useFormValidation<TrainingMaterialsFormData>(
    trainingMaterialsSchema,
    {
      trainingMaterialsUrl: corporateClient?.trainingMaterialsUrl || '',
    },
    'onChange'
  );

  const {
    watch,
    formState: { errors },
  } = formMethods;

  const watchedUrl = watch('trainingMaterialsUrl');
  const debouncedUrl = useDebounce(watchedUrl, 900);

  useEffect(() => {
    if (
      debouncedUrl !== undefined &&
      debouncedUrl.trim() !== (corporateClient?.trainingMaterialsUrl ?? '') &&
      !errors.trainingMaterialsUrl
    )
      updateCorporateClient({
        ...corporateClient,
        trainingMaterialsUrl: debouncedUrl.trim(),
      });
  }, [debouncedUrl, errors, corporateClient, updateCorporateClient]);

  return (
    <TrainingMaterialsForm
      title="You can provide users with training materials here"
      subtitle={FORM_SUBTITLE}
      formMethods={formMethods}
    />
  );
};

export default observer(CorporateTrainingMaterials);
