import { ConfigFieldKind } from '../types';
import { TECH_LEADER_FORM_CONFIG } from './techLeaderFormConfig';

export const config = [
  ...TECH_LEADER_FORM_CONFIG[1],
  ...TECH_LEADER_FORM_CONFIG[2],
  ...TECH_LEADER_FORM_CONFIG[3],
  ...TECH_LEADER_FORM_CONFIG[4],
];

export const TECH_LEADER_FORM_KEYS_WITH_CHECKLIST = config
  .filter((field) => field.type === ConfigFieldKind.Checklist)
  .map((field) => field.name);

export const TECH_LEADER_FORM_KEYS_WITH_SCALE = config
  .filter((field) => field.type === ConfigFieldKind.Scale)
  .map((field) => field.name);

export const TECH_LEADER_FORM_KEYS_WITH_RADIO_OR_SELECT = config
  .filter((field) => [ConfigFieldKind.Radio, ConfigFieldKind.Select].includes(field.type))
  .map((field) => field.name);

export const TECH_LEADER_FORM_KEYS_WITH_INPUT = config
  .filter((field) => [ConfigFieldKind.Input, ConfigFieldKind.Textarea].includes(field.type))
  .map((field) => field.name);

export const TECH_LEADER_FORM_KEYS_WITH_STRING = [
  ...TECH_LEADER_FORM_KEYS_WITH_INPUT,
  ...TECH_LEADER_FORM_KEYS_WITH_RADIO_OR_SELECT,
];

export const TECH_LEADER_FORM_KEYS_OF_CHECKLIST = config
  .filter((field) => field.type === ConfigFieldKind.Checklist)
  .reduce((acc, field) => ({ ...acc, [field.name]: field.fields.map((field) => field.key) }), {});

export const TECH_LEADER_FORM_OPTIONAL = config.filter((field) => field.optional).map((field) => field.name);

const configFlat = config.flat();

export const TECH_LEADER_SELECT_RADIO_WITH_OTHER_INPUT_FIELDS = configFlat
  .filter(
    (field) =>
      (field.type === ConfigFieldKind.Select || field.type === ConfigFieldKind.Radio) &&
      field.options?.some((option) => option.value === 'other')
  )
  .map((field) => `${field.name}OtherValue`);

export const TECH_LEADER_CHECKLIST_FIELDS_WITH_OTHER = config
  .filter(
    (field) => field.type === ConfigFieldKind.Checklist && field.fields?.some((fieldItem) => fieldItem.key === 'other')
  )
  .map((field) => field.name);

export const TECH_LEADER_OTHER_VALUES = [
  ...TECH_LEADER_CHECKLIST_FIELDS_WITH_OTHER,
  ...TECH_LEADER_SELECT_RADIO_WITH_OTHER_INPUT_FIELDS,
];
