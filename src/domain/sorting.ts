export enum SortDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}

export enum SortColumn {
  Budget = 'Budget',
  CompanyName = 'Company name',
  Company = 'Company',
  DateAdded = 'Date added',
  FormUpdate = 'Date modified',
  Interests = 'Interests',
  Members = 'Members',
  NonProfit = 'Nonprofit',
  Status = 'Status',
  TechLeader = 'Tech Leader',
  Type = 'Type',
  User = 'User',
  WaitingForMatch = 'Waiting for a match',
  Location = 'Location',
  Experience = 'Experience',
  DirectDonation = 'Direct Donation',
  Meetings = 'Meetings',
}

export interface SortObject {
  [key: string]: SortColumn;
}

export enum SortByParams {
  userNameAsc = 'UserNameAsc',
  userNameDesc = 'UserNameDesc',
  emailAsc = 'EmailAsc',
  emailDesc = 'EmailDesc',
  roleAsc = 'RoleAsc',
  roleDesc = 'RoleDesc',
  corporateClientNameAsc = 'CorporateClientNameAsc',
  corporateClientNameDesc = 'CorporateClientNameDesc',
  createdAtAsc = 'CreatedAtAsc',
  createdAtDesc = 'CreatedAtDesc',
  memberCountAsc = 'MemberCountAsc',
  memberCountDesc = 'MemberCountDesc',
  techLeaderNameAsc = 'TechLeaderNameAsc',
  techLeaderNameDesc = 'TechLeaderNameDesc',
  npoNameAsc = 'NpoNameAsc',
  npoNameDesc = 'NpoNameDesc',
  lastFormUpdateAtAsc = 'LastFormUpdateAtAsc',
  lastFormUpdateAtDesc = 'LastFormUpdateAtDesc',
}

export enum SortByFormAnswer {
  OrganizationHQCityAsc = 'OrganizationHQCityAsc',
  OrganizationHQCityDesc = 'OrganizationHQCityDesc',
  BoardMeetingLocationAsc = 'BoardMeetingLocationAsc',
  BoardMeetingLocationDesc = 'BoardMeetingLocationDesc',
  BoardMemberDirectDonationAsc = 'BoardMemberDirectDonationAsc',
  BoardMemberDirectDonationDesc = 'BoardMemberDirectDonationDesc',
  NonprofitBoardExperienceRequirementAsc = 'NonprofitBoardExperienceRequirementAsc',
  NonprofitBoardExperienceRequirementDesc = 'NonprofitBoardExperienceRequirementDesc',
  CityAsc = 'CityAsc',
  CityDesc = 'CityDesc',
  BoardMeetingPreferenceAsc = 'BoardMeetingPreferenceAsc',
  BoardMeetingPreferenceDesc = 'BoardMeetingPreferenceDesc',
  FinancialContributionComfortAsc = 'FinancialContributionComfortAsc',
  FinancialContributionComfortDesc = 'FinancialContributionComfortDesc',
  PriorExperienceOrConnectionAsc = 'PriorExperienceOrConnectionAsc',
  PriorExperienceOrConnectionDesc = 'PriorExperienceOrConnectionDesc',
}
