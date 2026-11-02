import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { Tab } from '@/domain/types';
import SavedComparisonsTable from '@/matches/savedComparisons/savedComparisonsTable';
import Board from '@/theme/board';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import MatchesTable from '../matchesTable';

const MATCH_TABS: Tab[] = [
  {
    value: 'inComparison',
    label: 'In comparison',
    element: <SavedComparisonsTable />,
  },
  {
    value: 'drafts',
    label: 'Match picked',
    element: <MatchesTable />,
  },
  {
    value: 'sentToCrm',
    label: 'Committed to CRM',
    element: <MatchesTable />,
  },
];

const MatchesBoard = (): JSX.Element => {
  const { matchesStore, savedComparisonsStore } = useStores();
  const {
    sortBy: comparisonsSortBy,
    activePage: comparisonsActivePage,
    fetchComparisons,
    setQuery: setComparisonsQuery,
    setActivePage: setComparisonsActivePage,
    setSortFromURL: setComparisonsSortFromURL,
  } = savedComparisonsStore;
  const { setQuery, activePage, setActivePage, setSortFromURL, fetchMatches, sortBy } = matchesStore;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const activePageFromUrl = searchParams.get('pageNumber');
  const sortByFromUrl = searchParams.get('sortBy');
  const queryFromUrl = searchParams.get('phrase');
  const { tab } = useParams();

  const isInComparisonTab = tab === 'inComparison';

  const pickValueFromStore = <T,>(valueFromMatchesStore: T, valueFromComparesStore: T): T => {
    return isInComparisonTab ? valueFromComparesStore : valueFromMatchesStore;
  };

  const currentActivePage = pickValueFromStore(activePage, comparisonsActivePage);
  const currentSortBy = pickValueFromStore(sortBy, comparisonsSortBy);
  const currentSetQuery = pickValueFromStore(setQuery, setComparisonsQuery);
  const currentSetActivePage = pickValueFromStore(setActivePage, setComparisonsActivePage);
  const currentSetSortFromURL = pickValueFromStore(setSortFromURL, setComparisonsSortFromURL);

  useEffect(() => {
    if (activePageFromUrl) currentSetActivePage(parseInt(activePageFromUrl, 10));
    if (sortByFromUrl) currentSetSortFromURL(sortByFromUrl);
  }, []);

  useEffect(() => {
    currentSetQuery(queryFromUrl || '');
  }, [queryFromUrl, tab]);

  useEffect(() => {
    searchParams.set('sortBy', currentSortBy.toString());
    setSearchParams(searchParams);
  }, [currentSortBy]);

  useEffect(() => {
    searchParams.set('pageNumber', currentActivePage.toString());
    setSearchParams(searchParams);
  }, [currentActivePage]);

  useEffect(() => {
    if (isInComparisonTab) fetchComparisons();
    else fetchMatches({ crmSent: tab === 'sentToCrm' });
  }, [searchParams, tab]);

  useEffect(() => {
    currentSetActivePage(1);
    searchParams.set('pageNumber', '1');
    setSearchParams(searchParams);
  }, [tab]);

  const createNewMatch = (
    <Button
      text="Create new match"
      onClick={() => navigate(routes.NewMatch.path())}
      icon={<Icon icon={icons.add} size={iconSize.medium} />}
      variant="primary"
    />
  );

  return <Board title="Matches" tabs={MATCH_TABS} routeName="Matches" actionsContainer={createNewMatch} />;
};

export default observer(MatchesBoard);
