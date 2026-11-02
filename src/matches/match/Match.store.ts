import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import { User } from '@/users/types';
import { showErrorToast } from '@/utils/helpers';
import { MATCH_FORM_KEYS, MATCH_INITIAL } from '../constants';
import { MatchFormType, MatchSummary, RawMatch } from '../types';
import * as requests from './requests';

class MatchStore {
  rootStore: RootStore;
  match: MatchFormType | RawMatch = MATCH_INITIAL;
  matchedUsers: User[] = [];
  submitting: boolean = false;
  loading: boolean = false;
  isEditing: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get areUsersSelected(): boolean {
    return Boolean(this.match?.npoUserId && this.match?.techLeaderUserId);
  }

  get isOneUserSelected(): boolean {
    return Boolean(this.match?.npoUserId || this.match?.techLeaderUserId) && !this.areUsersSelected;
  }

  setIsEditing = (isEditing: boolean): void => {
    this.isEditing = isEditing;
  };

  setInitialMatchForm = (): void => {
    this.match = MATCH_INITIAL;
  };

  setMatchedUsers = (matchedUsers: User[]): void => {
    this.matchedUsers = matchedUsers;
  };

  updateMatch = (match: Partial<RawMatch>): void => {
    this.match = { ...this.match, ...match };
  };

  fetchMatch = (npoUserId?: string, techLeaderUserId?: string): Promise<void> => {
    if (!npoUserId && !techLeaderUserId) return Promise.resolve();

    const { toastMessages } = this.rootStore.toastsStore;

    runInAction(() => (this.loading = true));
    return requests
      .fetchMatch({ npoUserId, techLeaderUserId })
      .then(({ data }) => {
        this.updateMatch(data.results[0]);
      })
      .catch((error) => showErrorToast({ default: toastMessages.DEFAULT.ERROR }, error))
      .finally(() => runInAction(() => (this.loading = false)));
  };

  saveDraft = (): Promise<void> => {
    const { toastMessages, addToast } = this.rootStore.toastsStore;
    this.submitting = true;

    const form: MatchFormType = {
      ...MATCH_FORM_KEYS.reduce((acc, key) => {
        return { ...acc, [key]: this.match[key] };
      }, {} as MatchFormType),
    };

    return requests
      .saveMatch(form)
      .then(() => {
        addToast(toastMessages.MATCHES.SAVE_DRAFT_SUCCESS, 'success');
      })
      .catch((error) => {
        showErrorToast({ default: toastMessages.MATCHES.SAVE_DRAFT_ERROR }, error);
      })
      .finally(() => {
        runInAction(() => (this.submitting = false));
      });
  };

  sendToCRM = (): Promise<void> => {
    const { toastMessages, addToast } = this.rootStore.toastsStore;
    this.submitting = true;

    const form: MatchFormType = {
      ...MATCH_FORM_KEYS.reduce((acc, key) => {
        return { ...acc, [key]: this.match[key] };
      }, {} as MatchFormType),
    };

    return requests
      .sendToCRM(form)
      .then(() => {
        addToast(toastMessages.MATCHES.SEND_TO_CRM_SUCCESS, 'success');
      })
      .catch((error) => {
        showErrorToast({ default: toastMessages.MATCHES.SEND_TO_CRM_ERROR }, error);
      })
      .finally(() => {
        runInAction(() => (this.submitting = false));
      });
  };

  removeMatch = (npoUserId: string, techLeaderUserId: string): Promise<void> => {
    return requests.deleteMatch({ npoUserId, techLeaderUserId });
  };

  generateSummary = (prompt: string): Promise<MatchSummary | void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const params = {
      npoUserId: this.match.npoUserId,
      techLeaderUserId: this.match.techLeaderUserId,
      customizationPrompt: prompt,
    };
    runInAction(() => (this.submitting = true));

    return requests
      .generateMatchSummary(params)
      .then(({ data }) => data)
      .catch((error) => showErrorToast({ default: toastMessages.DEFAULT.ERROR }, error))
      .finally(() => {
        runInAction(() => (this.submitting = false));
      });
  };
}

export default MatchStore;
