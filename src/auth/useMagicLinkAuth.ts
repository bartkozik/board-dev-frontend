import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';

interface UseMagicLinkAuthReturn {
  errorMessage: string;
  reset: () => void;
}
const useMagicLinkAuth = (): UseMagicLinkAuthReturn => {
  const { authStore } = useStores();
  const { loginWithToken } = authStore;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const tokenFromUrl = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  const reset = (): void => {
    setErrorMessage('');
    navigate(routes.Login.path());
  };

  useEffect(() => {
    if (emailFromUrl && tokenFromUrl) {
      loginWithToken(emailFromUrl, tokenFromUrl).catch((error) => setErrorMessage(error));
    }
  }, [emailFromUrl, tokenFromUrl]);

  return {
    errorMessage,
    reset,
  };
};

export default useMagicLinkAuth;
