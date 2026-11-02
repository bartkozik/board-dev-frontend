import { Tooltip } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import Button from '@/theme/button';
import LoadingArea from '@/theme/loadingArea';
import { RawUserRole } from '@/users/types';
import { generateValidationMessage } from '@/utils/helpers';
import { useFormValidation, useUserRoles, useGenerateFormConfig } from '@/utils/hooks';
import styles from './Form.module.scss';
import { EstimatedTime, FormSteps, UserApplication } from './components';

const hasVisitedPageOne = (pages: string[], threshold = 1): boolean =>
  pages.filter((page) => page === '1').length >= threshold;

const Form = (): JSX.Element | null => {
  const { userStore, formStore, corporateClientStore } = useStores();
  const { selectedUser } = userStore;
  const { customQuestions } = corporateClientStore;
  const {
    submitting,
    visitedPages,
    loadingForm,
    formCompletionDetails,
    formHasChanges,
    fetchUserForm,
    updateVisitedPages,
    markUserFormAsCompleted,
    markUserFormAsIncomplete,
  } = formStore;

  const { isNPO } = useUserRoles();
  const navigate = useNavigate();

  const { formStep } = useParams<{ formStep: string }>();
  const activeStep = Number(formStep);

  if (!selectedUser) return null;

  const { formConfig, steps, schema, form, estimatedTime } = useGenerateFormConfig(
    customQuestions,
    selectedUser.roles[0]
  );

  const isFirstStep = activeStep === 1;
  const isActiveStepInVisitedPages = visitedPages.includes(activeStep.toString());

  const shouldValidateFormStep = !isFirstStep && isActiveStepInVisitedPages;

  const shouldValidateFirstFormStep =
    (isFirstStep && hasVisitedPageOne(visitedPages, 2)) || hasVisitedPageOne(selectedUser.visitedPages, 1);

  useEffect(() => {
    fetchUserForm({ isNpoUser: isNPO });
  }, [activeStep]);

  useEffect(() => {
    if (!isActiveStepInVisitedPages) updateVisitedPages(selectedUser.id, activeStep.toString());
  }, [activeStep, visitedPages]);

  const { formMethods, clearValidationErrors } = useFormValidation(schema, form, 'onSubmit');

  const {
    trigger,
    formState: { isValid: formIsValid },
  } = formMethods;

  const { formCompletion, stepsValidation } = formCompletionDetails;

  useEffect(() => {
    if (shouldValidateFormStep || shouldValidateFirstFormStep) trigger();
    else clearValidationErrors();
  }, [shouldValidateFormStep, shouldValidateFirstFormStep, activeStep]);

  useEffect(() => {
    if (selectedUser.formCompleted && (formCompletion < 100 || (formHasChanges && formCompletion === 100)))
      markUserFormAsIncomplete();
  }, [formHasChanges, formCompletion, selectedUser.formCompleted]);

  useEffect(() => {
    if (formCompletion === 100 && !formIsValid) {
      trigger();
    }
  }, [formCompletion, formIsValid]);

  const submitForm = (e: React.FormEvent): void => {
    e.preventDefault();
    markUserFormAsCompleted(isNPO ? RawUserRole.NPO : RawUserRole.TechLeader).then(() =>
      navigate(routes.Dashboard.path(), { state: { previous: routes.Form.path() } })
    );
  };

  const isFormIncompleted = formCompletion !== 100;

  return (
    <LoadingArea loading={loadingForm}>
      <div className={styles.root}>
        <EstimatedTime timeInMinutes={estimatedTime} formName={isNPO ? 'assessment' : 'form'} />
        <form className={styles.form} onSubmit={submitForm}>
          <FormSteps
            labels={steps.map(({ label }) => label)}
            activeStep={activeStep}
            progressPercent={formCompletion}
            stepsValidation={stepsValidation}
            stepsToValidate={visitedPages}
          />
          <div className={styles.content}>
            <div className={styles.leftSideContent}>
              <h2 className={styles.title}>{steps[activeStep - 1].label}</h2>
              <span className={styles.subtitle}>{steps[activeStep - 1].description}</span>
            </div>
            <div className={styles.rightSideContent}>
              <UserApplication
                config={formConfig}
                formMethods={formMethods}
                clearValidationErrors={clearValidationErrors}
                form={form}
                isNpoForm={isNPO}
                isUserConnectedWithDELL={selectedUser.isConnectedWithDellCompany}
              />
            </div>
          </div>
          <div className={styles.footer}>
            {isFormIncompleted && (
              <div className={styles.warning}>Before submitting, please complete all required fields.</div>
            )}
            <Tooltip
              events={{ hover: isFormIncompleted, focus: isFormIncompleted, touch: false }}
              arrowPosition="side"
              classNames={{ tooltip: styles.tooltip }}
              label={generateValidationMessage({
                validation: stepsValidation,
                message: 'You are missing answers from page',
              })}
              withArrow
              position="top-end"
              offset={{ mainAxis: 10, crossAxis: -75 }}
              arrowOffset={50}
              arrowSize={5}
              multiline
              w={155}
            >
              <Button
                variant="primary"
                text="Submit"
                type="submit"
                disabled={isFormIncompleted || submitting}
                className={styles.submit}
                loading={submitting}
              />
            </Tooltip>
          </div>
        </form>
      </div>
    </LoadingArea>
  );
};

export default observer(Form);
