import { ReactElement } from 'react';
import { Navigate, Route } from 'react-router-dom';
import Layout from '@/layout';
import { routes, URL_PARAM } from '../paths.const';

export const getRoutesForAuthenticatedUser = (): ReactElement => {
  return (
    <Route element={<Layout />}>
      <Route path={routes.Dashboard.path()} element={routes.Dashboard.component}>
        <Route path={routes.Form.path(URL_PARAM.formStep)} element={routes.Form.component} />
      </Route>

      <Route path="*" element={<Navigate to={routes.Dashboard.path()} replace />} />
    </Route>
  );
};
