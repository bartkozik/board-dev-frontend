import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { MessageAfterCompleted } from '@/forms/components';
import LoadingArea from '@/theme/loadingArea';
import PageHeader from '@/theme/pageHeader';
import { useStatus, useTitle, useUserMatch } from '@/utils/hooks';
import styles from './Dashboard.module.scss';
import { UserStatus, UserTiles } from './components';

const Dashboard = (): JSX.Element => {
  const { authStore, userStore, formStore } = useStores();
  const { loggedInUser } = authStore;
  const { selectedUser, loadingUser, fetchUser } = userStore;
  const { formCompletionDetails } = formStore;

  const { state } = useLocation();
  const { userMatchCompleted: userIsMatched } = useUserMatch(selectedUser);

  const status = useStatus(selectedUser, userIsMatched);
  const userName = selectedUser && (selectedUser.primaryContactFullName || selectedUser.name).split(' ')[0];

  useEffect(() => {
    if (!selectedUser && loggedInUser) fetchUser({ userId: loggedInUser.id, initializeFormData: true });
  }, [loggedInUser, selectedUser, fetchUser]);

  useTitle('Dashboard');

  return (
    <div className="page">
      <LoadingArea loading={loadingUser} className={styles.container}>
        <PageHeader title={`Welcome, ${userName}`} titleSize="large" />
        <UserStatus status={status} />
        <MessageAfterCompleted isCompleted={Boolean(selectedUser?.formCompleted)} previousPath={state?.previous} />
        <UserTiles
          user={selectedUser}
          formPercentageCompletion={formCompletionDetails.formCompletion}
          userIsMatched={userIsMatched}
        />
        <Outlet />
      </LoadingArea>
    </div>
  );
};

export default observer(Dashboard);
