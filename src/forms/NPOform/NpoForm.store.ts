import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/RootStore';
import { initializeChecklist } from '../utils';
import {
  NPO_FORM_KEYS_WITH_STRING,
  NPO_FORM_KEYS_WITH_CHECKLIST,
  NPO_FORM_KEYS_OF_CHECKLIST,
  NPO_FORM_KEYS_WITH_MULTIPLE_SCALE,
  NPO_FORM_KEYS_WITH_CHECKBOX,
  NPO_FORM_CHECKLIST_FIELDS_WITH_OTHER,
  NPO_FORM_RADIO_SELECT_WITH_OTHER_INPUT_FIELDS,
} from './constants';
import { NpoChecklist, NpoFormType } from './types';

const stringFields = NPO_FORM_KEYS_WITH_STRING.reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, {} as Record<string, string>);

const checklistFields = NPO_FORM_KEYS_WITH_CHECKLIST.reduce((acc, key) => {
  const checklistKeys = NPO_FORM_KEYS_OF_CHECKLIST[key];
  acc[key] = initializeChecklist(checklistKeys);
  return acc;
}, {} as Record<string, NpoChecklist | string>);

const multipleScaleFields = NPO_FORM_KEYS_WITH_MULTIPLE_SCALE.reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {} as Record<string, number>);

const checkboxFields = NPO_FORM_KEYS_WITH_CHECKBOX.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as Record<string, boolean>);

const otherFields = NPO_FORM_RADIO_SELECT_WITH_OTHER_INPUT_FIELDS.reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, {} as Record<string, string>);

const checklistOtherFields = NPO_FORM_CHECKLIST_FIELDS_WITH_OTHER.reduce((acc, key) => {
  acc[`${key}OtherValue`] = '';
  return acc;
}, {} as Record<string, string>);

export const NPO_INIT_FORM = {
  ...stringFields,
  ...checklistFields,
  ...multipleScaleFields,
  ...checkboxFields,
  ...otherFields,
  ...checklistOtherFields,
};

class NpoFormStore {
  rootStore: RootStore;
  npoForm = NPO_INIT_FORM;
  submitting = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setNpoForm = (form: NpoFormType): void => {
    this.npoForm = form;
  };

  updateForm = (key: string, value: string | number | boolean | NpoChecklist): void => {
    this.npoForm = { ...this.npoForm, [key]: value };
  };
}

export default NpoFormStore;
