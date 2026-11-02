import { makeAutoObservable, runInAction } from 'mobx';
import { ToastsStore } from '@/toasts';
import * as requests from '@/users/requests';
import { showErrorToast } from '@/utils/helpers';

class UserSummaryStore {
  toastsStore: ToastsStore;
  submitting = false;
  loading = false;
  constructor(toastsStore: ToastsStore) {
    this.toastsStore = toastsStore;
    makeAutoObservable(this);
  }

  generateSummary = (userId: string, prompt: string): Promise<{ shortSummary: string; longSummary: string } | void> => {
    const { toastMessages } = this.toastsStore;
    this.loading = true;
    return requests
      .generateUserSummary(userId, { customizationPrompt: prompt })
      .then((response) => response.data)
      .catch((error) => showErrorToast({ default: toastMessages.DEFAULT.ERROR }, error))
      .finally(() => {
        runInAction(() => (this.loading = false));
      });
  };

  updateUserSummary = (formData: {
    userId: string;
    shortFormSummary: string;
    longFormSummary: string;
  }): Promise<void> => {
    const { addToast, toastMessages } = this.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .updateUser(formData)
      .then(() => {
        addToast(toastMessages.USERS.UPDATE_SUCCESS, 'success');
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
}

export default UserSummaryStore;
