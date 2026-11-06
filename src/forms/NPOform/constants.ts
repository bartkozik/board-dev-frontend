import { ConfigFieldKind } from '../types';
import { NPO_FORM_CONFIG } from './npoFormConfig';

export const config = [
  ...NPO_FORM_CONFIG[1],
  ...NPO_FORM_CONFIG[2],
  ...NPO_FORM_CONFIG[3],
  ...NPO_FORM_CONFIG[4],
  ...NPO_FORM_CONFIG[5],
];

export const NPO_FORM_KEYS_WITH_CHECKLIST = config
  .filter((key) => key.type === ConfigFieldKind.Checklist)
  .map((key) => key.name);

export const NPO_FORM_KEYS_WITH_CHECKBOX = config
  .filter((key) => key.type === ConfigFieldKind.Checkbox)
  .map((key) => key.name);

export const NPO_FORM_KEYS_WITH_MULTIPLE_SCALE = config
  .filter((field) => field.type === ConfigFieldKind.MultipleScale)
  .map((field) => field.scales.map((scale) => scale.key))
  .flat();

export const NPO_FORM_KEYS_WITH_RADIO_OR_SELECT = config
  .filter((field) => [ConfigFieldKind.Radio, ConfigFieldKind.Select].includes(field.type))
  .map((field) => field.name);

export const NPO_FORM_KEYS_WITH_INPUT = config
  .filter((field) => [ConfigFieldKind.Input, ConfigFieldKind.Textarea].includes(field.type))
  .map((field) => field.name);

export const NPO_FORM_KEYS_WITH_STRING = [...NPO_FORM_KEYS_WITH_INPUT, ...NPO_FORM_KEYS_WITH_RADIO_OR_SELECT];

export const NPO_FORM_KEYS_OF_CHECKLIST = config
  .filter((field) => field.type === ConfigFieldKind.Checklist)
  .reduce<Record<string, string[]>>((acc, field) => ({ ...acc, [field.name]: field.fields.map((field) => field.key) }), {});

export const NPO_FORM_OPTIONAL = config.filter((field) => field.optional).map((field) => field.name);

const configFlat = config.flat();

export const NPO_FORM_RADIO_SELECT_WITH_OTHER_INPUT_FIELDS = configFlat
  .filter(
    (field) =>
      (field.type === ConfigFieldKind.Select || field.type === ConfigFieldKind.Radio) &&
      field.options?.some((option) => option.value === 'other')
  )
  .map((field) => `${field.name}OtherValue`);

export const NPO_FORM_CHECKLIST_FIELDS_WITH_OTHER = config
  .filter(
    (field) => field.type === ConfigFieldKind.Checklist && field.fields?.some((fieldItem) => fieldItem.key === 'other')
  )
  .map((field) => field.name);

export const NPO_FORM_OTHER_VALUES = [
  ...NPO_FORM_CHECKLIST_FIELDS_WITH_OTHER,
  ...NPO_FORM_RADIO_SELECT_WITH_OTHER_INPUT_FIELDS,
];
