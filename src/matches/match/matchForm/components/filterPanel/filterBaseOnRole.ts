import { NPO_FORM_OPTIONS } from '@/forms/NPOform/npoFormConfig';
import { COMMON_FOCUS_AREAS } from '@/forms/constants';
import { TECH_LEADER_FORM_OPTIONS } from '@/forms/techLeaderForm/techLeaderFormConfig';
import { FilterType, FilterKind, FilterOption } from '@/matches/types';
import { NonAdminUserRole, RawUserRole } from '@/users/types';

const mapOptions = (options: { value: string; label: string }[]): FilterOption[] =>
  options.map((f) => ({ key: f.value, label: f.label }));

export const FILTERS_CONFIG: Record<NonAdminUserRole, FilterType[]> = {
  [RawUserRole.TechLeader]: [
    { label: 'Location (city):', type: FilterKind.Chips, withSearch: true, formKey: 'City' },
    { label: 'Company:', type: FilterKind.Chips, formKey: 'Company', options: [] },
    {
      label: 'Position of responsibility:',
      type: FilterKind.Chips,
      formKey: 'PositionOfResponsibility',
      options: mapOptions(TECH_LEADER_FORM_OPTIONS.positionOfResponsibility),
    },
    {
      label: 'Professional experience:',
      type: FilterKind.Checklist,
      formKey: 'YearsOfExperience',
      options: mapOptions(TECH_LEADER_FORM_OPTIONS.yearsOfExperience),
    },
    {
      label: 'Technology expertise:',
      type: FilterKind.Chips,
      formKey: 'TechExpertiseAreas',
      options: TECH_LEADER_FORM_OPTIONS.techExpertiseAreas,
    },
    {
      label: 'Organization type:',
      type: FilterKind.Chips,
      formKey: 'OrganizationExperienceTypes',
      options: TECH_LEADER_FORM_OPTIONS.organizationExperienceTypes,
    },
    {
      label: 'Previous nonprofit board experience:',
      type: FilterKind.Radio,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      formKey: 'PreviousNonprofitBoardExperience',
    },
    {
      label: 'Hopes:',
      type: FilterKind.Checklist,
      formKey: 'GoalsForBoardService',
      options: TECH_LEADER_FORM_OPTIONS.goalsForBoardService,
    },
    {
      label: 'Focus areas:',
      type: FilterKind.Chips,
      withSearch: true,
      options: COMMON_FOCUS_AREAS,
      formKey: 'NonprofitFocusAreas',
    },
    {
      label: 'Geographical reach or scope:',
      type: FilterKind.Checklist,
      options: mapOptions(TECH_LEADER_FORM_OPTIONS.nonprofitGeographicalReachPreference),
      formKey: 'NonprofitGeographicalReachPreference',
    },
    {
      label: 'Nonprofit priorities preference:',
      type: FilterKind.Checklist,
      options: TECH_LEADER_FORM_OPTIONS.nonprofitTechPrioritiesPreference,
      formKey: 'NonprofitTechPrioritiesPreference',
    },
    {
      label: 'Meetings type preference:',
      type: FilterKind.Checklist,
      options: mapOptions(TECH_LEADER_FORM_OPTIONS.boardMeetingPreference),
      formKey: 'BoardMeetingPreference',
    },
  ],
  [RawUserRole.NPO]: [
    {
      label: 'Location (city):',
      type: FilterKind.Chips,
      withSearch: true,
      formKey: 'OrganizationHQCity',
    },
    { label: 'Company:', type: FilterKind.Chips, formKey: 'Company', options: [] },
    {
      label: 'Require board members to be located in the city?',
      type: FilterKind.Radio,
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
      formKey: 'RequireBoardMembersLocation',
    },
    { label: 'Cause areas:', type: FilterKind.Chips, withSearch: true, options: COMMON_FOCUS_AREAS, formKey: 'Causes' },
    {
      label: 'Operating budget:',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.operatingBudget),
      formKey: 'OperatingBudget',
    },
    {
      label: 'Geographical scope or reach:',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.geographicalScope),
      formKey: 'GeographicalScope',
    },
    {
      label: 'Years in operation:',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.yearsInOperation),
      formKey: 'YearsInOperation',
    },
    {
      label: 'Technical staff:',
      type: FilterKind.Checklist,
      formKey: 'TechnicalStaffCount',
      options: mapOptions(NPO_FORM_OPTIONS.technicalStaffCount),
    },
    {
      label: 'Years of experience of board members:',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.averageBoardMemberExperience),
      formKey: 'AverageBoardMemberExperience',
    },
    {
      label: 'How many board meetings per year?',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.boardMeetingsPerYear),
      formKey: 'BoardMeetingsPerYear',
    },
    {
      label: 'How long board terms?',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.boardTermsLength),
      formKey: 'BoardTermsLength',
    },
    {
      label: 'Meetings type:',
      type: FilterKind.Checklist,
      options: mapOptions(NPO_FORM_OPTIONS.boardMeetingLocation),
      formKey: 'BoardMeetingLocation',
    },
    {
      label: 'Minimum direct financial contribution:',
      type: FilterKind.Checklist,
      formKey: 'BoardMemberDirectDonation',
      options: mapOptions(NPO_FORM_OPTIONS.boardMemberDirectDonation),
    },
    {
      label: 'Tech priorities:',
      type: FilterKind.Checklist,
      options: NPO_FORM_OPTIONS.techPriorities,
      formKey: 'TechPriorities',
    },
  ],
};
