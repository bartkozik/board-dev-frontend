import { NonAdminUserRole, RawUserRole } from '@/users/types';
import { FILTERS_CONFIG } from './match/matchForm/components/filterPanel/filterBaseOnRole';
import { MatchFormType, MatchUserKey } from './types';

export const TECH_LEADER_USER_ID = 'techLeaderUserId' as const;
export const NPO_USER_ID = 'npoUserId' as const;

export const USERS_TO_MATCH_KEYS: MatchUserKey[] = [TECH_LEADER_USER_ID, NPO_USER_ID];

export const MATCH_FORM_KEYS = [...USERS_TO_MATCH_KEYS, 'shortSummary', 'longSummary'] as const;

export const MATCH_INITIAL = MATCH_FORM_KEYS.reduce((acc, key) => {
  return { ...acc, [key]: '' };
}, {} as MatchFormType);

export const SORT_BY_FORM_ANSWER_KEYS = [
  'OrganizationHQCity',
  'BoardMeetingLocation',
  'BoardMemberDirectDonation',
  'NonprofitBoardExperienceRequirement',
  'City',
  'BoardMeetingPreference',
  'FinancialContributionComfort',
  'PriorExperienceOrConnection',
];

export const FILTER_KEYS_BY_ROLE: Record<NonAdminUserRole, string[]> = {
  [RawUserRole.TechLeader]: FILTERS_CONFIG[RawUserRole.TechLeader].map((f) => f.formKey),
  [RawUserRole.NPO]: FILTERS_CONFIG[RawUserRole.NPO].map((f) => f.formKey),
};
