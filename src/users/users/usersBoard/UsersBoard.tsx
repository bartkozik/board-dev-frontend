import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { INSTRUCTIONS } from '@/domain/instructions';
import { SortByParams } from '@/domain/sorting';
import { Tab } from '@/domain/types';
import Board from '@/theme/board';
import AddUser from '@/users/user/addUser';
import ReadyMatchTable from '@/users/users/readyMatchTable';
import UsersTable from '../usersTable';

export const USERS_TABS: Tab[] = [
  {
    value: 'list',
    label: 'All users',
    element: <UsersTable />,
  },
  {
    value: 'readyToMatch',
    label: 'Ready to match',
    element: <ReadyMatchTable />,
  },
  {
    value: 'matched',
    label: 'Matched',
    element: <UsersTable />,
  },
];

const UsersBoard = (): JSX.Element => {
  const { usersStore } = useStores();
  const { setQuery, activePage, setActivePage, setSortFromURL, fetchUsers, resetSortBy, sortBy } = usersStore;

  const [searchParams, setSearchParams] = useSearchParams();
  const activePageFromUrl = searchParams.get('pageNumber');
  const sortByFromUrl = searchParams.get('sortBy');
  const queryFromUrl = searchParams.get('phrase');
  const { tab } = useParams();

  useEffect(() => {
    const sortByFromUrl = searchParams.get('sortBy');

    if (sortByFromUrl !== SortByParams.createdAtDesc && tab === USERS_TABS[1].value)
      resetSortBy({ isCreatedAtDescDefault: true });
    else if (sortByFromUrl !== SortByParams.userNameAsc) resetSortBy({ isCreatedAtDescDefault: false });

    setSearchParams(searchParams);
  }, [tab]);

  useEffect(() => {
    searchParams.set('sortBy', sortBy.toString());
    setSearchParams(searchParams);
  }, [sortBy]);

  useEffect(() => {
    if (activePageFromUrl) setActivePage(parseInt(activePageFromUrl, 10));
    if (sortByFromUrl) setSortFromURL(sortByFromUrl, tab === USERS_TABS[1].value);

    setSearchParams(searchParams);
  }, []);

  useEffect(() => {
    setActivePage(1);
    setQuery(queryFromUrl || '');
  }, [queryFromUrl]);

  useEffect(() => {
    searchParams.set('pageNumber', activePage.toString());
    setSearchParams(searchParams);
  }, [activePage]);

  useEffect(() => {
    const params = {
      readyForMatch: tab === USERS_TABS[1].value ? true : undefined,
      matched: tab === USERS_TABS[2].value ? true : undefined,
    };
    fetchUsers(params);
  }, [searchParams, tab]);

  useEffect(() => {
    setActivePage(1);
    searchParams.set('pageNumber', '1');
    setSearchParams(searchParams);
  }, [tab]);

  useEffect(() => {
    return () => setQuery('');
  }, []);

  return (
    <Board
      title="Users"
      actionsContainer={<AddUser />}
      tabs={USERS_TABS}
      routeName="Users"
      instruction={tab === 'readyToMatch' || tab === 'matched' ? INSTRUCTIONS.users[tab] : undefined}
    />
  );
};

export default observer(UsersBoard);
