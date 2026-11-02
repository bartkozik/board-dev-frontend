import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { z } from 'zod';
import { useStores } from '@/RootStore';
import { formValidationMessages } from '@/domain/formValidationMessages';
import { supportInfo } from '@/domain/supportInfo';
import Button from '@/theme/button';
import Input from '@/theme/input';
import PageHeader from '@/theme/pageHeader';
import SupportInfo from '@/theme/supportInfo';
import { useFormValidation } from '@/utils/hooks';
import styles from '../Login.module.scss';
import EmailSentMessage from './EmailSentMessage';

interface LoginFormProps {
  setEmailSent: (value: boolean) => void;
  emailSent: boolean;
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: formValidationMessages.EMAIL_REQUIRED })
    .email({ message: formValidationMessages.EMAIL_INVALID }),
});

const LoginForm = observer(({ setEmailSent, emailSent }: LoginFormProps): React.JSX.Element => {
  const { authStore } = useStores();
  const { sendEmailWithMagicLink, submitting } = authStore;
  const { formMethods, clearValidationErrors } = useFormValidation(loginSchema, { email: '' });
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = formMethods;

  useEffect(() => {
    !emailSent && setValue('email', '');
  }, [emailSent]);

  const onSubmit = handleSubmit(({ email }) => {
    sendEmailWithMagicLink(email.trim())
      .then((success) => {
        if (success) setEmailSent(true);
      })
      .catch(() => setEmailSent(false));
  });

  const email = getValues('email');

  if (emailSent) {
    return (
      <>
        <EmailSentMessage email={email} />
        <SupportInfo supportInfo={supportInfo.CONTACT} />
      </>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <PageHeader title="Sign in" />
        <Input
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
          autoFocus
          onChange={(e) => {
            clearValidationErrors(['email']);
            register('email').onChange(e);
          }}
        />
        <Button text="Sign in" loading={submitting} disabled={submitting} type="submit" maxWidth />
      </form>
      <SupportInfo supportInfo={supportInfo.SIGN_UP} />
    </>
  );
});

export default LoginForm;
