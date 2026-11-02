import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import { DEFAULT_PAGE_SIZE } from '@/domain/constants';
import { SortColumn, SortObject, SortDirection, SortByParams } from '@/domain/sorting';
import { FetchCorporateClientListParams } from '@/domain/types';
import { FilterOption } from '@/matches/types';
import { SelectOption } from '@/theme/select/Select';
import { showErrorToast } from '@/utils/helpers';
import * as requests from '../requests';
import { CorporateClient } from '../types';

class CorporateClientsStore {
  rootStore: RootStore;

  loading = false;
  submitting = false;
  corporateClients: CorporateClient[] = [];
  activePage = 1;
  allUsersCount = 0;
  allPagesCount = 0;

  sortColumn: SortObject = {
    corporateClient: SortColumn.CompanyName,
  };
  sortDirection: SortDirection = SortDirection.Asc;
  query = '';
  sortBy: SortByParams = SortByParams.corporateClientNameDesc;

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

  get params(): FetchCorporateClientListParams {
    return {
      sortBy: this.sortBy,
      phrase: this.query,
      pageNumber: this.activePage,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }

  get corporateClientsSelectOptions(): SelectOption[] {
    return [
      { value: '', label: 'No company' },
      ...this.corporateClients.map((company) => ({
        value: company.id,
        label: company.name,
      })),
    ];
  }

  get corporateClientsFilterOptions(): FilterOption[] {
    return [
      { value: 'public', key: 'Public', label: 'Public' },
      ...this.corporateClients.map((company) => ({
        value: company.id,
        key: company.name,
        label: company.name,
      })),
    ];
  }

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

  setSortFromURL = (sortBy: SortByParams | string): void => {
    let sortColumn: SortColumn;
    let sortDirection: SortDirection;

    switch (sortBy) {
      case SortByParams.corporateClientNameAsc:
        sortColumn = SortColumn.CompanyName;
        sortDirection = SortDirection.Asc;
        break;
      case SortByParams.corporateClientNameDesc:
        sortColumn = SortColumn.CompanyName;
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
      case SortByParams.memberCountAsc:
        sortColumn = SortColumn.Members;
        sortDirection = SortDirection.Asc;
        break;
      case SortByParams.memberCountDesc:
        sortColumn = SortColumn.Members;
        sortDirection = SortDirection.Desc;
        break;
      default:
        sortColumn = SortColumn.CompanyName;
        sortDirection = SortDirection.Asc;
        sortBy = SortByParams.corporateClientNameAsc;
        break;
    }

    runInAction(() => {
      this.setSortColumn('corporateClient', sortColumn);
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
        case SortColumn.CompanyName:
          newSortBy =
            newSortDirection === SortDirection.Asc
              ? SortByParams.corporateClientNameAsc
              : SortByParams.corporateClientNameDesc;
          break;
        case SortColumn.DateAdded:
          newSortBy = newSortDirection === SortDirection.Asc ? SortByParams.createdAtAsc : SortByParams.createdAtDesc;
          break;
        case SortColumn.Members:
          newSortBy =
            newSortDirection === SortDirection.Asc ? SortByParams.memberCountAsc : SortByParams.memberCountDesc;
          break;
        default:
          newSortBy = SortByParams.corporateClientNameAsc;
          break;
      }

      this.setSortDirection(newSortDirection);
      this.setSortColumn(key, column);
      this.setSortBy(newSortBy);
    };

  fetchCorporateClients = (): Promise<void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const { modelCorporateClient } = this.rootStore.corporateClientStore;
    runInAction(() => (this.loading = true));

    return requests
      .fetchCorporateClients(this.params)
      .then(({ data }) => {
        runInAction(
          () => (
            (this.corporateClients = data.results.map(modelCorporateClient)),
            (this.allUsersCount = data.count),
            (this.allPagesCount = Math.ceil(data.count / DEFAULT_PAGE_SIZE))
          )
        );
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.USERS.CORPORATE_CLIENT_FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loading = false));
      });
  };

  removeCorporateClientFromList = (id: string): void => {
    this.corporateClients = this.corporateClients.filter((client) => client.id !== id);
  };
}

export default CorporateClientsStore;
