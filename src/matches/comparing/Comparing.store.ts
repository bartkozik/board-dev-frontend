import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import { DATE_FORMAT, formatDate, showErrorToast } from '@/utils/helpers';
import { Comparison, RawComparison } from '../types';
import * as requests from './requests';

class ComparingStore {
  rootStore: RootStore;

  submittingComparison = false;
  deletingComparison = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  modelComparison = (comparison: RawComparison): Comparison => {
    return {
      ...comparison,
      formattedCreatedAt: formatDate(comparison.createdAt, DATE_FORMAT.FULL),
    };
  };

  saveComparison = (mainUserId: string, comparedUsersIds: string[]): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submittingComparison = true));

    return requests
      .createComparison(mainUserId, comparedUsersIds)
      .then(() => {
        addToast(toastMessages.COMPARISONS.CREATE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            default: toastMessages.COMPARISONS.CREATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submittingComparison = false)));
  };

  updateComparison = (comparisonId: string, comparedUsersIds: string[]): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submittingComparison = true));

    return requests
      .updateComparison(comparisonId, comparedUsersIds)
      .then(() => {
        addToast(toastMessages.COMPARISONS.UPDATE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            default: toastMessages.COMPARISONS.UPDATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submittingComparison = false)));
  };

  deleteComparison = (comparisonId: string): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.deletingComparison = true));

    return requests
      .deleteComparison(comparisonId)
      .then(() => {
        addToast(toastMessages.COMPARISONS.DELETE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            default: toastMessages.COMPARISONS.DELETE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.deletingComparison = false)));
  };
}

export default ComparingStore;
