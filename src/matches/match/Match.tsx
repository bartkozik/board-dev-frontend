import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import Breadcrumbs from '@/theme/breadcrumbs';
import Loader from '@/theme/loader';
import { getKeyBaseOnUserRole } from '@/utils/helpers/getKeyBaseOnUserRole';
import { useLocalStorageFilters, useUrlFilters } from '@/utils/hooks';
import { MATCH_INITIAL } from '../constants';
import SummaryPreview from './matchDetails';
import MatchForm from './matchForm';
import { getAvailableRoles, getKeyForName } from './utils';

const Match = (): JSX.Element => {
  const { matchStore, userStore, usersStore } = useStores();
  const {
    match,
    areUsersSelected,
    isOneUserSelected,
    loading,
    setMatchedUsers,
    fetchMatch,
    updateMatch,
    setInitialMatchForm,
  } = matchStore;
  const { fetchUser, loadingUser } = userStore;
  const { fetchUsers } = usersStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname, state } = useLocation();
  const techLeaderUserIdFromUrl = searchParams.get('techLeaderUserId');
  const npoUserIdFromUrl = searchParams.get('npoUserId');
  const availableRoles = getAvailableRoles(match);
  const filtersFromLS = useLocalStorageFilters(availableRoles[0]);
  const currentUrlFilters = useUrlFilters(availableRoles[0]);

  const handleSelectedUserFromUrl = (selectedUserFromUrl: string): void => {
    fetchUser({ userId: selectedUserFromUrl }).then((selectedUser) => {
      if (selectedUser) {
        const key = getKeyBaseOnUserRole(selectedUser.roles[0]);
        const keyForName = getKeyForName(key);
        updateMatch({
          ...MATCH_INITIAL,
          [key]: selectedUser.id,
          [keyForName]: selectedUser.name,
        });
        setMatchedUsers([selectedUser]);
      }
    });
  };

  useEffect(() => {
    if (state?.fromComparing) return;
    else if (techLeaderUserIdFromUrl && npoUserIdFromUrl) {
      const usersIdsArray = [npoUserIdFromUrl, techLeaderUserIdFromUrl];
      fetchMatch(npoUserIdFromUrl, techLeaderUserIdFromUrl);
      fetchUsers({ id: usersIdsArray }).then((users) => {
        users && setMatchedUsers(users);
      });
    } else if (techLeaderUserIdFromUrl || npoUserIdFromUrl) {
      const selectedUserFromUrl = techLeaderUserIdFromUrl ?? npoUserIdFromUrl;
      selectedUserFromUrl && handleSelectedUserFromUrl(selectedUserFromUrl);
    } else {
      setInitialMatchForm();
    }
  }, [techLeaderUserIdFromUrl, npoUserIdFromUrl]);

  useEffect(() => {
    if (areUsersSelected || !isOneUserSelected) {
      searchParams.delete('sortByFormAnswer');
      searchParams.delete('sortBy');
      setSearchParams(searchParams);
    }
  }, [areUsersSelected, isOneUserSelected]);

  const matchElement =
    pathname === routes.Match.path() ? (
      <SummaryPreview />
    ) : (
      <MatchForm urlFilters={currentUrlFilters} localStorageFilters={filtersFromLS} />
    );

  return (
    <div>
      <Breadcrumbs />
      <Loader loading={loading || loadingUser} />
      {!loading && !loadingUser && matchElement}
    </div>
  );
};

export default observer(Match);
