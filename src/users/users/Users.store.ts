import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import { DEFAULT_PAGE_SIZE } from '@/domain/constants';
import { SortColumn, SortObject, SortDirection, SortByParams } from '@/domain/sorting';
import { FetchUserListParams } from '@/domain/types';
import { showErrorToast } from '@/utils/helpers';
import * as requests from '../requests';
import { RawUserRole, User } from '../types';

const INITIAL_SORT_BY = {
  readyToMatch: {
    column: 'readyToMatch',
    sortColumn: SortColumn.WaitingForMatch,
    direction: SortDirection.Asc,
    sortBy: SortByParams.createdAtDesc,
  },
  users: {
    column: 'user',
    sortColumn: SortColumn.User,
    direction: SortDirection.Desc,
    sortBy: SortByParams.userNameAsc,
  },
};

const DEFAULT_URL_SORT_BY = {
  [SortByParams.userNameAsc]: { sortColumn: SortColumn.User, sortDirection: SortDirection.Asc },
  [SortByParams.userNameDesc]: { sortColumn: SortColumn.User, sortDirection: SortDirection.Desc },
  [SortByParams.corporateClientNameAsc]: { sortColumn: SortColumn.Company, sortDirection: SortDirection.Asc },
  [SortByParams.corporateClientNameDesc]: { sortColumn: SortColumn.Company, sortDirection: SortDirection.Desc },
  [SortByParams.roleAsc]: { sortColumn: SortColumn.Type, sortDirection: SortDirection.Asc },
  [SortByParams.roleDesc]: { sortColumn: SortColumn.Type, sortDirection: SortDirection.Desc },
  [SortByParams.lastFormUpdateAtAsc]: { sortColumn: SortColumn.FormUpdate, sortDirection: SortDirection.Asc },
  [SortByParams.lastFormUpdateAtDesc]: { sortColumn: SortColumn.FormUpdate, sortDirection: SortDirection.Desc },
};

class UsersStore {
  rootStore: RootStore;
  loadingUsers = false;

  submitting = false;
  users: User[] = [];
  activePage = 1;
  allUsersCount = 0;
  allPagesCount = 0;

  sortColumn: SortObject = {
    user: SortColumn.User,
    readyToMatch: SortColumn.WaitingForMatch,
  };
  sortDirection: SortDirection = SortDirection.Asc;
  query = '';
  sortBy: SortByParams = SortByParams.userNameAsc;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setSortColumn = (key: string, sortColumn: SortColumn): void => {
    this.sortColumn[key] = sortColumn;
  };

  private setSortDirection = (dir: SortDirection): void => {
    this.sortDirection = dir;
  };

  get usersWithoutCompany(): User[] {
    return this.users
      .filter((user) => user.name && !user.corporateClientId && !user.roles.includes(RawUserRole.Admin))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  removeUserFromList = (id: string): void => {
    this.users = this.users.filter((user) => user.id !== id);
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

  private getSortConfigFromUrl = (
    sortBy: SortByParams | string,
    isCreatedAtDescDefault?: boolean
  ): {
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    fallbackSortBy?: SortByParams;
  } => {
    if (sortBy === SortByParams.createdAtAsc) {
      return {
        sortColumn: isCreatedAtDescDefault ? SortColumn.WaitingForMatch : SortColumn.DateAdded,
        sortDirection: isCreatedAtDescDefault ? SortDirection.Desc : SortDirection.Asc,
      };
    }

    if (sortBy === SortByParams.createdAtDesc) {
      return {
        sortColumn: isCreatedAtDescDefault ? SortColumn.WaitingForMatch : SortColumn.DateAdded,
        sortDirection: isCreatedAtDescDefault ? SortDirection.Asc : SortDirection.Desc,
      };
    }

    const map: Record<string, { sortColumn: SortColumn; sortDirection: SortDirection }> = DEFAULT_URL_SORT_BY;

    if (map[sortBy]) return map[sortBy];

    return {
      sortColumn: isCreatedAtDescDefault ? SortColumn.WaitingForMatch : SortColumn.User,
      sortDirection: SortDirection.Asc,
      fallbackSortBy: isCreatedAtDescDefault ? SortByParams.createdAtDesc : SortByParams.userNameAsc,
    };
  };

  setSortFromURL = (sortBy: SortByParams | string, isCreatedAtDescDefault?: boolean): void => {
    const { sortColumn, sortDirection, fallbackSortBy } = this.getSortConfigFromUrl(sortBy, isCreatedAtDescDefault);
    const sortColumnKey = isCreatedAtDescDefault ? 'readyToMatch' : 'user';
    const finalSortBy = fallbackSortBy || sortBy;

    runInAction(() => {
      this.setSortColumn(sortColumnKey, sortColumn);
      this.setSortDirection(sortDirection);
      this.setSortBy(finalSortBy);
    });
  };

  updateSort =
    (key: string) =>
    (column: SortColumn): void => {
      const newSortDirection = this.sortDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;

      let newSortBy: SortByParams;

      switch (column) {
        case SortColumn.User:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.userNameAsc : SortByParams.userNameDesc;
          break;
        case SortColumn.Type:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.roleAsc : SortByParams.roleDesc;
          break;
        case SortColumn.Company:
          newSortBy =
            newSortDirection === SortDirection.Asc
              ? SortByParams.corporateClientNameAsc
              : SortByParams.corporateClientNameDesc;
          break;
        case SortColumn.FormUpdate:
          newSortBy =
            newSortDirection === SortDirection.Asc
              ? SortByParams.lastFormUpdateAtAsc
              : SortByParams.lastFormUpdateAtDesc;
          break;
        case SortColumn.WaitingForMatch:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.createdAtDesc : SortByParams.createdAtAsc;
          break;
        case SortColumn.DateAdded:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.createdAtAsc : SortByParams.createdAtDesc;
          break;
        default:
          newSortBy = SortByParams.userNameAsc;
          break;
      }

      this.setSortDirection(newSortDirection);
      this.setSortColumn(key, column);
      this.setSortBy(newSortBy);
    };

  resetSortBy = ({ isCreatedAtDescDefault }: { isCreatedAtDescDefault?: boolean }): void => {
    const config = isCreatedAtDescDefault ? INITIAL_SORT_BY.readyToMatch : INITIAL_SORT_BY.users;

    this.setSortColumn(config.column, config.sortColumn);
    this.setSortDirection(config.direction);
    this.setSortBy(config.sortBy);
  };

  checkIfEmailUnique = async (email: string): Promise<boolean> => {
    try {
      const { data } = await requests.fetchUsers({ email, pageNumber: 1, pageSize: 1 });

      return data.count === 0;
    } catch (err) {
      return false;
    }
  };

  fetchUsers = (params?: Partial<FetchUserListParams>): Promise<User[] | void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const { modelUser } = this.rootStore.userStore;
    runInAction(() => (this.loadingUsers = true));

    const fetchParams = {
      sortBy: this.sortBy,
      phrase: this.query ? this.query : undefined,
      pageNumber: this.activePage,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params,
    };

    return requests
      .fetchUsers(fetchParams)
      .then(({ data }) => {
        const fetchedUsers = data.results.map(modelUser);
        runInAction(
          () => (
            (this.users = fetchedUsers),
            (this.allUsersCount = data.count),
            (this.allPagesCount = Math.ceil(data.count / DEFAULT_PAGE_SIZE))
          )
        );

        return fetchedUsers;
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.USERS.FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loadingUsers = false));
      });
  };
}

export default UsersStore;
