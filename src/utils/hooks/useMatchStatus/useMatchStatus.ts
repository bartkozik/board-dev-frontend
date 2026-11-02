import { User } from '@/users/types';

export const useMatchStatus = (user: User | null): string => {
  if (!user) return '';
  else if (!user.formCompleted) return 'Incomplete profile';
  else if (user.formCompleted) return 'Waiting for a match';
  else if (user.match) return 'Matched';
  else return '';
};
