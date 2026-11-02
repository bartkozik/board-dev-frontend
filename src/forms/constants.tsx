import { NonAdminUserRole } from '@/users/types';
import { GoogleDocumentType } from './types';

export const NPO_ESTIMATED_TIME_IN_MINUTES = 45;
export const TECH_LEADER_ESTIMATED_TIME_IN_MINUTES = 40;

export const VISITED_PAGES_BLANK_KEY = 'VisitedPages';

export const GOOGLE_DOC_BY_ROLE: Record<NonAdminUserRole, GoogleDocumentType[]> = {
  TechLeader: [GoogleDocumentType.TechLeaderProfileDescription],
  NPO: [GoogleDocumentType.NonProfitProfileDescription, GoogleDocumentType.TechFocusedBoardMemberDescription],
} as const;

export const COMMON_FOCUS_AREAS = [
  { label: 'Animals', key: 'animals' },
  { label: 'Arts & culture', key: 'artsCulture' },
  {
    label: 'Capacity-building or volunteer engagement for other nonprofit organizations',
    key: 'capacityBuilding',
  },
  { label: 'Children & youth', key: 'childrenAndYouth' },
  { label: 'Civil rights', key: 'civilRights' },
  { label: 'Disaster relief', key: 'disasterRelief' },
  { label: 'Disease & medical research', key: 'diseaseResearch' },
  { label: 'Diversity, equity & inclusion (DEI)', key: 'dei' },
  { label: 'Economic development, economic inclusion/opportunity', key: 'economicDevelopment' },
  { label: 'Education', key: 'education' },
  { label: 'Employment, workforce development, career readiness', key: 'employmentServices' },
  { label: 'Environment', key: 'environment' },
  { label: 'Female empowerment, women & girls', key: 'femaleEmpowerment' },
  { label: 'Food security', key: 'foodSecurity' },
  { label: 'Gender equity & justice', key: 'genderEquity' },
  { label: 'Health & healthcare', key: 'healthcare' },
  { label: 'Housing security & homelessness', key: 'housingSecurity' },
  { label: 'Human services', key: 'humanServices' },
  { label: 'Human rights', key: 'humanRights' },
  { label: 'International development', key: 'internationalDevelopment' },
  { label: 'Legal services & access to justice', key: 'legalServices' },
  { label: 'LGBTQ+ equity & justice', key: 'lgbtqJustice' },
  { label: 'Mental & behavioral health', key: 'mentalHealth' },
  { label: 'Race, equity and justice', key: 'raceEquityJustice' },
  { label: 'Religion & spirituality', key: 'religionSpirituality' },
  { label: 'Refugee, asylum, immigration support', key: 'refugeeSupport' },
  { label: 'Science & technology', key: 'scienceTechnology' },
  { label: 'Veterans affairs', key: 'veteransAffairs' },
  { label: 'Violence prevention', key: 'violencePrevention' },
];
