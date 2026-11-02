import { CustomQuestionFields, OtherValueFields } from '../types';
import {
  NPO_FORM_KEYS_WITH_CHECKLIST,
  NPO_FORM_KEYS_WITH_STRING,
  NPO_FORM_KEYS_WITH_MULTIPLE_SCALE,
  NPO_FORM_KEYS_WITH_CHECKBOX,
  NPO_FORM_OTHER_VALUES,
} from './constants';

export type NpoChecklistKeys = (typeof NPO_FORM_KEYS_WITH_CHECKLIST)[number];
export type NpoChecklist = Record<NpoChecklistKeys, boolean>;
export type NpoChecklistFields = Record<NpoChecklistKeys, NpoChecklist>;

export type NpoStringKeys = (typeof NPO_FORM_KEYS_WITH_STRING)[number];
export type NpoStringFields = Record<NpoStringKeys, string>;

export type NpoNumberKeys = (typeof NPO_FORM_KEYS_WITH_MULTIPLE_SCALE)[number];
export type NpoNumberFields = Record<NpoNumberKeys, number>;

export type NpoCheckboxKeys = (typeof NPO_FORM_KEYS_WITH_CHECKBOX)[number];
export type NpoCheckboxFields = Record<NpoCheckboxKeys, boolean>;

export type NpoOtherValuesStringKeys = (typeof NPO_FORM_OTHER_VALUES)[number];

export type NpoFormType = NpoChecklistFields &
  NpoStringFields &
  NpoNumberFields &
  NpoCheckboxFields &
  CustomQuestionFields &
  OtherValueFields;
