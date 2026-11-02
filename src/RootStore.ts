import { createContext, useContext } from 'react';
import { AuthStore } from '@/auth';
import { MatchesStore, MatchStore, ComparingStore, SavedComparisonsStore } from '@/matches';
import { ToastsStore } from '@/toasts';
import { UserStore, UsersStore } from '@/users';
import { CorporateClientsStore, CorporateClientStore } from './corporateClients';
import { TechLeaderFormStore } from './forms';
import FormStore from './forms/Form.store';
import { NpoFormStore } from './forms/NPOform';

export class RootStore {
  authStore: AuthStore;
  corporateClientsStore: CorporateClientsStore;
  corporateClientStore: CorporateClientStore;
  comparingStore: ComparingStore;
  formStore: FormStore;
  npoFormStore: NpoFormStore;
  matchesStore: MatchesStore;
  matchStore: MatchStore;
  toastsStore: ToastsStore;
  usersStore: UsersStore;
  userStore: UserStore;
  techLeaderFormStore: TechLeaderFormStore;
  savedComparisonsStore: SavedComparisonsStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.corporateClientsStore = new CorporateClientsStore(this);
    this.corporateClientStore = new CorporateClientStore(this);
    this.comparingStore = new ComparingStore(this);
    this.formStore = new FormStore(this);
    this.npoFormStore = new NpoFormStore(this);
    this.matchesStore = new MatchesStore(this);
    this.matchStore = new MatchStore(this);
    this.toastsStore = new ToastsStore(this);
    this.usersStore = new UsersStore(this);
    this.userStore = new UserStore(this);
    this.techLeaderFormStore = new TechLeaderFormStore(this);
    this.savedComparisonsStore = new SavedComparisonsStore(this);
  }
}

export const rootStore = new RootStore();

const RootStoreContext = createContext(rootStore);

export function useStores(): RootStore {
  const context = useContext(RootStoreContext);
  if (context === undefined) throw new Error('useRootStore must be used within RootStoreProvider');

  return context;
}

export default RootStoreContext;
