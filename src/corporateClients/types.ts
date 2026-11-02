import { AxiosResponse } from 'axios';
import { RawUserRole, UserRole } from '@/users/types';

export type CorporateClientUpdateData = {
  name?: string;
  npoThankYouMessage?: string;
  techLeaderThankYouMessage?: string;
  npoWelcomeMessage?: string;
  techLeaderWelcomeMessage?: string;
  trainingMaterialsUrl?: string;
};

export enum CustomQuestionKey {
  CustomQuestion1 = 'CustomQuestion1',
  CustomQuestion2 = 'CustomQuestion2',
  CustomQuestion3 = 'CustomQuestion3',
  CustomQuestion4 = 'CustomQuestion4',
  CustomQuestion5 = 'CustomQuestion5',
}

export enum CustomQuestionAnswerKey {
  CustomQuestion1 = 'CustomQuestion1Answer',
  CustomQuestion2 = 'CustomQuestion2Answer',
  CustomQuestion3 = 'CustomQuestion3Answer',
  CustomQuestion4 = 'CustomQuestion4Answer',
  CustomQuestion5 = 'CustomQuestion5Answer',
}

export interface CorporateClientCustomMessaging {
  techLeader: MessageValue[];
  npo: MessageValue[];
}

export type CustomFormQuestion = {
  id: CustomQuestionKey;
  label: string;
  required: boolean;
  value: string;
};

export type RawCustomFormQuestion = {
  corporateClientId: string;
  key: CustomQuestionKey;
  role: RawUserRole;
  content: string;
  isRequired: boolean;
};

export type CustomQuestionFormData = {
  key: CustomQuestionKey;
  role: RawUserRole;
  content: string;
  isRequired: boolean;
};

export enum CustomMessaging {
  NPO_WELCOME = 'npoWelcomeMessage',
  NPO_THANK_YOU = 'npoThankYouMessage',
  TECH_LEADER_WELCOME = 'techLeaderWelcomeMessage',
  TECH_LEADER_THANK_YOU = 'techLeaderThankYouMessage',
}

export enum MessageKeys {
  Default = 'default',
  Custom = 'custom',
}

export type MessageField = {
  key: MessageKeys;
  label: string;
  value: string;
};

export type MessageValue = {
  key: CustomMessaging;
  fields: MessageField[];
};

type MessageSection = {
  sectionKey: RawUserRole;
  labelKey: CustomMessaging;
  values: MessageValue[];
};

export type CustomMessagesSection = {
  title: string;
  textAreaGroups: MessageSection[];
};

export interface RawCorporateClient {
  id: string;
  name: string;
  roles: string[];
  memberCount: number;
  createdAt: string;
  createdBy: string;
  createdByDetails: {
    id: string;
    name: string;
    roles: UserRole[];
  };
  modifiedAt: string | null;
  archivedAt: string | null;
  techLeaderWelcomeMessage: string;
  npoWelcomeMessage: string;
  techLeaderThankYouMessage: string;
  npoThankYouMessage: string;
  trainingMaterialsUrl: string;
}

export interface CorporateClient extends RawCorporateClient {
  formatedCreatedAt: string;
}

export interface CorporateClientPaginationResults {
  count: number;
  results: RawCorporateClient[];
}

export interface CorporateClientCustomQuestionsResults {
  count: number;
  results: RawCustomFormQuestion[];
}

export type CorporateClientsReturn = Promise<AxiosResponse<CorporateClientPaginationResults>>;
export type CorporateClientReturn = Promise<AxiosResponse<CorporateClient>>;

export type CorporateClientCustomQuestionsReturn = Promise<AxiosResponse<CorporateClientCustomQuestionsResults>>;
export type CorporateClientCustomQuestionReturn = Promise<AxiosResponse<RawCustomFormQuestion>>;
