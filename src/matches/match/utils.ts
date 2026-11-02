import { NonAdminUserRole, RawUserRole, UserRole } from '@/users/types';
import { NPO_USER_ID, TECH_LEADER_USER_ID } from '../constants';
import { MatchFormType, MatchUserKey, RawMatch } from '../types';

export const getAvailableRoles = (match: RawMatch | MatchFormType): NonAdminUserRole[] => {
  const isTechLeaderSet = match?.[TECH_LEADER_USER_ID];
  const isNpoSet = match?.[NPO_USER_ID];

  const roles = [...(!isTechLeaderSet ? [RawUserRole.TechLeader] : []), ...(!isNpoSet ? [RawUserRole.NPO] : [])];

  return roles as NonAdminUserRole[];
};

export const getKeyForName = (key: MatchUserKey): string => {
  return key.replace('Id', 'Name');
};

export const getUserRoleBasedOnMatch = (match: RawMatch | MatchFormType, userId: string): UserRole | undefined => {
  const isNPO = match.npoUserId === userId;
  const isTechLeader = match.techLeaderUserId === userId;

  if (isNPO) return UserRole.NPO;
  if (isTechLeader) return UserRole.TechLeader;
};
