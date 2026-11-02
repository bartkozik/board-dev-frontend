import { ReactElement } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { routes } from '../paths.const';

export const getRoutesForUnauthenticatedUser = (): ReactElement => {
  return (
    <>
      <Route path={routes.Login.path()} element={routes.Login.component} />
      <Route path={routes.Signup.path()} element={routes.Signup.component} />
      <Route path="*" element={<Navigate to={routes.Login.path()} replace />} />
    </>
  );
};
