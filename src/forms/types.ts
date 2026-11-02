import { UseFormReturn } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { CustomQuestionAnswerKey } from '@/corporateClients/types';
import { RadioOption } from '@/theme/radioGroup/RadioGroup';
import { SelectOption } from '@/theme/select/Select';
import { NpoChecklist, NpoFormType, NpoOtherValuesStringKeys } from './NPOform/types';
import { TechLeaderOtherValuesStringKeys, TechLeaderFormType, TechLeaderChecklist } from './techLeaderForm/types';

// / Helper function for initializing boolean records
export const createBooleanRecord = <T extends readonly string[]>(keys: T): Record<T[number], boolean> =>
  Object.fromEntries(keys.map((key) => [key, false])) as Record<T[number], boolean>;

// Helper function for initializing string records
export const createStringRecord = <T extends readonly string[]>(keys: T): Record<T[number], string> =>
  Object.fromEntries(keys.map((key) => [key, ''])) as Record<T[number], string>;

// Helper function for initializing number records
export const createNumberRecord = <T extends readonly string[]>(keys: T): Record<T[number], number> =>
  Object.fromEntries(keys.map((key) => [key, 0])) as Record<T[number], number>;

export enum ConfigFieldKind {
  Checklist = 'Checklist',
  Checkbox = 'Checkbox',
  Input = 'Input',
  Textarea = 'Textarea',
  Scale = 'Scale',
  MultipleScale = 'MultipleScale',
  Radio = 'Radio',
  Select = 'Select',
}

interface BaseConfig {
  name: string;
  type: ConfigFieldKind;
  label: string;
  previewLabel?: string;
  link?: boolean;
  optional?: boolean;
  relatedWith?: string;
  notChecklisted?: boolean;
}

export interface ChecklistConfig extends BaseConfig {
  type: ConfigFieldKind.Checklist;
  instruction?: string;
  fields: ChecklistField[];
  maxSelections?: number;
}

export interface ChecklistField {
  label: string;
  key: string;
}

export interface CheckboxConfig extends BaseConfig {
  type: ConfigFieldKind.Checkbox;
}

export interface InputConfig extends BaseConfig {
  type: ConfigFieldKind.Input;
  secondaryLabel?: boolean;
  relatedParent?: boolean;
}

export interface TextAreaConfig extends BaseConfig {
  type: ConfigFieldKind.Textarea;
  instruction?: string;
}

export interface ScaleConfig extends BaseConfig {
  type: ConfigFieldKind.Scale;
  scale?: { min: string; max: string };
  sectionTitle?: string;
}

export interface MultipleScaleConfig extends BaseConfig {
  type: ConfigFieldKind.MultipleScale;
  scales: Array<{ key: string; label: string }>;
  instruction?: string;
}

export interface RadioConfig extends BaseConfig {
  type: ConfigFieldKind.Radio;
  options: RadioOption[];
}

export interface SelectConfig extends BaseConfig {
  type: ConfigFieldKind.Select;
  options: SelectOption[];
}

export type FormElementConfig =
  | InputConfig
  | TextAreaConfig
  | ChecklistConfig
  | RadioConfig
  | ScaleConfig
  | MultipleScaleConfig
  | SelectConfig
  | CheckboxConfig;

export type FormConfigArray = FormElementConfig[];
export type FormConfig = Record<number, FormConfigArray>;

export enum FormKind {
  NPO = 'npo',
  TECH_LEADER = 'techLeader',
}

export interface FormData {
  key: string;
  value: string;
  visitedPage?: string;
}

export type FormKey = keyof TechLeaderFormType | keyof NpoFormType;
export type FormType = TechLeaderFormType | NpoFormType;

export interface UserFormField extends FormData {
  userId: string;
}

export interface UserFormResults {
  count: number;
  results: UserFormField[];
  visitedPages: string[];
}

export type UserFormFieldReturn = Promise<AxiosResponse<UserFormField>>;
export type UserFormReturn = Promise<AxiosResponse<UserFormResults>>;

export interface Step {
  label: string;
  description?: string;
}

export const ADDITIONAL_QUESTIONS_KEY = {
  NPO: 5,
  TechLeader: 4,
};

export type CustomQuestionKeys = keyof typeof CustomQuestionAnswerKey;

export type CustomQuestionFields = {
  [key in CustomQuestionKeys]?: string;
};

export type OtherValueFields = {
  [key in TechLeaderOtherValuesStringKeys | NpoOtherValuesStringKeys]?:
    | string
    | number
    | boolean
    | Record<string, boolean>
    | {
        checklist: Record<string, boolean>;
        otherValue: string;
      }
    | {
        selectedValue: string | number | boolean;
        otherValue?: string;
      };
};

export interface FormConfigSetup {
  config: FormConfig;
  formMethods: UseFormReturn;
  clearValidationErrors: (keys: string[]) => void;
  isNpoForm?: boolean;
}

export type NpoFormValueType = string | number | boolean | NpoChecklist;

export type TechLeaderFormValueType = string | number | TechLeaderChecklist;

export enum GoogleDocumentType {
  TechLeaderProfileDescription = 'TechLeaderProfileDescription',
  NonProfitProfileDescription = 'NonProfitProfileDescription',
  TechFocusedBoardMemberDescription = 'TechFocusedBoardMemberDescription',
}
