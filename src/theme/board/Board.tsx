import { useEffect } from 'react';
import { useParams, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { routes } from '@/app/routes';
import { Tab } from '@/domain/types';
import PageHeader from '@/theme/pageHeader';
import SearchBar from '@/theme/searchBar';
import Tabs from '@/theme/tabs';
import { useTitle } from '@/utils/hooks';
import styles from './Board.module.scss';

interface BoardProps {
  title: string;
  actionsContainer?: React.ReactNode;
  tabs: Tab[];
  routeName: string;
  withoutSearchBar?: boolean;
  instruction?: string;
}

const Board = ({
  title,
  actionsContainer,
  tabs,
  routeName,
  withoutSearchBar = false,
  instruction,
}: BoardProps): JSX.Element => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab: string }>();

  const [searchParams] = useSearchParams();
  const tabIsValid = tab && tabs.map(({ value }) => value).includes(tab);

  useTitle(`${title} board`);

  useEffect(() => {
    if (!tabIsValid) {
      navigate(routes[routeName].path(tabs[0].value), { replace: true });
    }
  }, [tabIsValid]);

  const onTabClick = (tab: Tab): void => {
    navigate({ pathname: routes[routeName].path(tab.value), search: createSearchParams(searchParams).toString() });
  };

  return (
    <div className="page">
      <div className={styles.topbar}>
        <PageHeader title={title} titleSize="large" />

        <div className={styles.actionsContainer}>
          {actionsContainer}
          {instruction && <div className={styles.instruction}>{instruction}</div>}
          {!withoutSearchBar && <SearchBar withoutButtonInMobileView />}
        </div>
      </div>

      <Tabs onTabClick={onTabClick} tabs={tabs} />
    </div>
  );
};

export default Board;
