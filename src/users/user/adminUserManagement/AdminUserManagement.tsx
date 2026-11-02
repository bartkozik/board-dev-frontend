import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, createSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes, UserRoutes } from '@/app/routes/paths.const';
import { Tab } from '@/domain/types';
import { RawMatch } from '@/matches/types';
import Breadcrumbs, { BreadcrumbType } from '@/theme/breadcrumbs';
import Button from '@/theme/button';
import Chip from '@/theme/chip';
import Icon, { icons, iconSize } from '@/theme/icon';
import IconButton from '@/theme/iconButton';
import LoadingArea from '@/theme/loadingArea/';
import PageHeader from '@/theme/pageHeader';
import Tabs from '@/theme/tabs';
import TooltipMenu from '@/theme/tooltipMenu';
import { User } from '@/users/types';
import { getFilteredTabs } from '@/users/utils';
import { getKeyBaseOnUserRole } from '@/utils/helpers/getKeyBaseOnUserRole';
import { useConfirmRemoveModal, useOnClickOutside, useToggleBlockUserModal, useUserMatch } from '@/utils/hooks';
import styles from './AdminUserManagement.module.scss';
import FormPreview from './formPreview';
import UserDetails from './userDetails';
import UserSummary from './userSummary';
import UserTrainingMaterials from './userTrainingMaterials';

export const USER_TABS = [
  {
    value: 'account',
    label: 'Account details',
    element: <UserDetails />,
  },
  {
    value: 'formPreview',
    label: 'Form',
    element: <FormPreview />,
  },
  {
    value: 'trainingMaterials',
    label: 'Training materials',
    element: <UserTrainingMaterials />,
  },
  { value: 'summary', label: 'Summary', element: <UserSummary /> },
];

interface MatchButtonProps {
  user: User | null;
  userMatchCompleted: boolean;
  userMatchExists?: boolean;
  match: RawMatch | null;
}

const MatchButton = ({ user, match, userMatchCompleted, userMatchExists }: MatchButtonProps): JSX.Element => {
  const navigate = useNavigate();

  const handleMatch = (): void => {
    if (!user) return;
    const key = getKeyBaseOnUserRole(user.roles[0]);
    if (!key) return;
    navigate({
      pathname: routes.NewMatch.path(),
      search: createSearchParams({ [key]: user.id }).toString(),
    });
  };

  const handleViewMatch = (): void => {
    if (!match) return;
    navigate({
      pathname: userMatchCompleted ? routes.Match.path() : routes.NewMatch.path(),
      search: createSearchParams({
        npoUserId: match.npoUserId,
        techLeaderUserId: match.techLeaderUserId,
      }).toString(),
    });
  };

  if (userMatchExists)
    return (
      <Button
        text="View Match"
        onClick={handleViewMatch}
        icon={<Icon icon={icons.match} size={iconSize.medium} />}
        variant="primary"
      />
    );

  if (user?.formCompleted)
    return <Button text="Match" onClick={handleMatch} icon={<Icon icon={icons.match} size={iconSize.medium} />} />;

  return <></>;
};

interface AdminUserManagmentProps {
  breadcrumbs: BreadcrumbType[];
  userRoutes: UserRoutes;
}

const AdminUserManagement = ({ breadcrumbs, userRoutes }: AdminUserManagmentProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userStore } = useStores();
  const { fetchUser, selectedUser, submitting, loadingUser, deleteUser, updateUser } = userStore;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { userMatchExists, userMatchCompleted, match, loading: loadingMatch } = useUserMatch(selectedUser);

  const filteredTabs = getFilteredTabs(USER_TABS, selectedUser);

  const tooltipContainerRef = useRef<HTMLDivElement>(null);

  const { openModal, confirmRemoveModal } = useConfirmRemoveModal({
    onConfirm: () => selectedUser && deleteUser(selectedUser.id || '').then(() => navigate(userRoutes.list())),
    name: selectedUser?.name || 'this user',
    submitting,
  });

  const { openToggleBlockModal, closeToggleBlockModal, confirmToggleBlockModal } = useToggleBlockUserModal({
    onConfirm: () =>
      selectedUser &&
      updateUser({ corporateClientId: selectedUser.corporateClientId, isBlocked: !selectedUser.isBlocked }).then(
        closeToggleBlockModal
      ),
    name: selectedUser?.name || 'this user',
    submitting,
    isBlocked: selectedUser?.isBlocked,
  });

  useEffect(() => {
    if (userId) fetchUser({ userId });
  }, [userId]);

  useOnClickOutside({
    ref: tooltipContainerRef,
    handler: () => setIsTooltipVisible(false),
    condition: isTooltipVisible,
  });

  const onTabClick = (tab: Tab): void | undefined => {
    if (!userId) return;
    navigate(userRoutes.details(userId, tab.value));
  };

  const handleEditUser = (): void => {
    selectedUser && navigate(userRoutes.edit(selectedUser.id));
  };

  const toggleTooltipMenu = (): void => {
    setIsTooltipVisible((prevState) => !prevState);
  };

  const handleUserAction = (action: () => void): void => {
    setIsTooltipVisible(false);
    action();
  };

  const blockUserButtonText = `${selectedUser?.isBlocked ? 'Unblock' : 'Block'} user`;

  return (
    <div className={styles.root}>
      <Breadcrumbs breadcrumbs={breadcrumbs} className={styles.breadcrumbs} />
      <LoadingArea loading={!selectedUser || loadingUser || loadingMatch} className={styles.loadingArea}>
        <PageHeader title={selectedUser?.name || ''} className={styles.header} titleSize="large" isLongTitleBraked>
          <div className={styles.headerContainer}>
            <div className={styles.chips}>
              <Chip label={selectedUser?.type || '---'} />
              {userMatchExists && <Chip label="Matched" />}
            </div>

            <div className={styles.actions} ref={tooltipContainerRef}>
              {!loadingMatch && (
                <MatchButton
                  match={match}
                  user={selectedUser}
                  userMatchCompleted={userMatchCompleted}
                  userMatchExists={userMatchExists}
                />
              )}

              <Button
                text="Edit user"
                onClick={handleEditUser}
                disabled={!selectedUser}
                variant="secondary"
                icon={<Icon icon={icons.pencil} size={iconSize.medium} />}
              />
              <IconButton
                icon={icons.dots}
                ariaLabel="Manage details"
                title="Manage details"
                onClick={toggleTooltipMenu}
                size={iconSize.medium}
                variant="rounded"
              />
              {isTooltipVisible && (
                <TooltipMenu className={styles.tooltipMenu}>
                  <Button
                    text={blockUserButtonText}
                    onClick={() => handleUserAction(openToggleBlockModal)}
                    disabled={!selectedUser}
                    variant="outlined"
                    icon={<Icon icon={selectedUser?.isBlocked ? icons.refresh : icons.block} size={iconSize.medium} />}
                  />
                  <Button
                    text="Remove user"
                    onClick={() => handleUserAction(openModal)}
                    disabled={!selectedUser}
                    variant="outlined"
                    icon={<Icon icon={icons.remove} size={iconSize.medium} />}
                  />
                </TooltipMenu>
              )}
            </div>
          </div>
        </PageHeader>
        <Tabs onTabClick={onTabClick} tabs={filteredTabs} tabsSize="small" />
      </LoadingArea>

      {confirmRemoveModal}
      {confirmToggleBlockModal}
    </div>
  );
};

export default observer(AdminUserManagement);
