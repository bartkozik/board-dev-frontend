import { makeAutoObservable, runInAction } from 'mobx';
import { AxiosResponse } from 'axios';
import { RootStore } from '@/RootStore';
import { DEFAULT_FORM_MESSAGES } from '@/domain/constants';
import { SortByParams, SortDirection } from '@/domain/sorting';
import { RawUserRole, User, UserRole } from '@/users/types';
import {
  API_ERROR_STATUS_TYPE,
  convertCustomQuestionsToFormConfig,
  DATE_FORMAT,
  formatDate,
  showErrorToast,
} from '@/utils/helpers';
import * as requests from '../requests';
import {
  CorporateClient,
  CustomFormQuestion,
  CustomMessaging,
  RawCorporateClient,
  MessageKeys,
  RawCustomFormQuestion,
  CustomQuestionFormData,
  CustomQuestionKey,
  CorporateClientUpdateData,
  MessageValue,
} from '../types';
import { createInitialMessaging } from '../utils';

const INITIAL_FORM_CUSTOM_QUESTIONS: CustomFormQuestion[] = Object.values(CustomQuestionKey).map((key, index) => ({
  id: key,
  label: `Question #${index + 1}`,
  required: false,
  value: '',
}));

const INITIAL_TECH_LEADER_MESSAGING = createInitialMessaging(
  CustomMessaging.TECH_LEADER_WELCOME,
  CustomMessaging.TECH_LEADER_THANK_YOU,
  DEFAULT_FORM_MESSAGES.WELCOME.TECH_LEADER,
  DEFAULT_FORM_MESSAGES.THANK_YOU.TECH_LEADER
);

const INITIAL_NPO_MESSAGING = createInitialMessaging(
  CustomMessaging.NPO_WELCOME,
  CustomMessaging.NPO_THANK_YOU,
  DEFAULT_FORM_MESSAGES.WELCOME.NPO,
  DEFAULT_FORM_MESSAGES.THANK_YOU.NPO
);

class CorporateClientStore {
  rootStore: RootStore;
  loading = false;
  corporateClient: CorporateClient | undefined;
  submitting = false;
  activePage = 1;
  query = '';
  sortBy: SortByParams = SortByParams.userNameDesc;
  sortDirection: SortDirection = SortDirection.Asc;

  customQuestions: RawCustomFormQuestion[] = [];
  loadingQuestions = false;
  debouncedCustomQuestionUpdate: NodeJS.Timeout | null = null;

  customFormQuestions = {
    techLeader: INITIAL_FORM_CUSTOM_QUESTIONS,
    npo: INITIAL_FORM_CUSTOM_QUESTIONS,
  };

