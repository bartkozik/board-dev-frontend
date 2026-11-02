import styles from './EstimatedTime.module.scss';

interface EstimatedTimeProps {
  timeInMinutes: number;
  formName: string;
}

const EstimatedTime = ({ timeInMinutes, formName }: EstimatedTimeProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <p>
        Estimated time to complete the {formName}: {timeInMinutes} minutes
      </p>
      <p>Your responses are automatically saved. You can complete the form in any order.</p>
    </div>
  );
};

export default EstimatedTime;
