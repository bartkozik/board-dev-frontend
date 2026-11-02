import React from 'react';
import styles from '../Login.module.scss';

interface EmailSentMessageProps {
  email: string;
}

const EmailSentMessage = ({ email }: EmailSentMessageProps): React.JSX.Element => (
  <div className={styles.messageContainer}>
    <div className={styles.message}>
      <p>
        If your account exists in the system, you'll receive an email at <span className={styles.email}>{email}</span>
      </p>
      <p>Please click on the link you find in your inbox.</p>
    </div>
  </div>
);

export default EmailSentMessage;
