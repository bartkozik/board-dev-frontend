import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import Button from '@/theme/button';
import FakeScroll from '@/theme/fakeScroll';
import LoadingArea from '@/theme/loadingArea';
import PageHeader from '@/theme/pageHeader';
import { User } from '@/users/types';
import { getKeyBaseOnUserRole } from '@/utils/helpers';
import { useTableRowHeights, useConnectedElementsScroll, useFixedOnScroll, useFakeScroll } from '@/utils/hooks';
import styles from './Comparing.module.scss';
import ComparisonCard from './components/comparisonCard';
import ComparisonCardHeader from './components/comparisonCardHeader';

export enum ComparisonSource {
  NewMatch = 'new-match',
  Saved = 'saved',
}

interface ComparingProps {
  source: ComparisonSource;
}

const Comparing = ({ source }: ComparingProps): JSX.Element => {
  const { comparingStore, usersStore, matchStore } = useStores();
  const { saveComparison, updateComparison, deleteComparison, submittingComparison, deletingComparison } =
    comparingStore;
  const { fetchUsers, users, loadingUsers } = usersStore;
  const { setMatchedUsers, updateMatch } = matchStore;
  const { userId, compareIds, comparisonId } = useParams<{
    comparisonId: string;
    userId: string;
    compareIds?: string;
  }>();
  const navigate = useNavigate();

  const [excludedUserIds, setExcludedUserIds] = useState<string[]>([]);

  const compareIdsArray = compareIds?.split(',') ?? [];

  const headerRef = useRef<HTMLDivElement>(null);
  const comparingBoardRef = useRef<HTMLDivElement>(null);
  const comparedHeaderContainerRef = useRef<HTMLDivElement>(null);
  const comparedContainerRef = useRef<HTMLDivElement>(null);
  const containerScrollbarRef = useRef<HTMLDivElement>(null);

  const isOnNewMatchTab = source === ComparisonSource.NewMatch;

  useEffect(() => {
    if (userId) {
      const fetchIds = [...compareIdsArray, userId];
      fetchUsers({ id: fetchIds });
    }
  }, []);

  useConnectedElementsScroll([comparedHeaderContainerRef, comparedContainerRef, containerScrollbarRef], loadingUsers, [
    users,
  ]);

  const isFixed = useFixedOnScroll(headerRef);

  const { rowHeights } = useTableRowHeights({
    containerRef: comparingBoardRef,
    isLoading: loadingUsers,
    deps: [users],
  });

  const targetUser = users.find((u) => u.id === userId);
  const comparedUsers = useMemo(() => users.filter((u) => compareIdsArray.includes(u.id)), [users, compareIdsArray]);

  const displayedComparedUsers = useMemo(
    () => comparedUsers.filter((user) => !excludedUserIds.includes(user.id)),
    [comparedUsers, excludedUserIds]
  );

  const { fakeScrollWidth, isFakeScrollVisible } = useFakeScroll(comparedContainerRef, [displayedComparedUsers]);

  if (!targetUser) return <></>;

  const paramKey = getKeyBaseOnUserRole(targetUser.roles?.[0]) || '';

  const mainUserRoleAndId: Record<string, string> = {
    [paramKey]: userId ?? '',
  };

  const onMatchUser = (selectedUser: User): void => {
    const selectedUserKey = getKeyBaseOnUserRole(selectedUser.roles?.[0]) || '';
    setMatchedUsers([targetUser, selectedUser]);
    updateMatch({ ...mainUserRoleAndId, [selectedUserKey]: selectedUser.id });

    navigate(
      {
        pathname: routes.NewMatch.path(),
        search: createSearchParams({ ...mainUserRoleAndId }).toString(),
      },
      { state: { fromComparing: true } }
    );
  };

  const onUserRemove = (userToRemove: User): void => {
    setExcludedUserIds((prev) => [...prev, userToRemove.id]);

    const newCompareIdsArray = compareIdsArray.filter((id) => id !== userToRemove.id);
    const newCompareIds = newCompareIdsArray.join(',');

    const haveNewComparedUsers = newCompareIds.length > 0;

    if (!userId) return;

    const newMatchPathname = haveNewComparedUsers
      ? routes.CompareUsersFromNewMatch.path(userId, newCompareIds)
      : routes.NewMatch.path();

    const newMatchPathSearchParam = !haveNewComparedUsers
      ? createSearchParams(mainUserRoleAndId).toString()
      : undefined;

    const savedComparisonsPathname =
      haveNewComparedUsers && comparisonId
        ? routes.SavedUsersComparison.path(comparisonId, userId, newCompareIds)
        : routes.Matches.path('inComparison');

    const navigateParams = isOnNewMatchTab
      ? { pathname: newMatchPathname, search: newMatchPathSearchParam }
      : { pathname: savedComparisonsPathname };

    navigate(navigateParams);
  };

  const navigateToNewMatch = (): void => {
    navigate({
      pathname: routes.NewMatch.path(),
      search: createSearchParams(mainUserRoleAndId).toString(),
    });
  };

  const displayedUsersIds = displayedComparedUsers.map((u) => u.id);

  const navigateToSavedComparisons = (): void => {
    navigate(routes.Matches.path('inComparison'));
  };

  const handleOnSaveOrUpdateComparison = (): void => {
    if (isOnNewMatchTab) userId && saveComparison(userId, displayedUsersIds).then(() => navigateToNewMatch());
    else comparisonId && updateComparison(comparisonId, displayedUsersIds).then(() => navigateToSavedComparisons());
  };

  const handleOnExitComparingMode = (): void => {
    if (isOnNewMatchTab) navigateToNewMatch();
    else navigateToSavedComparisons();
  };

  const handleDeleteComparison = (): void => {
    comparisonId && deleteComparison(comparisonId).then(() => navigateToSavedComparisons());
  };

  const saveOrUpdateButtonLabel = isOnNewMatchTab ? 'Save for later' : 'Update comparison';

  const isUpdateButtonDisabled = !isOnNewMatchTab && excludedUserIds.length === 0;

  return (
    <div className={styles.root}>
      <PageHeader title="Comparing" titleSize="large" className={styles.header}>
        <div className={styles.actions}>
          {!isOnNewMatchTab && (
            <Button
              className={styles.actionButton}
              text="Delete comparison"
              variant="primary"
              onClick={handleDeleteComparison}
              loading={deletingComparison}
            />
          )}
          <Button
            className={styles.actionButton}
            text={saveOrUpdateButtonLabel}
            variant="secondary"
            onClick={handleOnSaveOrUpdateComparison}
            disabled={isUpdateButtonDisabled}
            loading={submittingComparison}
          />
          <Button text="Exit comparing mode" variant="secondary" onClick={handleOnExitComparingMode} />
        </div>
      </PageHeader>

      <LoadingArea className={styles.comparingBoard} loading={loadingUsers}>
        <div className={styles.comparedCardsHeader} ref={headerRef}>
          <ComparisonCardHeader
            user={targetUser}
            className={clsx(styles.mainCardHeader, { [styles.withFixedPosition]: isFixed })}
          />
          <div
            className={clsx(styles.comparedHeaderContainer, { [styles.withComparedFixedPosition]: isFixed })}
            ref={comparedHeaderContainerRef}
          >
            {displayedComparedUsers.map((user, index) => (
              <ComparisonCardHeader
                user={user}
                className={clsx(styles.comparedCard, {
                  [styles.comparedHeaderCardWithBorder]: index !== 0,
                  [styles.isLast]: index === displayedComparedUsers.length - 1,
                })}
                key={user.id}
                isComparedCard
                onMatchUser={onMatchUser}
                onRemoveUser={onUserRemove}
              />
            ))}
          </div>
        </div>

        <div ref={comparingBoardRef}>
          <ComparisonCard user={targetUser} className={styles.mainCard} rowHeights={rowHeights} />
          <div className={styles.comparedWrapper}>
            <div className={styles.comparedContainer} ref={comparedContainerRef}>
              {displayedComparedUsers.map((user, index) => (
                <ComparisonCard
                  key={user.id}
                  user={user}
                  className={clsx(styles.comparedCard, {
                    [styles.withBorder]: index !== 0,
                    [styles.isLast]: index === displayedComparedUsers.length - 1,
                  })}
                  isComparedCard
                  rowHeights={rowHeights}
                />
              ))}
            </div>

            <FakeScroll
              className={styles.comparedContainerScrollbar}
              scrollbarRef={containerScrollbarRef}
              isFakeScrollVisible={isFakeScrollVisible}
              fakeScrollWidth={fakeScrollWidth}
            />
          </div>
        </div>
      </LoadingArea>
    </div>
  );
};

export default observer(Comparing);
