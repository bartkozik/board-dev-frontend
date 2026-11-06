import { SelectOption } from '@/theme/select';
import { UserRole } from '@/users/types';

interface UseAvailableRoleOptionsProps {
  withoutAdminRoles?: boolean;
}

export const useAvailableRoleOptions = ({
  withoutAdminRoles = false,
}: UseAvailableRoleOptionsProps): SelectOption[] => {
  return Object.entries(UserRole)
    .filter(([role]) => !(withoutAdminRoles && role === UserRole.Admin))
    .map(([role, label]) => ({
      value: role,
      label,
    }));
};
