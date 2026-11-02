import { BrowserRouter, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import env from '@/domain/env';
import { useUserContext } from '@/utils/hooks';
import ScrollToTop from './ScrollToTop';
import ErrorBoundary from './errorBoundary';

const Router = (): JSX.Element => {
  const { availableRoutes } = useUserContext();

  return (
    <BrowserRouter basename={env.publicUrl}>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>{availableRoutes}</Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default observer(Router);
