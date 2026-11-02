import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { HOME_PAGE } from '@/domain/constants';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import Loader from '@/theme/loader';
import Logo from '@/theme/logo';
import { useTitle } from '@/utils/hooks';
import useMagicLinkAuth from '../useMagicLinkAuth';
import styles from './Login.module.scss';
import { InvalidTokenMessage } from './components';
import LoginForm from './components/LoginForm';

const Login = (): React.JSX.Element => {
  const { authStore } = useStores();
  const { submittingLogin } = authStore;
  const { errorMessage, reset } = useMagicLinkAuth();
  const [emailSent, setEmailSent] = useState(false);
  const isFormPage = !submittingLogin && !errorMessage;

  useTitle('Login');

  const backToHomepage = (): void => {
    setEmailSent(false);
  };

  return (
    <div className={styles.root}>
      <Logo withoutRedirect size="small" />
      <div className={styles.card}>
        <Loader loading={submittingLogin} className={styles.loader} />
        {isFormPage && <LoginForm setEmailSent={setEmailSent} emailSent={emailSent} />}
        {errorMessage && <InvalidTokenMessage errorMessage={errorMessage} />}
      </div>

      <Button
        className={styles.linkButton}
        onClick={errorMessage ? reset : backToHomepage}
        externalHref={errorMessage ? undefined : HOME_PAGE}
        icon={<Icon icon={icons.back} size={iconSize.medium} />}
        text={errorMessage ? 'Try again' : 'Go back to homepage'}
        variant="text"
      />
    </div>
  );
};

export default observer(Login);
