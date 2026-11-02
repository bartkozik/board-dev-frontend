import { makeAutoObservable } from 'mobx';
import { RootStore } from '@/RootStore';
import { initializeChecklist } from '../utils';
import {
  TECH_LEADER_CHECKLIST_FIELDS_WITH_OTHER,
  TECH_LEADER_FORM_KEYS_OF_CHECKLIST,
  TECH_LEADER_FORM_KEYS_WITH_CHECKLIST,
  TECH_LEADER_FORM_KEYS_WITH_SCALE,
  TECH_LEADER_FORM_KEYS_WITH_STRING,
  TECH_LEADER_SELECT_RADIO_WITH_OTHER_INPUT_FIELDS,
} from './constants';
import { TechLeaderChecklist, TechLeaderFormType } from './types';

const stringFields = TECH_LEADER_FORM_KEYS_WITH_STRING.reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, {} as Record<string, string>);

const checklistFields = TECH_LEADER_FORM_KEYS_WITH_CHECKLIST.reduce((acc, key) => {
  const checklistKeys = TECH_LEADER_FORM_KEYS_OF_CHECKLIST[key];
  acc[key] = initializeChecklist(checklistKeys);

  return acc;
}, {} as Record<string, TechLeaderChecklist | string>);

const otherFields = TECH_LEADER_SELECT_RADIO_WITH_OTHER_INPUT_FIELDS.reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, {} as Record<string, string>);

const checklistOtherFields = TECH_LEADER_CHECKLIST_FIELDS_WITH_OTHER.reduce((acc, key) => {
  acc[`${key}OtherValue`] = '';
  return acc;
}, {} as Record<string, string>);

const scaleFields = TECH_LEADER_FORM_KEYS_WITH_SCALE.reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {} as Record<string, number>);

export const TECH_LEADER_INIT_FORM = {
  ...stringFields,
  ...checklistFields,
  ...scaleFields,
  ...otherFields,
  ...checklistOtherFields,
};

class TechLeaderFormStore {
  rootStore: RootStore;
  submitting = false;
  techLeaderForm = TECH_LEADER_INIT_FORM;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTechLeaderForm = (form: TechLeaderFormType): void => {
    this.techLeaderForm = form;
  };

  updateForm = (key: string, value: string | number | TechLeaderChecklist): void => {
    this.techLeaderForm = { ...this.techLeaderForm, [key]: value };
  };
}

export default TechLeaderFormStore;
