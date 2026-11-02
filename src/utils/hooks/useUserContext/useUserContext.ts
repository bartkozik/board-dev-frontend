/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { useStores } from '@/RootStore';
import {
  getRoutesForAuthenticatedAdminUser,
  getRoutesForAuthenticatedUser,
  getRoutesForUnauthenticatedUser,
} from '@/app/routes/routesByUser';
import { useUserRoles } from '../useUserRoles/useUserRoles';

type UseUserContextReturn = {
  availableRoutes: ReactNode;
};

export const useUserContext = (): UseUserContextReturn => {
  const {
    authStore: { isAuthenticated },
  } = useStores();
  const { isAdmin } = useUserRoles();

  function getAvailableRoutes(): ReactNode | null {
    if (!isAuthenticated) return getRoutesForUnauthenticatedUser();
    if (isAuthenticated && !isAdmin) return getRoutesForAuthenticatedUser();
    if (isAdmin) return getRoutesForAuthenticatedAdminUser();
  }

  return {
    availableRoutes: getAvailableRoutes(),
  };
};
