import React from 'react';
import Button from '@/theme/button';
import styles from './Confirm.module.scss';

type ConfirmProps = {
  action: () => void;
  close: () => void;
  question: string | React.ReactNode;
  submitting?: boolean;
  yesText?: string;
};

const Confirm = ({ action, close, question, submitting, yesText = 'Yes' }: ConfirmProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <p>{question}</p>
      <div className={styles.btnContainer}>
        <Button variant="secondary" text="Cancel" onClick={close} disabled={submitting} />
        <Button text={yesText} onClick={action} loading={submitting} disabled={submitting} />
      </div>
    </div>
  );
};

export default Confirm;
