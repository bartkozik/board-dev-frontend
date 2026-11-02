import { routes } from '@/app/routes';
import styles from './MessageAfterCompleted.module.scss';

interface MessageAfterCompletedProps {
  isCompleted: boolean;
  previousPath?: string;
}
const MessageAfterCompleted = ({ isCompleted, previousPath }: MessageAfterCompletedProps): JSX.Element => {
  if (!isCompleted || !previousPath?.startsWith(routes.Form.path())) {
    return <></>;
  }

  return (
    <div className={styles.root}>
      Thank you for submitting the assessment.
      <br />
      We're reviewing your responses now.
    </div>
  );
};

export default MessageAfterCompleted;