  customMessaging = {
    techLeader: INITIAL_TECH_LEADER_MESSAGING,
    npo: INITIAL_NPO_MESSAGING,
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private getMessageValue = (section: RawUserRole, key: CustomMessaging): MessageValue | undefined => {
    const messaging = section === RawUserRole.TechLeader ? this.customMessaging.techLeader : this.customMessaging.npo;
    return messaging.find((group) => group.key === key);
  };

  setMessageValue = (section: RawUserRole, key: CustomMessaging, fieldKey: MessageKeys, value: string): void => {
    const messageGroup = this.getMessageValue(section, key);

    if (messageGroup) {
      const field = messageGroup.fields.find((f) => f.key === fieldKey);
      if (field) field.value = value;
    }
  };

  updateMessageValue = (section: RawUserRole, key: CustomMessaging, value: string): void => {
    const messageValue = this.getMessageValue(section, key);

    if (messageValue) {
      const customField = messageValue.fields.find((f) => f.key === MessageKeys.Custom);

      if (customField) {
        const isKeyExists = this.corporateClient && key in this.corporateClient;
        const isValuesDiffer = this.corporateClient?.[key]?.trim() !== value.trim();
        customField.value = value;

        if (this.corporateClient && isKeyExists && isValuesDiffer) {
          this.updateCorporateClient({ [key]: value.trim() });
          this.corporateClient[key] = value.trim();
        }
      }
    }
  };

  private initializeFields = (messages: MessageValue[]): MessageValue[] => {
    return messages.map((message) => {
      return {
        ...message,
        fields: message.fields.map((field) => {
          if (field.key === MessageKeys.Custom) {
            const corporateClientValue = this.corporateClient?.[message.key];
            return {
              ...field,
              value: corporateClientValue ? corporateClientValue : field.value,
            };
          }
          return field;
        }),
      };
    });
  };

  private initializeAllMessaging = (): void => {
    const customMessaging = {
      techLeader: this.initializeFields(INITIAL_TECH_LEADER_MESSAGING),
      npo: this.initializeFields(INITIAL_NPO_MESSAGING),
    };

    runInAction(() => {
      this.customMessaging = customMessaging;
    });
  };

  private initializeSpecificMessage = (section: RawUserRole, label: CustomMessaging): void => {
    const isTechLeader = section === RawUserRole.TechLeader;
    const initialData = isTechLeader ? INITIAL_TECH_LEADER_MESSAGING : INITIAL_NPO_MESSAGING;

    const messageToInitialize = initialData.find((m) => m.key === label);
    if (!messageToInitialize) return;

    const [initializedMessage] = this.initializeFields([messageToInitialize]);

    runInAction(() => {
      const sectionToUpdate = isTechLeader ? 'techLeader' : 'npo';

      this.customMessaging[sectionToUpdate] = this.customMessaging[sectionToUpdate].map((currentMessage) =>
        currentMessage.key === label ? initializedMessage : currentMessage
      );
    });
  };

  initializeCustomMessaging = (sectionKey?: RawUserRole, labelKey?: CustomMessaging): void => {
    if (!sectionKey || !labelKey) this.initializeAllMessaging();
    else this.initializeSpecificMessage(sectionKey, labelKey);
  };

  private getFormQuestion = (section: RawUserRole, id: CustomQuestionKey): CustomFormQuestion | undefined => {
    const questions = section === RawUserRole.NPO ? this.customFormQuestions.npo : this.customFormQuestions.techLeader;
    return questions.find((q) => q.id === id);
  };

  private initializeCustomQuestions = (): void => {
    this.customQuestions.map((rawQuestion) => {
      const existingQuestion = this.getFormQuestion(rawQuestion.role, rawQuestion.key);

      if (existingQuestion) ({ content: existingQuestion.value, isRequired: existingQuestion.required } = rawQuestion);
    });
  };

  setQuestionValue = (section: RawUserRole, id: CustomQuestionKey, value: string): void => {
    const question = this.getFormQuestion(section, id);
    if (question) {
      const previousValue = question.value;
      question.value = value;

      if (previousValue?.trim() !== value.trim()) {
        const updatedData = {
          key: id,
          role: section,
          content: value,
          isRequired: question.required,
        };
        this.updateCustomFormQuestion(updatedData);
      }
    }
  };

  toggleIsQuestionRequired = (section: RawUserRole, id: CustomQuestionKey): void => {
    const question = this.getFormQuestion(section, id);
    if (question) {
      question.required = !question.required;

      const formData = { key: id, role: section, content: question.value, isRequired: question.required };
      this.updateCustomFormQuestion(formData);
    }
  };

  setActivePage = (page: number): void => {
    runInAction(() => (this.activePage = page));
  };

  setQuery = (query: string): void => {
    runInAction(() => (this.query = query));
  };

  setSortBy = (sortBy: SortByParams | string): void => {
    runInAction(() => {
      this.sortBy = sortBy as SortByParams;
    });
  };

  modelCorporateClient = (client: RawCorporateClient): CorporateClient => {
    return {
      ...client,
      formatedCreatedAt: formatDate(client.createdAt, DATE_FORMAT.FULL),
    };
  };

  setSelectedCorporateClientById = (corporateClientId: string): void => {
    const { corporateClients } = this.rootStore.corporateClientsStore;
    const corporateClient = corporateClients.find((corporateClient) => corporateClient.id === corporateClientId);

    if (!corporateClient) return;

    runInAction(() => {
      this.corporateClient = corporateClient;
    });
  };

  fetchCorporateClient = (id: string): Promise<void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.loading = true));

    return requests
      .fetchCorporateClient(id)
      .then(({ data: { results } }) => {
        runInAction(() => (this.corporateClient = this.modelCorporateClient(results[0])));
        this.initializeCustomMessaging();
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.CORPORATE_CLIENTS.CORPORATE_CLIENT_FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loading = false));
      });
  };

  createCorporateClient = (corporateClient: Partial<CorporateClient>): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .createCorporateClient(corporateClient)
      .then(() => {
        this.rootStore.corporateClientsStore.fetchCorporateClients();
        addToast(toastMessages.CORPORATE_CLIENTS.CREATE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            409: {
              [API_ERROR_STATUS_TYPE.DUPLICATED_CORPORATE_CLIENT]: toastMessages.CORPORATE_CLIENTS.ALREADY_EXISTS,
            },
            default: toastMessages.CORPORATE_CLIENTS.CREATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  updateCorporateClient = (data: CorporateClientUpdateData): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    if (!this.corporateClient?.id) return Promise.resolve();

    const keys = [
      'name',
      'techLeaderThankYouMessage',
      'npoThankYouMessage',
      'npoWelcomeMessage',
      'techLeaderWelcomeMessage',
      'trainingMaterialsUrl',
    ] as const;

    const formData: Partial<CorporateClient> = keys.reduce((acc, key) => {
      acc[key] = data[key] !== undefined ? data[key] : this.corporateClient?.[key];
      return acc;
    }, {} as Partial<CorporateClient>);

    return requests
      .updateCorporateClient(this.corporateClient.id, formData)
      .then(() => {
        runInAction(() => {
          if (this.corporateClient)
            this.corporateClient = {
              ...this.corporateClient,
              npoThankYouMessage: formData.npoThankYouMessage ?? '',
              techLeaderThankYouMessage: formData.techLeaderThankYouMessage ?? '',
              npoWelcomeMessage: formData.npoWelcomeMessage ?? '',
              techLeaderWelcomeMessage: formData.techLeaderWelcomeMessage ?? '',
              trainingMaterialsUrl: formData.trainingMaterialsUrl ?? '',
            };
        });

        addToast(toastMessages.CORPORATE_CLIENTS.UPDATE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            404: toastMessages.CORPORATE_CLIENTS.NO_CORPORATE_CLIENT,
            default: toastMessages.CORPORATE_CLIENTS.UPDATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  deleteCorporateClient = (corporateClientId: string): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .deleteCorporateClient(corporateClientId)
      .then(() =>
        runInAction(() => {
          this.rootStore.corporateClientsStore.fetchCorporateClients();
          addToast(toastMessages.CORPORATE_CLIENTS.DELETE_SUCCESS, 'success');
        })
      )
      .catch((err) =>
        showErrorToast(
          {
            404: toastMessages.CORPORATE_CLIENTS.NO_CORPORATE_CLIENT,
            default: toastMessages.CORPORATE_CLIENTS.DELETE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  private convertAndInitializeCustomQuestions = (customQuestions: RawCustomFormQuestion[], user: User): void => {
    const { initializeCustomFormStringFields } = this.rootStore.formStore;

    const additionalQuestions = convertCustomQuestionsToFormConfig(customQuestions, user.roles[0]);
    const additionalQuestionKeys = additionalQuestions.map((question) => question.name);

    const isNPO = user.type === UserRole.NPO;

    initializeCustomFormStringFields(additionalQuestionKeys, isNPO);
  };

  fetchCustomFormQuestions = (id: string): Promise<void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const { selectedUser } = this.rootStore.userStore;

    runInAction(() => (this.loadingQuestions = true));

    return requests
      .fetchCorporateClientCustomQuestions(id)
      .then(({ data: { results } }) => {
        runInAction(() => {
          this.customQuestions = results;

          if (selectedUser) this.convertAndInitializeCustomQuestions(this.customQuestions, selectedUser);

          this.initializeCustomQuestions();
        });
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.CORPORATE_CLIENTS.QUESTIONS_FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loadingQuestions = false));
      });
  };

  private updateCustomFormQuestion = (
    question: CustomQuestionFormData
  ): Promise<void | AxiosResponse<RawCustomFormQuestion>> => {
    const { toastMessages } = this.rootStore.toastsStore;

    if (!this.corporateClient) return Promise.resolve();

    return requests.updateCorporateClientCustomQuestion(this.corporateClient.id, question).catch((err) => {
      showErrorToast({ default: toastMessages.CORPORATE_CLIENTS.QUESTIONS_UPDATE_ERROR }, err);
    });
  };

  resetCorporateClient = (): void => {
    runInAction(() => (this.corporateClient = undefined));
  };
}

export default CorporateClientStore;
