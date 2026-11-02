import { AxiosResponse } from 'axios';
import { UNKNOWN_USER_ROLE } from '@/domain/constants';
import { UserFormField } from '../forms/types';

export interface FetchOptions {
  readyForMatch?: boolean;
  matched?: boolean;
  corporateClientId?: string | string[];
  phrase?: string;
  role?: keyof typeof UserRole;
}

export enum UserIdentityType {
  AdminImpersonate = 'AdminImpersonate',
  AuthenticationApp = 'AuthenticationApp',
  MailAddress = 'MailAddress',
  Phone = 'Phone',
}

interface UserIdentity {
  confirmationCode: string | null;
  confirmed: boolean;
  createdAt: string;
  id: string;
  main: boolean;
  type: UserIdentityType;
  userId: string;
  value: string;
}

export enum UserRole {
  TechLeader = 'Tech Leader',
  NPO = 'Nonprofit',
  Admin = 'Admin',
}

export enum RawUserRole {
  Admin = 'Admin',
  TechLeader = 'TechLeader',
  NPO = 'NPO',
}

export type NonAdminUserRole = Exclude<RawUserRole, RawUserRole.Admin>;

export interface UserSummary {
  shortFormSummary?: string;
  longFormSummary?: string;
}

export interface RawUser extends UserSummary {
  archivedAt: string | null;
  createdAt: string;
  email: string;
  formCompleted: boolean;
  id: string;
  identities?: UserIdentity[];
  interests: string[];
  match: string;
  modifiedAt: string | null;
  name: string;
  roles: RawUserRole[];
  corporateClientId?: string;
  corporateClientName?: string;
  isBlocked?: boolean;
  formData: UserFormField[];
  lastFormUpdateAt: string;
  visitedPages: string[];
  trainingMaterialsUrl: string;
  accessToTrainingMaterials: boolean;
  profileDescriptionUrl: string | null;
  techFocusedDescriptionUrl: string | null;
}

export interface User extends RawUser {
  email: string;
  name: string;
  primaryContactFullName?: string;
  formattedCreatedAt: string;
  formattedLastFormUpdateAt: string;
  type: UserRole | typeof UNKNOWN_USER_ROLE;
  matchWaitingTime?: MatchWaitingTime;
  isNewUser?: boolean;
  formattedFormData: UserFormField[];
  isConnectedWithDellCompany?: boolean;
}

export interface UserFormData {
  name: string;
  primaryContactFullName?: string;
  email: string;
  roles: (keyof typeof UserRole)[] | (keyof typeof RawUserRole)[];
  corporateClientId?: string;
}

export interface UserEditFormData {
  userId: string;
  name: string;
  primaryContactFullName?: string;
  roles: (keyof typeof UserRole)[];
  corporateClientId?: string;
  isBlocked?: boolean;
  formCompleted?: boolean;
  trainingMaterialsUrl?: string;
  accessToTrainingMaterials?: boolean;
}

export interface EditUserParams {
  name?: string;
  primaryContactFullName?: string;
  role?: keyof typeof UserRole;
  corporateClientId?: string;
  isBlocked?: boolean;
  formCompleted?: boolean;
  trainingMaterialsUrl?: string;
  accessToTrainingMaterials?: boolean;
  shortFormSummary?: string;
  longFormSummary?: string;
}
export interface UsersPaginationResults {
  count: number;
  results: RawUser[];
}

export interface MatchWaitingTime {
  quantity: number;
  quantityType: 'days' | 'weeks';
}

export interface UrlInfo {
  url: string;
  text: string;
}

export type UserReturn = Promise<AxiosResponse<User>>;
export type UsersReturn = Promise<AxiosResponse<UsersPaginationResults>>;
export type UserDeleteReturn = Promise<AxiosResponse<void>>;
export type UserSummaryReturn = Promise<AxiosResponse<{ shortSummary: string; longSummary: string }>>;
