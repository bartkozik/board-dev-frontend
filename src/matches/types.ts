import { AxiosResponse } from 'axios';
import { SortByParams } from '@/domain/sorting';
import { BaseFetchParams } from '@/domain/types';
import { ConfigFieldKind } from '@/forms/types';
import { RadioOption } from '@/theme/radioGroup/RadioGroup';
import { RawUser } from '@/users/types';
import { MATCH_FORM_KEYS, NPO_USER_ID, TECH_LEADER_USER_ID } from './constants';

export interface Field {
  keyName: string;
  label: string;
  compareId: string;
  type?: ConfigFieldKind;
}

export interface Subsection {
  id: string;
  title: string;
  fields?: Field[];
}

export interface Section {
  id: string;
  title: string;
  fields?: Field[];
  subsections?: Subsection[];
}

export interface FetchComparisonsListParams extends BaseFetchParams {
  id?: string;
  userName?: string;
}

export interface RawComparison {
  id: string;
  userId: string;
  userDetails: RawUser;
  comparedUsersIds: string[];
  comparedUsersDetails: RawUser[];
  createdAt: string;
}

export interface Comparison extends RawComparison {
  formattedCreatedAt: string;
}

export interface RawComparisonsResult {
  count: number;
  results: RawComparison[];
}

export type ComparisonReturn = Promise<AxiosResponse<RawComparison>>;
export type ComparisonsReturn = Promise<AxiosResponse<RawComparisonsResult>>;
export type ComparisonDeleteReturn = Promise<AxiosResponse<void>>;

export type MatchFormType = Record<(typeof MATCH_FORM_KEYS)[number], string>;
export type MatchUserKey = typeof TECH_LEADER_USER_ID | typeof NPO_USER_ID;

export interface RawMatch extends MatchFormType {
  techLeaderUserName: string;
  npoUserName: string;
  createdAt: string;
}

export interface FetchMatchingListParams {
  userName?: string;
  npoUserId?: string;
  techLeaderUserId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortByParams;
  crmSent?: boolean;
}

export interface MatchingPaginationResults {
  count: number;
  results: RawMatch[];
}

export interface MatchSummaryRequestParams {
  npoUserId: string;
  techLeaderUserId: string;
  customizationPrompt?: string;
}

export interface MatchSummary {
  shortSummary: string;
  longSummary: string;
}

export enum FilterKind {
  Checklist = 'Checklist',
  Radio = 'Radio',
  Chips = 'Chips',
}

export type FilterType = Chips | Radio | Checklist;
export type FilterOption = { key: string; label: string; value?: string };

interface FilterConfig {
  formKey: string;
  label: string;
  type: keyof typeof FilterKind;
}

interface Chips extends FilterConfig {
  type: FilterKind.Chips;
  options?: FilterOption[];
  withSearch?: boolean;
}

interface Radio extends FilterConfig {
  type: FilterKind.Radio;
  options: RadioOption[];
}

interface Checklist extends FilterConfig {
  type: FilterKind.Checklist;
  options: FilterOption[];
}

export type GetMatchesReturn = Promise<AxiosResponse<MatchingPaginationResults>>;
export type PutMatchesReturn = Promise<AxiosResponse<RawMatch>>;
export type GenerateMatchSummaryReturn = Promise<AxiosResponse<MatchSummary>>;
