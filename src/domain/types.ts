import { ReactNode } from 'react';
import { SortByFormAnswer, SortByParams } from '@/domain/sorting';
import { UserRole } from '@/users/types';

export interface BaseFetchParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortByParams;
}

export interface FetchUserListParams extends BaseFetchParams {
  phrase?: string;
  sortByFormAnswer?: SortByFormAnswer;
  userName?: string;
  role?: keyof typeof UserRole;
  email?: string;
  readyForMatch?: boolean;
  matched?: boolean;
  corporateClientId?: string | null | string[];
  id?: string[] | string;
}

export interface FetchCorporateClientListParams extends BaseFetchParams {
  phrase?: string;
  name?: string;
}

export interface Tab {
  element: ReactNode;
  label: string;
  value: string;
  filter?: Partial<FetchUserListParams>;
}

export interface FilterState {
  [key: string]: string[];
}
