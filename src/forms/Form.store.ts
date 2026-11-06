import { makeAutoObservable, runInAction, toJS } from 'mobx';
import isEqual from 'lodash/isEqual';
import { RootStore } from '@/RootStore';
import {
  BASE_FOCUS_AREA_FORM_KEY,
  DELL_FOCUS_AREA_FORM_KEY,
  DELL_FORM_DATA,
} from '@/corporateClients/CUSTOM_FORM_DATA_FOR_DELL_TECH/dellFormData';
import { CustomQuestionKey } from '@/corporateClients/types';
import {
  convertCustomQuestionsToFormConfig,
  convertFirstLetterToLower,
  createFieldConfigMap,
  groupFormStepFields,
  isFormFieldFilled,
  showErrorToast,
} from '@/utils/helpers';
import { RawUserRole, User } from '../users/types';
import { NPO_INIT_FORM } from './NPOform/NpoForm.store';
import { NPO_FORM_CONFIG } from './NPOform/npoFormConfig';
import { NpoFormType } from './NPOform/types';
import { GOOGLE_DOC_BY_ROLE, VISITED_PAGES_BLANK_KEY } from './constants';
import * as requests from './requests';
import { TECH_LEADER_INIT_FORM } from './techLeaderForm/TechLeaderForm.store';
import { TECH_LEADER_FORM_CONFIG } from './techLeaderForm/techLeaderFormConfig';
import { TechLeaderFormType } from './techLeaderForm/types';
import {
  ADDITIONAL_QUESTIONS_KEY,
  ChecklistConfig,
  ConfigFieldKind,
  FormConfig,
  FormElementConfig,
  FormType,
  OtherValueFields,
  RadioConfig,
  SelectConfig,
  UserFormField,
} from './types';

class FormStore {
  rootStore: RootStore;
  userForm: UserFormField[] = [];
  loadingForm = false;
  visitedPages: string[] = [];
  submitting: boolean = false;

  formHasChanges = false;
  private initialNpoForm: Partial<NpoFormType> | null = null;
  private initialTechLeaderForm: Partial<TechLeaderFormType> | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get formCompletionDetails(): { formCompletion: number; stepsValidation: Record<string, boolean> } {
    const { customQuestions } = this.rootStore.corporateClientStore;
    const { selectedUser } = this.rootStore.userStore;

    if (!selectedUser) return { formCompletion: 0, stepsValidation: {} };

    const isNPO = selectedUser.roles[0] === RawUserRole.NPO;
    const isSelectedUserConnectedWithDell = selectedUser.isConnectedWithDellCompany;

    const formConfig: FormConfig = isNPO
      ? { ...NPO_FORM_CONFIG }
      : {
          ...TECH_LEADER_FORM_CONFIG,
          1: TECH_LEADER_FORM_CONFIG[1].filter(
            (f) => f.name !== (isSelectedUserConnectedWithDell ? BASE_FOCUS_AREA_FORM_KEY : DELL_FOCUS_AREA_FORM_KEY)
          ),
        };

    const additionalQuestions = convertCustomQuestionsToFormConfig(customQuestions, selectedUser.roles[0]);
    const configKey = ADDITIONAL_QUESTIONS_KEY[selectedUser.roles[0]];

    if (formConfig[configKey]) formConfig[configKey] = [...additionalQuestions, ...formConfig[configKey]];

    const currentForm = isNPO ? this.rootStore.npoFormStore.npoForm : this.rootStore.techLeaderFormStore.techLeaderForm;

    const fieldConfigMap = createFieldConfigMap(formConfig);
    const stepFields = groupFormStepFields(formConfig);

    const totalFields = Object.values(stepFields).flat();
    const filledFields = totalFields.filter((fieldKey) => {
      const fieldConfig = fieldConfigMap[fieldKey];
      const fieldValue = currentForm[fieldKey];

      if (!fieldConfig) return false;

      return isFormFieldFilled(fieldConfig, fieldValue, currentForm);
    });

    const stepsValidation = Object.keys(stepFields).reduce((acc, stepKey) => {
      const stepFieldKeys = stepFields[stepKey];

      acc[stepKey] = stepFieldKeys.every((field) =>
        filledFields.some((filledField) => filledField.trim().toLowerCase() === field.trim().toLowerCase())
      );

      return acc;
    }, {} as Record<string, boolean>);

    const formCompletionRatio = isSelectedUserConnectedWithDell
      ? (filledFields.length - DELL_FORM_DATA.length) / (totalFields.length - DELL_FORM_DATA.length)
      : filledFields.length / totalFields.length;

    const completionPercentage = formCompletionRatio * 100;

    if (selectedUser.formCompleted && completionPercentage === 100) {
      const initialFormSnapshot = isNPO ? this.initialNpoForm : this.initialTechLeaderForm;

      if (initialFormSnapshot && !isEqual(currentForm, initialFormSnapshot)) this.setFormHasChanges(true);
    }

    return {
      formCompletion: Math.round(completionPercentage),
      stepsValidation,
    };
  }

