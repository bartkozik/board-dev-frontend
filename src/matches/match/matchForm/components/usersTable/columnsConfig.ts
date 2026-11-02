import { SortColumn } from '@/domain/sorting';
import { User, RawUserRole } from '@/users/types';
import { getUserFormData } from '@/utils/helpers';

export type ColumnItem = { label: string; getValue?: (user: User) => string | undefined; sortParam?: string };

type ColumnsWithFieldKeys = Record<string | SortColumn, ColumnItem[]>;

export const getFieldValue = (user: User, key: string): string | undefined => getUserFormData(user, key)?.value;

const mapMeetingLocation = (value?: string): string => {
  const mapping: Record<string, string> = {
    all_virtual: 'virtual',
    all_in_person: 'in-person',
    hybrid: 'hybrid',
    hybrid_one_in_person: 'hybrid',
  };
  return mapping[value || ''] || 'unknown';
};

const mapMeetingPreference = (value?: string): string => {
  const mapping: Record<string, string> = {
    both: 'hybrid',
    virtualOnly: 'virtual',
    inPersonOnly: 'in-person',
  };
  return mapping[value || ''] || 'unknown';
};

const mapDirectDonation = (value?: string): string => {
  const mapping: Record<string, string> = {
    none: 'No expectation',
    below_1k: '< $1,000',
    '1k_3k': '$1,000 - $3,000',
    '3k_5k': '$3,000 - $5,000',
    '5k_10k': '$5,000 - $10,000',
    '10k_15k': '$10,000 - $15,000',
    '15k_25k': '$15,000 - $25,000',
    above_25k: '> $25,000',
  };
  return mapping[value || ''] || 'unknown';
};

export const USER_ROLE_FIELD_MAPPINGS: ColumnsWithFieldKeys = {
  [RawUserRole.NPO]: [
    { label: SortColumn.NonProfit, getValue: (user) => user.name, sortParam: 'UserName' },
    {
      label: SortColumn.Company,
      getValue: (user) => user.corporateClientName || 'Public',
      sortParam: 'CorporateClientName',
    },
    {
      label: SortColumn.Location,
      getValue: (user) => getFieldValue(user, 'OrganizationHQCity'),
      sortParam: 'OrganizationHQCity',
    },
    {
      label: SortColumn.Meetings,
      getValue: (user) => mapMeetingLocation(getFieldValue(user, 'BoardMeetingLocation')),
      sortParam: 'BoardMeetingLocation',
    },
    {
      label: SortColumn.DirectDonation,
      getValue: (user) => mapDirectDonation(getFieldValue(user, 'BoardMemberDirectDonation')),
      sortParam: 'BoardMemberDirectDonation',
    },
    {
      label: SortColumn.Experience,
      getValue: (user) => (getFieldValue(user, 'NonprofitBoardExperienceRequirement') ? 'require' : 'not require'),
      sortParam: 'NonprofitBoardExperienceRequirement',
    },
    { label: '' },
  ],
  [RawUserRole.TechLeader]: [
    { label: SortColumn.TechLeader, sortParam: 'UserName' },
    {
      label: SortColumn.Company,
      getValue: (user) => user.corporateClientName || 'Public',
      sortParam: 'CorporateClientName',
    },
    { label: SortColumn.Location, getValue: (user) => getFieldValue(user, 'City'), sortParam: 'City' },
    {
      label: SortColumn.Meetings,
      getValue: (user) => mapMeetingPreference(getFieldValue(user, 'BoardMeetingPreference')),
      sortParam: 'BoardMeetingPreference',
    },
    {
      label: SortColumn.DirectDonation,
      getValue: (user) =>
        getFieldValue(user, 'FinancialContributionComfort') === 'yes' ? 'comfortable' : 'uncomfortable',
      sortParam: 'FinancialContributionComfort',
    },
    {
      label: SortColumn.Experience,
      getValue: (user) =>
        getFieldValue(user, 'PreviousNonprofitBoardExperience') === 'yes' ? 'has experience' : 'no experience',
      sortParam: 'PreviousNonprofitBoardExperience',
    },
    { label: '' },
  ],
};
