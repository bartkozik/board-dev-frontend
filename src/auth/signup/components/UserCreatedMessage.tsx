import React from 'react';
import styles from '../Signup.module.scss';

const UserCreatedMessage = (): React.JSX.Element => (
  <div className={styles.messageContainer}>
    <div className={styles.message}>
      <p>Your account has been successfully created.</p>
      <p>Check your email inbox.</p>
    </div>
  </div>
);

export default UserCreatedMessage;