  private setFormHasChanges = (value: boolean): void => {
    runInAction(() => (this.formHasChanges = value));
  };

  private setInitialFormSnapshotValue = (isNpoUser: boolean): void => {
    const form = isNpoUser ? this.rootStore.npoFormStore.npoForm : this.rootStore.techLeaderFormStore.techLeaderForm;

    if (isNpoUser) runInAction(() => (this.initialNpoForm = toJS(form) as unknown as Partial<NpoFormType>));
    else runInAction(() => (this.initialTechLeaderForm = toJS(form) as unknown as Partial<TechLeaderFormType>));
  };

  fetchUserForm = ({ isNpoUser = false, userId = '' }: { isNpoUser: boolean; userId?: string }): Promise<void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const { loggedInUser } = this.rootStore.authStore;
    const { selectedUser } = this.rootStore.userStore;
    runInAction(() => (this.loadingForm = true));

    if (!loggedInUser) return Promise.resolve();

    const currentUserId = !userId ? loggedInUser.id : userId;

    return requests
      .fetchUserForm(currentUserId)
      .then(({ data: { results, visitedPages } }) => {
        this.setFormHasChanges(false);

        const transformedResults = results.map((field: UserFormField) => ({
          ...field,
          key: convertFirstLetterToLower(field.key),
        }));

        runInAction(() => {
          this.userForm = transformedResults;
          this.visitedPages = visitedPages;
        });

        this.userForm && this.initializeUserForm({ isNpoUser, userForm: this.userForm });

        if (selectedUser?.formCompleted) this.setInitialFormSnapshotValue(isNpoUser);
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.USERS.FORM_FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loadingForm = false));
      });
  };

  private initializeUserForm = ({
    isNpoUser = false,
    userForm,
  }: {
    isNpoUser: boolean;
    userForm: UserFormField[];
  }): void => {
    const formInitializer = isNpoUser ? NPO_INIT_FORM : TECH_LEADER_INIT_FORM;
    const formConfig = isNpoUser ? NPO_FORM_CONFIG : TECH_LEADER_FORM_CONFIG;

    if (!userForm || userForm.length === 0) return;

    const updatedForm = JSON.parse(JSON.stringify(formInitializer));

    this.populateUpdatedForm(updatedForm, formConfig);

    userForm.forEach((backendField) => {
      const { key } = backendField;

      if (!(key in updatedForm)) {
        updatedForm[key] = backendField.value;
      }
    });

    this.updateFormStore(updatedForm, isNpoUser);
  };

  initializeFormFromFormattedData = (userFormData: UserFormField[], isNpoUser: boolean): void => {
    const transformedResults = userFormData.map((field: UserFormField) => ({
      ...field,
      key: convertFirstLetterToLower(field.key),
    }));

    runInAction(() => {
      this.userForm = transformedResults;
    });

    if (this.userForm) {
      this.initializeUserForm({ isNpoUser, userForm: this.userForm });
    }
  };

  markUserFormAsIncomplete = (): Promise<void | User> => {
    const { loggedInUser } = this.rootStore.authStore;
    if (!loggedInUser) return Promise.resolve();

    const updatedUser = {
      googleDocuments: [],
      formCompleted: false,
    };

    return requests
      .markUserFormCompletionStatus(loggedInUser.id, updatedUser)
      .then(() => this.rootStore.userStore.fetchUser({ userId: loggedInUser.id }));
  };

  markUserFormAsCompleted = (role: RawUserRole): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    const { loggedInUser } = this.rootStore.authStore;
    runInAction(() => (this.submitting = true));

    if (!loggedInUser) return Promise.resolve();

    const updatedUser = {
      googleDocuments: GOOGLE_DOC_BY_ROLE[role],
      formCompleted: true,
    };

    const isNpoUser = role === RawUserRole.NPO;

    return requests
      .markUserFormCompletionStatus(loggedInUser.id, updatedUser)
      .then(() => {
        addToast(toastMessages.USERS.UPDATE_SUCCESS, 'success');
        this.rootStore.userStore.fetchUser({ userId: loggedInUser.id });
        this.setInitialFormSnapshotValue(isNpoUser);
      })
      .catch((err) =>
        showErrorToast(
          {
            404: toastMessages.USERS.NO_USER,
            default: toastMessages.USERS.UPDATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  private populateUpdatedForm = (updatedForm: FormType, formConfig: FormConfig): void => {
    const form = updatedForm as OtherValueFields;

    Object.keys(form).forEach((key) => {
      const backendField = this.userForm.find((field) => field.key === key);
      const fieldConfig = this.getFieldConfig(formConfig, key);

      if (fieldConfig && backendField) {
        const value = this.mapBackendFieldToStepForm(backendField, fieldConfig);

        switch (fieldConfig.type) {
          case ConfigFieldKind.Checklist: {
            const { checklist, otherValue } = value as {
              checklist: Record<string, boolean>;
              otherValue: string;
            };
            form[key] = checklist;
            if (otherValue !== '') form[`${key}OtherValue`] = otherValue;
            break;
          }

          case ConfigFieldKind.Select:
          case ConfigFieldKind.Radio: {
            const { selectedValue, otherValue } = value as { selectedValue: string; otherValue?: string };
            form[key] = selectedValue;
            if (otherValue !== undefined) form[`${key}OtherValue`] = otherValue;
            break;
          }

          default:
            form[key] = value;
        }
      }
    });
  };

  private getFieldConfig(formConfig: FormConfig, key: string): FormElementConfig | void {
    const fieldConfig = Object.values(formConfig)
      .flat()
      .find((field) =>
        field.type === ConfigFieldKind.MultipleScale
          ? field.scales.some((scale) => scale.key === key)
          : field.name === key
      );

    if (fieldConfig) return fieldConfig;
  }

  private mapBackendFieldToStepForm(
    backendField: UserFormField,
    fieldConfig: FormElementConfig
  ):
    | string
    | number
    | boolean
    | Record<string, boolean>
    | { checklist: Record<string, boolean>; otherValue: string }
    | { selectedValue: string | number | boolean; otherValue?: string } {
    switch (fieldConfig.type) {
      case ConfigFieldKind.Select:
      case ConfigFieldKind.Radio:
        return this.mapSelectAndRadioField(backendField, fieldConfig);
      case ConfigFieldKind.Scale:
      case ConfigFieldKind.MultipleScale:
        return this.mapScaleField(backendField);
      case ConfigFieldKind.Checklist:
        return this.mapChecklistField(backendField, fieldConfig);
      case ConfigFieldKind.Checkbox:
        return this.mapCheckboxField(backendField);

      default:
        return backendField.value;
    }
  }

  private updateFormStore(updatedForm: FormType, isNpoUser: boolean): void {
    const { setTechLeaderForm } = this.rootStore.techLeaderFormStore;
    const { setNpoForm } = this.rootStore.npoFormStore;

    if (isNpoUser) setNpoForm(updatedForm as NpoFormType);
    else setTechLeaderForm(updatedForm as TechLeaderFormType);
  }

  private mapSelectAndRadioField(
    backendField: UserFormField | undefined,
    fieldConfig: SelectConfig | RadioConfig
  ): { selectedValue: string | number | boolean; otherValue?: string } {
    if (backendField && typeof backendField.value === 'string') {
      const backendValue = backendField.value.trim();
      if (backendValue.startsWith('other:')) {
        const otherValue = backendValue.substring('other:'.length).trim();
        return { selectedValue: 'other', otherValue };
      } else {
        const selectedOption = fieldConfig.options.find((option) => option.value === backendValue);
        return selectedOption ? { selectedValue: backendValue } : { selectedValue: '' };
      }
    }
    return { selectedValue: '' };
  }

  private mapScaleField(backendField: UserFormField): number {
    return Number(backendField?.value) || 0;
  }

  private mapChecklistField(
    backendField: UserFormField,
    fieldConfig: ChecklistConfig
  ): { checklist: Record<string, boolean>; otherValue: string } {
    const checklist = fieldConfig.fields.reduce((acc, field) => {
      acc[field.key] = false;
      return acc;
    }, {} as Record<string, boolean>);

    let otherValue = '';

    if (backendField && typeof backendField.value === 'string') {
      const selectedValues = backendField.value.includes(';')
        ? backendField.value.split(';').map((val) => val.trim())
        : [backendField.value.trim()];

      selectedValues.forEach((value) => {
        if (value.startsWith('other:')) {
          checklist['other'] = true;
          otherValue = value.substring('other:'.length).trim();
        } else if (fieldConfig.fields.some((field) => field.key === value)) checklist[value] = true;
      });
    }

    return { checklist, otherValue };
  }

  private mapCheckboxField(backendField: UserFormField): boolean {
    if (
      backendField &&
      typeof backendField.value === 'string' &&
      ['true', 'false'].includes(backendField.value.toLowerCase())
    )
      return backendField.value === 'true';
    else return false;
  }

  updateUserFormField = (formConfig: FormConfig, key: string, value: string | string[]): void => {
    const { loggedInUser } = this.rootStore.authStore;

    if (!loggedInUser) return;

    const fieldConfig = this.getFieldConfig(formConfig, key);

    if (!fieldConfig) return;

    const formattedValue = this.formatValue(fieldConfig.type, value);
    const formData = this.createFormData(key, formattedValue);

    this.submitFormData(loggedInUser.id, formData);
  };

  private formatValue(fieldType: ConfigFieldKind, value: string | string[]): string {
    switch (fieldType) {
      case ConfigFieldKind.Checklist:
        return Array.isArray(value) ? value.join(';') : value;
      default:
        return String(value);
    }
  }

  private createFormData(
    key: string,
    value: string,
    visitedPage = ''
  ): { key: string; value: string; visitedPage?: string } {
    return { key, value, visitedPage };
  }

  private submitFormData(userId: string, formData: { key: string; value: string; visitedPage?: string }): void {
    requests.updateUserFormField(userId, formData).catch((err) => {
      const { toastMessages } = this.rootStore.toastsStore;
      showErrorToast({ default: toastMessages.USERS.FORM_UPDATE_ERROR }, err);
    });
  }

  updateVisitedPages(userId: string, visitedPage: string): void {
    const formData = { key: VISITED_PAGES_BLANK_KEY, value: '', visitedPage };

    requests.updateUserFormField(userId, formData).catch((err) => {
      const { toastMessages } = this.rootStore.toastsStore;
      showErrorToast({ default: toastMessages.USERS.FORM_UPDATE_ERROR }, err);
    });
  }

  initializeCustomFormStringFields = (keys: string[], isNpo: boolean): void => {
    const { npoForm, setNpoForm } = this.rootStore.npoFormStore;
    const { techLeaderForm, setTechLeaderForm } = this.rootStore.techLeaderFormStore;
    const form = isNpo ? npoForm : techLeaderForm;
    const setForm = isNpo ? setNpoForm : setTechLeaderForm;

    const newFields: Partial<NpoFormType | TechLeaderFormType> = {};

    keys.forEach((key) => {
      if (!(key in form)) {
        newFields[key as CustomQuestionKey] = '';
      }
    });

    if (Object.keys(newFields).length > 0) {
      runInAction(() => {
        const updatedForm = {
          ...form,
          ...newFields,
        };

        setForm(updatedForm as NpoFormType & TechLeaderFormType);
      });
    }
  };

  removeUserForm(userId: string, keys: string[]): Promise<void[]> {
    return Promise.all(keys.map((key) => requests.deleteFormField(userId, key)));
  }
}

export default FormStore;
