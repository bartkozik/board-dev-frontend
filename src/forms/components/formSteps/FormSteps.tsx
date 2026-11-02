import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from '@/app/routes';
import styles from './FormSteps.module.scss';

interface FormStepsItemProps {
  stepIndex: number;
  validation: Record<number, boolean>;
  active: number;
  label: string;
  withSeparator: boolean;
  stepsToValidate: string[];
}

const FormStepsItem = ({
  stepIndex,
  validation,
  active,
  label,
  withSeparator,
  stepsToValidate,
}: FormStepsItemProps): JSX.Element => {
  const stepNumber = stepIndex + 1;
  const isValid = stepsToValidate.includes(stepNumber.toString()) ? validation[stepNumber] : true;
  const isCurrentStepActive = stepNumber === active;
  const navigate = useNavigate();

  const goToStep = (): void => {
    if (!isCurrentStepActive) navigate(routes.Form.path(stepNumber.toString()));
  };

  return (
    <div className={clsx(styles.formStep, { [styles.notActiveStep]: !isCurrentStepActive })} onClick={goToStep}>
      <div className={clsx(styles.headline, { [styles.selected]: isCurrentStepActive, [styles.error]: !isValid })}>
        <span className={styles.stepNumber}>{stepNumber}</span>
        {label}
      </div>
      {withSeparator && (
        <div className={styles.separatorContainer}>
          <div className={styles.separator} />
        </div>
      )}
    </div>
  );
};

type FormStepsProps = {
  labels: string[];
  activeStep: number;
  progressPercent: number;
  stepsValidation: Record<number, boolean>;
  stepsToValidate: string[];
};

const FormSteps = ({
  labels,
  activeStep,
  progressPercent,
  stepsValidation,
  stepsToValidate,
}: FormStepsProps): JSX.Element => {
  return (
    <div className={styles.root} style={{ '--progress-width': `${progressPercent}%` } as React.CSSProperties}>
      {labels.map((label, i) => (
        <FormStepsItem
          key={i}
          stepIndex={i}
          validation={stepsValidation}
          stepsToValidate={stepsToValidate}
          active={activeStep}
          label={label}
          withSeparator={i !== labels.length - 1}
        />
      ))}

      <span className={clsx(styles.percentage, { [styles.percentageUnderProgress]: progressPercent >= 90 })}>
        {Math.round(progressPercent)}% completed
      </span>
    </div>
  );
};

export default FormSteps;
