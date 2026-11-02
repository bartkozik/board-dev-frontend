import { User, UserRole } from '@/users/types';

export const useStatus = (user: User | null, isMatched: boolean): string => {
  if (!user) return '';
  const statusNotCompleted =
    UserRole[user.roles[0]] === UserRole.NPO ? 'Please complete assessment' : 'Please complete intake form';

  if (!user.formCompleted) return statusNotCompleted;
  else if (user.formCompleted && !isMatched) return 'Waiting for a match';
  else if (user.formCompleted && isMatched) return 'Matched';
  else return '';
};
