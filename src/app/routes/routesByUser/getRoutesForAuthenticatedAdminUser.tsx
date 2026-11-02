import { ReactElement } from 'react';
import { Navigate, Route } from 'react-router-dom';
import Layout from '@/layout';
import { routes, URL_PARAM } from '../paths.const';

export const getRoutesForAuthenticatedAdminUser = (): ReactElement => {
  return (
    <Route element={<Layout />}>
      <Route
        path={routes.CorporateClient.path(URL_PARAM.userId, URL_PARAM.tab)}
        element={routes.CorporateClient.component}
      />
      <Route path={routes.CorporateClientEdit.path(URL_PARAM.userId)} element={routes.CorporateClientEdit.component} />
      <Route
        path={routes.CorporateClientAddUser.path(URL_PARAM.userId, URL_PARAM.companyName)}
        element={routes.CorporateClientAddUser.component}
      />
      <Route path={routes.CorporateClients.path(URL_PARAM.tab)} element={routes.CorporateClients.component} />
      <Route path={routes.Users.path(URL_PARAM.tab)} element={routes.Users.component} />
      <Route path={routes.User.path(URL_PARAM.userId, URL_PARAM.tab)} element={routes.User.component} />
      <Route path={routes.UserEdit.path(URL_PARAM.userId)} element={routes.UserEdit.component} />
      <Route path={routes.Matches.path(URL_PARAM.tab)} element={routes.Matches.component} />
      <Route path={routes.NewMatch.path(URL_PARAM.userId)} element={routes.NewMatch.component} />
      <Route
        path={routes.CompareUsersFromNewMatch.path(URL_PARAM.userId, URL_PARAM.compareIds)}
        element={routes.CompareUsersFromNewMatch.component}
      />
      <Route
        path={routes.SavedUsersComparison.path(URL_PARAM.comparisonId, URL_PARAM.userId, URL_PARAM.compareIds)}
        element={routes.SavedUsersComparison.component}
      />
      <Route path={routes.Match.path()} element={routes.Match.component} />
      <Route
        path={routes.ReadyMatchDetails.path(URL_PARAM.userId, URL_PARAM.tab)}
        element={routes.ReadyMatchDetails.component}
      />
      <Route path="*" element={<Navigate to={routes.Users.path('list')} replace />} />
    </Route>
  );
};
