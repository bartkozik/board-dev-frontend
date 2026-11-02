import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import { DEFAULT_PAGE_SIZE } from '@/domain/constants';
import { SortByParams, SortColumn, SortDirection, SortObject } from '@/domain/sorting';
import { showErrorToast } from '@/utils/helpers';
import { Comparison, FetchComparisonsListParams } from '../types';
import * as requests from './requests';

class SavedComparisonsStore {
  rootStore: RootStore;

  comparisons: Comparison[] = [];
  loadingComparisons = false;

  activePage = 1;
  allComparisonsCount = 0;
  allPagesCount = 0;

  sortColumn: SortObject = { comparison: SortColumn.DateAdded };
  sortDirection: SortDirection = SortDirection.Asc;
  query = '';
  sortBy: SortByParams = SortByParams.createdAtAsc;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setActivePage = (page: number): void => {
    runInAction(() => (this.activePage = page));
  };

  setQuery = (query: string): void => {
    runInAction(() => (this.query = query));
  };

  private setSortColumn = (key: string, sortColumn: SortColumn): void => {
    this.sortColumn[key] = sortColumn;
  };

  private setSortDirection = (dir: SortDirection): void => {
    this.sortDirection = dir;
  };

  setSortBy = (sortBy: SortByParams | string): void => {
    runInAction(() => {
      this.sortBy = sortBy as SortByParams;
    });
  };

  setSortFromURL = (sortBy: SortByParams | string): void => {
    let sortColumn: SortColumn;
    let sortDirection: SortDirection;

    switch (sortBy) {
      case SortByParams.techLeaderNameAsc:
        sortColumn = SortColumn.TechLeader;
        sortDirection = SortDirection.Asc;
        break;
      case SortByParams.techLeaderNameDesc:
        sortColumn = SortColumn.TechLeader;
        sortDirection = SortDirection.Desc;
        break;
      case SortByParams.npoNameAsc:
        sortColumn = SortColumn.NonProfit;
        sortDirection = SortDirection.Asc;
        break;
      case SortByParams.npoNameDesc:
        sortColumn = SortColumn.NonProfit;
        sortDirection = SortDirection.Desc;
        break;
      case SortByParams.createdAtAsc:
        sortColumn = SortColumn.DateAdded;
        sortDirection = SortDirection.Asc;
        break;
      case SortByParams.createdAtDesc:
        sortColumn = SortColumn.DateAdded;
        sortDirection = SortDirection.Desc;
        break;
      default:
        sortColumn = SortColumn.DateAdded;
        sortDirection = SortDirection.Asc;
        sortBy = SortByParams.createdAtAsc;
        break;
    }

    runInAction(() => {
      this.setSortColumn('comparison', sortColumn);
      this.setSortDirection(sortDirection);
      this.setSortBy(sortBy);
    });
  };

  updateSort =
    (key: string) =>
    (column: SortColumn): void => {
      const newSortDirection = this.sortDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;

      let newSortBy: SortByParams;

      switch (column) {
        case SortColumn.TechLeader:
          newSortBy =
            newSortDirection === SortDirection.Asc ? SortByParams.techLeaderNameAsc : SortByParams.techLeaderNameDesc;
          break;
        case SortColumn.NonProfit:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.npoNameAsc : SortByParams.npoNameDesc;
          break;
        case SortColumn.DateAdded:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.createdAtAsc : SortByParams.createdAtDesc;
          break;
        default:
          newSortBy = SortByParams.createdAtAsc;
          break;
      }

      this.setSortDirection(newSortDirection);
      this.setSortColumn(key, column);
      this.setSortBy(newSortBy);
    };

  fetchComparisons = (params?: Partial<FetchComparisonsListParams>): Promise<void | Comparison[]> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const { modelComparison } = this.rootStore.comparingStore;
    runInAction(() => (this.loadingComparisons = true));

    const fetchParams = {
      sortBy: this.sortBy,
      userName: this.query,
      pageNumber: this.activePage,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params,
    };

    return requests
      .fetchComparisons(fetchParams)
      .then(({ data }) => {
        const fetchedComparisons = data.results.map(modelComparison);
        runInAction(
          () => (
            (this.comparisons = fetchedComparisons),
            (this.allComparisonsCount = data.count),
            (this.allPagesCount = Math.ceil(data.count / DEFAULT_PAGE_SIZE))
          )
        );

        return fetchedComparisons;
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.COMPARISONS.FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loadingComparisons = false));
      });
  };
}

export default SavedComparisonsStore;
