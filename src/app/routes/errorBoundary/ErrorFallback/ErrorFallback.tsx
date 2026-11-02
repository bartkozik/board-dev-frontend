import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/theme/button';
import styles from './ErrorFallback.module.scss';

interface ErrorFallbackProps {
  resetError: () => void;
}

function ErrorFallback({ resetError }: ErrorFallbackProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const reload = (): void => {
    setIsLoading(true);
    resetError();
    window.location.reload();
  };

  const backToMainPage = (): void => {
    navigate("/");
    resetError();
  };

  useEffect(() => {
    let loadingTimer: null | ReturnType<typeof setTimeout> = null;

    isLoading &&
      (() => {
        loadingTimer = setTimeout(() => {
          setIsLoading(false);
        }, 500);
      })();

    return () => {
      if (loadingTimer) clearTimeout(loadingTimer);
    };
  });

  return (
    <section className={styles.root}>
      <Button text="Back to main page" onClick={backToMainPage} className={styles.backButton} />
      <h2>Something went wrong!</h2>
      <Button text="Refresh the page" onClick={reload} loading={isLoading} />
    </section>
  );
}

export default ErrorFallback;
