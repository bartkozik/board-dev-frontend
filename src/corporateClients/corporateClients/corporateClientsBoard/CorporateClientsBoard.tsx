import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import AddCorporateClient from '@/corporateClients/corporateClient/addCorporateClient/';
import Board from '@/theme/board';
import CorporateClientsTable from '../corporateClientsTable';

const TABS = [
  {
    value: 'list',
    label: 'All clients',
    element: <CorporateClientsTable />,
  },
];

const CorporateClientsBoard = (): JSX.Element => {
  const { corporateClientsStore } = useStores();
  const { activePage, sortBy, fetchCorporateClients, setActivePage, setSortFromURL, setQuery } = corporateClientsStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const activePageFromUrl = searchParams.get('pageNumber');
  const sortByFromUrl = searchParams.get('sortBy');
  const queryFromUrl = searchParams.get('phrase');

  useEffect(() => {
    if (activePageFromUrl) setActivePage(parseInt(activePageFromUrl, 10));
    if (sortByFromUrl) setSortFromURL(sortByFromUrl);
  }, []);

  useEffect(() => {
    setActivePage(1);
    setQuery(queryFromUrl || '');
  }, [queryFromUrl]);

  useEffect(() => {
    searchParams.set('sortBy', sortBy.toString());
    setSearchParams(searchParams);
  }, [sortBy]);

  useEffect(() => {
    searchParams.set('pageNumber', activePage.toString());
    setSearchParams(searchParams);
  }, [activePage]);

  useEffect(() => {
    fetchCorporateClients();
  }, [searchParams]);

  return <Board title="Companies" actionsContainer={<AddCorporateClient />} tabs={TABS} routeName="CorporateClients" />;
};

export default observer(CorporateClientsBoard);
