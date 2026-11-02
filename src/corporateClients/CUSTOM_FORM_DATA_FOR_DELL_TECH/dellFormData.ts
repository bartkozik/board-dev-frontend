import { FormData } from '@/forms/types';

//This is hardcoded content for fields in application for users connected with Dell Tech.
export const DELL_TECHNOLOGIES_ID = '00000000-0000-4000-8000-000000000000';

export const DELL_FORM_DATA: FormData[] = [
  { key: 'company', value: 'Example Technology Company' },
  { key: 'companyIndustry', value: 'technology_hardware' },
  { key: 'companyEmployees', value: '10000Plus' },
];

export const HIDDEN_FOR_DELL_FORM_FIELDS = DELL_FORM_DATA.map((field) => field.key);
export const BASE_FOCUS_AREA_FORM_KEY = 'nonprofitFocusAreas';
export const DELL_FOCUS_AREA_FORM_KEY = 'nonprofitFocusAreasDell';
