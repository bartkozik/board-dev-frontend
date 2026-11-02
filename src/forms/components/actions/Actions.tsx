import { useNavigate } from 'react-router-dom';
import { routes } from '@/app/routes';
import Button from '@/theme/button';
import styles from './Actions.module.scss';

interface ActionsProps {
  activeStep: number;
  stepCount: number;
}

const Actions = ({ activeStep, stepCount }: ActionsProps): JSX.Element => {
  const navigate = useNavigate();

  const goToPreviousStep = (): void => navigate(routes.Form.path((activeStep - 1).toString()));
  const goToNextStep = (): void => navigate(routes.Form.path((activeStep + 1).toString()));

  return (
    <div className={styles.root}>
      {activeStep !== 1 && <Button onClick={goToPreviousStep} text="Previous step" variant="secondary" />}
      {stepCount !== activeStep && <Button onClick={goToNextStep} variant="primary" text="Next step" />}
    </div>
  );
};

export default Actions;
