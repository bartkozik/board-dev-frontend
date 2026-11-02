import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import { DEFAULT_PAGE_SIZE } from '@/domain/constants';
import { SortByParams, SortColumn, SortDirection, SortObject } from '@/domain/sorting';
import { showErrorToast } from '@/utils/helpers';
import { FetchMatchingListParams, RawMatch } from '../types';
import * as requests from './requests';

class MatchesStore {
  rootStore: RootStore;
  matches: RawMatch[] = [];
  loadingMatches = false;
  activePage = 1;
  allMatchesCount = 0;
  allPagesCount = 0;
  query = '';
  sortColumn: SortObject = {
    match: SortColumn.TechLeader,
  };
  sortDirection: SortDirection = SortDirection.Asc;
  sortBy: SortByParams = SortByParams.techLeaderNameAsc;

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
        sortColumn = SortColumn.TechLeader;
        sortDirection = SortDirection.Asc;
        sortBy = SortByParams.techLeaderNameAsc;
        break;
    }

    runInAction(() => {
      this.setSortColumn('match', sortColumn);
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
          newSortBy = SortByParams.techLeaderNameAsc;
          break;
      }

      this.setSortDirection(newSortDirection);
      this.setSortColumn(key, column);
      this.setSortBy(newSortBy);
    };

  fetchMatches = (params?: Partial<FetchMatchingListParams>): Promise<void> => {
    const { toastMessages } = this.rootStore.toastsStore;

    runInAction(() => (this.loadingMatches = true));

    const fetchParams = {
      sortBy: this.sortBy,
      userName: this.query,
      pageNumber: this.activePage,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params,
    };

    return requests
      .fetchMatches(fetchParams)
      .then(({ data }) => {
        runInAction(() => {
          (this.matches = data.results),
            (this.allMatchesCount = data.count),
            (this.allPagesCount = Math.ceil(data.count / DEFAULT_PAGE_SIZE));
        });
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.MATCHES.FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loadingMatches = false));
      });
  };
}

export default MatchesStore;
