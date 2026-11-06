import { z } from 'zod';
import {
  NPO_FORM_KEYS_WITH_CHECKLIST,
  NPO_FORM_KEYS_WITH_MULTIPLE_SCALE,
  NPO_FORM_KEYS_WITH_INPUT,
  NPO_FORM_OPTIONAL,
  NPO_FORM_KEYS_WITH_RADIO_OR_SELECT,
  NPO_FORM_KEYS_WITH_CHECKBOX,
  NPO_FORM_RADIO_SELECT_WITH_OTHER_INPUT_FIELDS,
  NPO_FORM_CHECKLIST_FIELDS_WITH_OTHER,
} from './NPOform/constants';
import { NpoFormType } from './NPOform/types';
import {
  TECH_LEADER_FORM_KEYS_WITH_CHECKLIST,
  TECH_LEADER_FORM_KEYS_WITH_SCALE,
  TECH_LEADER_FORM_KEYS_WITH_INPUT,
  TECH_LEADER_FORM_OPTIONAL,
  TECH_LEADER_FORM_KEYS_WITH_RADIO_OR_SELECT,
  TECH_LEADER_SELECT_RADIO_WITH_OTHER_INPUT_FIELDS,
  TECH_LEADER_CHECKLIST_FIELDS_WITH_OTHER,
} from './techLeaderForm/constants';
import { TechLeaderFormType } from './techLeaderForm/types';

export const inputFieldValidation = z.string().min(1, 'This field is required');
export const radioFieldValidation = z.string().min(1, 'Please select an option');
export const checklistFieldValidation = z
  .record(z.string(), z.boolean())
  .refine((values) => Object.values(values).filter((value) => value).length > 0, 'Please select at least one option');

export const scaleFieldValidation = z
  .number({ required_error: 'Please select a scale value' })
  .min(1, 'Please select a scale value');

export const checkboxFieldValidation = z.boolean().refine((value) => value !== null, 'This field is required');

const otherFieldValidation = z
  .string()
  .refine((value) => value.trim().length > 0, 'Please provide a value for "other".');

export const npoFormShape = {
  ...NPO_FORM_KEYS_WITH_CHECKLIST.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: checklistFieldValidation };
  }, {}),
  ...NPO_FORM_KEYS_WITH_INPUT.reduce<z.ZodRawShape>((acc, key) => {
    const validation = NPO_FORM_OPTIONAL.includes(key) ? z.string().optional() : inputFieldValidation;
    return { ...acc, [key]: validation };
  }, {}),
  ...NPO_FORM_KEYS_WITH_CHECKBOX.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: NPO_FORM_OPTIONAL.includes(key) ? z.boolean().optional() : checkboxFieldValidation };
  }, {}),
  ...NPO_FORM_KEYS_WITH_MULTIPLE_SCALE.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: scaleFieldValidation };
  }, {}),
  ...NPO_FORM_KEYS_WITH_RADIO_OR_SELECT.reduce<z.ZodRawShape>((acc, key) => {
    acc[key] = radioFieldValidation;
    return acc;
  }, {}),
  ...NPO_FORM_CHECKLIST_FIELDS_WITH_OTHER.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [`${key}OtherValue`]: otherFieldValidation };
  }, {}),
  ...NPO_FORM_RADIO_SELECT_WITH_OTHER_INPUT_FIELDS.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: otherFieldValidation };
  }, {}),
};

export const npoFormSchemas = z.object(npoFormShape) as z.ZodType<NpoFormType>;

export const techLeaderFormShape = {
  ...TECH_LEADER_FORM_KEYS_WITH_CHECKLIST.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: checklistFieldValidation };
  }, {}),
  ...TECH_LEADER_FORM_KEYS_WITH_SCALE.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: scaleFieldValidation };
  }, {}),
  ...TECH_LEADER_FORM_KEYS_WITH_INPUT.reduce<z.ZodRawShape>((acc, key) => {
    const validation = TECH_LEADER_FORM_OPTIONAL.includes(key) ? z.string().optional() : inputFieldValidation;
    return { ...acc, [key]: validation };
  }, {}),
  ...TECH_LEADER_FORM_KEYS_WITH_RADIO_OR_SELECT.reduce<z.ZodRawShape>((acc, key) => {
    acc[key] = radioFieldValidation;
    return acc;
  }, {}),
  ...TECH_LEADER_CHECKLIST_FIELDS_WITH_OTHER.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [`${key}OtherValue`]: otherFieldValidation };
  }, {}),
  ...TECH_LEADER_SELECT_RADIO_WITH_OTHER_INPUT_FIELDS.reduce<z.ZodRawShape>((acc, key) => {
    return { ...acc, [key]: otherFieldValidation };
  }, {}),
};

export const techLeaderFormSchemas = z.object(techLeaderFormShape) as z.ZodType<TechLeaderFormType>;
