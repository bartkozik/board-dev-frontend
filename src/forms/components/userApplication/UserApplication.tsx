import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { NPO_STEPS } from '@/forms/NPOform/npoFormConfig';
import { NpoChecklist } from '@/forms/NPOform/types';
import { TECH_LEADER_STEPS } from '@/forms/techLeaderForm/techLeaderFormConfig';
import { TechLeaderFormType } from '@/forms/techLeaderForm/types';
import { FormConfig } from '@/forms/types';
import Actions from '../actions';
import FormField from '../formField';

interface UserApplicationProps {
  config: FormConfig;
  formMethods: UseFormReturn;
  clearValidationErrors: (keys: string[]) => void;
  form: TechLeaderFormType | { [x: string]: string | number | boolean | NpoChecklist };
  isNpoForm: boolean;
  isUserConnectedWithDELL?: boolean;
}

const UserApplication = ({
  config,
  formMethods,
  clearValidationErrors,
  form,
  isNpoForm,
  isUserConnectedWithDELL = false,
}: UserApplicationProps): JSX.Element => {
  const { npoFormStore, techLeaderFormStore, formStore } = useStores();
  const { updateUserFormField } = formStore;
  const { updateForm: npoFormUpdate } = npoFormStore;
  const { updateForm: techLeaderFormUpdate } = techLeaderFormStore;
  const { formStep } = useParams();
  const activeStep = Number(formStep);

  const { getValues, control, reset } = formMethods;

  useEffect(() => {
    if (Object.keys(form).length > 0) {
      reset(form, {
        keepDirty: true,
        keepErrors: true,
        keepTouched: true,
      });
    }
  }, [form, reset]);

  const currentFormSetup = {
    config,
    formMethods,
    clearValidationErrors,
    isNpoForm: true,
  };

  const currentFormUpdate = isNpoForm ? npoFormUpdate : techLeaderFormUpdate;

  const currentFormSteps = isNpoForm ? NPO_STEPS : TECH_LEADER_STEPS;

  return (
    <div className="formStep">
      {config[activeStep].map((item) => (
        <FormField
          key={`${item.name}-${item.type}`}
          item={item}
          control={control}
          formSetup={currentFormSetup}
          activeStep={activeStep}
          getValues={getValues}
          clearValidationErrors={clearValidationErrors}
          updateForm={currentFormUpdate}
          updateUserFormField={updateUserFormField}
          //added for DELL users
          isDellUser={isUserConnectedWithDELL}
        />
      ))}
      <Actions stepCount={currentFormSteps.length} activeStep={activeStep} />
    </div>
  );
};

export default observer(UserApplication);
