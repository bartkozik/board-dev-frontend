import { useStores } from '@/RootStore';
import { UserRole } from '@/users/types';

interface UseUserRolesReturn {
  isAdmin: boolean;
  isTechLeader: boolean;
  isNPO: boolean;
  isTechLeaderOrNPO: boolean;
}

export const useUserRoles = (): UseUserRolesReturn => {
  const { authStore } = useStores();
  const { loggedInUser } = authStore;

  const roles = loggedInUser?.roles ?? [];

  const roleMapping: Record<string, UserRole> = {
    Admin: UserRole.Admin,
    TechLeader: UserRole.TechLeader,
    NPO: UserRole.NPO,
  };

  const mappedRoles = roles.map((role) => roleMapping[role]).filter((role): role is UserRole => !!role);

  const isAdmin = mappedRoles.includes(UserRole.Admin);
  const isTechLeader = mappedRoles.includes(UserRole.TechLeader);
  const isNPO = mappedRoles.includes(UserRole.NPO);
  const isTechLeaderOrNPO = isTechLeader || isNPO;

  return {
    isAdmin,
    isTechLeader,
    isNPO,
    isTechLeaderOrNPO,
  };
};
