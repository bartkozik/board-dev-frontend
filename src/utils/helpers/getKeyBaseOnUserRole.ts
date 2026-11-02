import { MatchUserKey } from '@/matches/types';
import { RawUserRole, UserRole } from '@/users/types';

export const getKeyBaseOnUserRole = (role: RawUserRole): MatchUserKey => {
  return UserRole[role] === UserRole.NPO ? 'npoUserId' : 'techLeaderUserId';
};
