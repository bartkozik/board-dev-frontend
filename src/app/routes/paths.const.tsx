import { ReactNode } from 'react';
import Login from '@/auth/login';
import Signup from '@/auth/signup';
import { EditCorporateClient } from '@/corporateClients/corporateClient';
import CorporateClientBoard from '@/corporateClients/corporateClient/corporateClientBoard/';
import AddCorporateClientUser from '@/corporateClients/corporateClient/corporateClientBoard/addCorporateClientUser';
import CorporateClientsBoard from '@/corporateClients/corporateClients/corporateClientsBoard';
import Dashboard from '@/dashboard';
import { Form } from '@/forms';
import Comparing from '@/matches/comparing';
import { ComparisonSource } from '@/matches/comparing/Comparing';
import { Match } from '@/matches/match';
import MatchesBoard from '@/matches/matches/matchesBoard';
import AdminUserManagement from '@/users/user/adminUserManagement';
import EditUser from '@/users/user/editUser/';
import UsersBoard from '@/users/users/usersBoard';

export interface UserRoutes {
  list: () => string;
  details: (userId: string, tab: string) => string;
  edit: (userId: string) => string;
}

export const URL_PARAM = {
  tab: ':tab',
  userId: ':userId',
  compareIds: ':compareIds',
  companyName: ':companyName',
  comparisonId: ':comparisonId',
  formStep: ':formStep',
};

export const ADMIN_USER_MANAGEMENT_ROUTES = {
  usersList: {
    routes: {
      list: () => '/users/list',
      details: (userId: string, tab: string) => `/users/details/${userId}/${tab}`,
      edit: (userId: string) => `/users/details/edit/${userId}`,
    },
    breadcrumbs: [{ label: 'User list', route: 'Users', param: 'list' }],
  },
  readyToMatch: {
    routes: {
      list: () => '/users/readyToMatch',
      details: (userId: string, tab: string) => `/users/readyToMatch/details/${userId}/${tab}`,
      edit: (userId: string) => `/users/details/edit/${userId}`,
    },
    breadcrumbs: [{ label: 'Ready to match', route: 'Users', param: 'readyToMatch' }],
  },
};

export type Route = {
  path: (...args: string[]) => string;
  component: ReactNode;
};

export type Routes = Record<string, Route>;

export const routes: Routes = {
  CompareUsersFromNewMatch: {
    path: (userId: string, compareIds: string) => {
      return `/matches/new-match/comparing/${userId}/${compareIds}`;
    },
    component: <Comparing source={ComparisonSource.NewMatch} />,
  },
  SavedUsersComparison: {
    path: (comparisonId: string, userId: string, compareIds: string) => {
      return `/matches/inComparison/${comparisonId}/${userId}/${compareIds}`;
    },
    component: <Comparing source={ComparisonSource.Saved} />,
  },
  CorporateClients: {
    path: (tab?: string) => (tab ? `/companies/${tab}` : '/companies/list'),
    component: <CorporateClientsBoard />,
  },
  CorporateClient: {
    path: (id: string, tab: string) => `/companies/details/${id}/${tab}`,
    component: <CorporateClientBoard />,
  },
  CorporateClientEdit: {
    path: (id: string) => `/companies/details/edit/${id}`,
    component: <EditCorporateClient />,
  },
  CorporateClientAddUser: {
    path: (id: string, companyName: string) => `/companies/details/${id}/${companyName}/addUser`,
    component: <AddCorporateClientUser />,
  },
  Login: {
    path: () => '/login',
    component: <Login />,
  },
  Signup: {
    path: () => '/signup',
    component: <Signup />,
  },
  Dashboard: {
    path: () => `/dashboard`,
    component: <Dashboard />,
  },
  Form: {
    path: (formStep: string) => `/dashboard/form/${formStep}`,
    component: <Form />,
  },
  Users: {
    path: (tab: string) => `/users/${tab}`,
    component: <UsersBoard />,
  },
  User: {
    path: (userId: string, tab: string) => `/users/details/${userId}/${tab}`,
    component: (
      <AdminUserManagement
        breadcrumbs={ADMIN_USER_MANAGEMENT_ROUTES.usersList.breadcrumbs}
        userRoutes={ADMIN_USER_MANAGEMENT_ROUTES.usersList.routes}
      />
    ),
  },
  UserEdit: {
    path: (userId: string) => `/users/details/edit/${userId}`,
    component: <EditUser />,
  },
  Matches: {
    path: (tab: string) => `/matches/${tab}`,
    component: <MatchesBoard />,
  },
  NewMatch: {
    path: () => '/matches/new-match',
    component: <Match />,
  },
  Match: {
    path: () => '/matches/match',
    component: <Match />,
  },
  ReadyMatchDetails: {
    path: (userId: string, tab: string) => `/users/readyToMatch/details/${userId}/${tab}`,
    component: (
      <AdminUserManagement
        breadcrumbs={ADMIN_USER_MANAGEMENT_ROUTES.readyToMatch.breadcrumbs}
        userRoutes={ADMIN_USER_MANAGEMENT_ROUTES.readyToMatch.routes}
      />
    ),
  },
};
