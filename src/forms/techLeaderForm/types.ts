import { CustomQuestionFields, OtherValueFields } from '../types';
import {
  TECH_LEADER_OTHER_VALUES,
  TECH_LEADER_FORM_KEYS_WITH_CHECKLIST,
  TECH_LEADER_FORM_KEYS_WITH_SCALE,
  TECH_LEADER_FORM_KEYS_WITH_STRING,
} from './constants';

export type TechLeaderChecklistKeys = (typeof TECH_LEADER_FORM_KEYS_WITH_CHECKLIST)[number];
export type TechLeaderChecklist = Record<TechLeaderChecklistKeys, boolean>;
export type TechLeaderChecklistFields = Record<TechLeaderChecklistKeys, TechLeaderChecklist>;

export type TechLeaderStringKeys = (typeof TECH_LEADER_FORM_KEYS_WITH_STRING)[number];
export type TechLeaderStringFields = Record<TechLeaderStringKeys, string>;

export type TechLeaderNumberKeys = (typeof TECH_LEADER_FORM_KEYS_WITH_SCALE)[number];
export type TechLeaderNumberFields = Record<TechLeaderNumberKeys, number>;

export type TechLeaderOtherValuesStringKeys = (typeof TECH_LEADER_OTHER_VALUES)[number];

export type TechLeaderFormType = TechLeaderChecklistFields &
  TechLeaderStringFields &
  TechLeaderNumberFields &
  CustomQuestionFields &
  OtherValueFields;
