import { Tooltip } from '@mantine/core';
import { useEffect } from 'react';
import { useParams, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { INSTRUCTIONS } from '@/domain/instructions';
import { SortByParams } from '@/domain/sorting';
import { Tab } from '@/domain/types';
import Breadcrumbs from '@/theme/breadcrumbs';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import LoadingArea from '@/theme/loadingArea/';
import PageHeader from '@/theme/pageHeader';
import Tabs from '@/theme/tabs';
import { useConfirmRemoveModal } from '@/utils/hooks';
import styles from './CorporateClientBoard.module.scss';
import CorporateClientCustomMessaging from './corporateClientCustomMessaging';
import CorporateClientDetails from './corporateClientDetails';
import CorporateClientUsersTable from './corporateClientUsersTable';
import CorporateTrainingMaterials from './corporateTrainingMaterials/';
import CustomFormQuestionsManagement from './customFormQuestionsManagement';

const TABS = [
  {
    value: 'companyUsersTable',
    label: 'Users',
    element: <CorporateClientUsersTable />,
  },
  {
    value: 'companyDetails',
    label: 'Company details',
    element: <CorporateClientDetails />,
  },
  {
    value: 'customFormQuestions',
    label: 'Custom form questions',
    element: <CustomFormQuestionsManagement />,
  },
  {
    value: 'customMessaging',
    label: 'Custom messaging',
    element: <CorporateClientCustomMessaging />,
  },
  {
    value: 'corporateTrainingMaterials',
    label: 'Client training materials',
    element: <CorporateTrainingMaterials />,
  },
];

const BREADCRUMBS = [{ label: 'Companies', route: 'CorporateClients', param: 'list' }];

const CorporateClientBoard = (): JSX.Element | null => {
  const navigate = useNavigate();
  const { userId: corporateClientId } = useParams();
  const { corporateClientStore, toastsStore, usersStore } = useStores();
  const { setActivePage, setSortFromURL } = usersStore;
  const { fetchCorporateClient, deleteCorporateClient, corporateClient, loading, submitting } = corporateClientStore;
  const { addToast } = toastsStore;
  const [searchParams] = useSearchParams();
  const activePageFromUrl = searchParams.get('pageNumber');
  const sortByFromUrl = searchParams.get('sortBy');

  const { openModal, closeModal, confirmRemoveModal } = useConfirmRemoveModal({
    onConfirm: () =>
      corporateClient &&
      deleteCorporateClient(corporateClient.id).then(() => {
        navigate(routes.CorporateClients.path());
        closeModal();
      }),
    name: corporateClient?.name || 'this company',
    submitting,
  });
  const handleEditCorporateClient = (): void => {
    if (corporateClient) navigate(routes.CorporateClientEdit.path(corporateClient.id));
  };

  const handleAddCorporateClientUser = (): void => {
    if (corporateClient) navigate(routes.CorporateClientAddUser.path(corporateClient.id, corporateClient.name));
  };

  const onTabClick = (tab: Tab): void => {
    if (!corporateClient) return;
    const search =
      tab.value === TABS[0].value
        ? createSearchParams({ sortBy: SortByParams.userNameAsc, pageNumber: '1' }).toString()
        : '';
    navigate({
      pathname: routes.CorporateClient.path(corporateClient.id, tab.value),
      search,
    });
  };

  const copyLinkToClipboard = (): void => {
    if (corporateClient) {
      const path = `${window.location.origin}${routes.Signup.path()}?${createSearchParams({
        invitation: corporateClient.id,
      })}`;
      navigator.clipboard
        .writeText(path)
        .then(() => addToast('The invitation link has been copied to the clipboard', 'success'))
        .catch(() => addToast('Failed to copy link. Please try again later.', 'error'));
    }
  };

  useEffect(() => {
    if (activePageFromUrl) setActivePage(parseInt(activePageFromUrl, 10));
    if (sortByFromUrl) setSortFromURL(sortByFromUrl);
  }, []);

  useEffect(() => {
    if (corporateClientId) {
      fetchCorporateClient(corporateClientId);
    }
  }, []);

  return (
    <>
      <div className={styles.root}>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} className={styles.breadcrumbs} />
        <LoadingArea loading={loading} className={styles.loadingArea}>
          <PageHeader title={corporateClient?.name || ''} className={styles.header} titleSize="large" isLongTitleBraked>
            <div className={styles.actions}>
              <Button
                text="Add user"
                className={styles.addUserButton}
                onClick={handleAddCorporateClientUser}
                disabled={!corporateClient}
                icon={<Icon icon={icons.addUser} size={iconSize.medium} />}
              />
              <Tooltip label={INSTRUCTIONS.corporateClient.invitationLink} withArrow>
                <Button text="Copy invitation link" onClick={copyLinkToClipboard} />
              </Tooltip>
            </div>

            <div className={styles.actions}>
              <Button
                text="Edit company"
                onClick={handleEditCorporateClient}
                variant="secondary"
                disabled={!corporateClient}
                icon={<Icon icon={icons.pencil} size={iconSize.medium} />}
              />
              <Button
                text="Remove company"
                onClick={openModal}
                disabled={!corporateClient}
                variant="secondary"
                icon={<Icon icon={icons.remove} size={iconSize.medium} />}
              />
            </div>
          </PageHeader>
          <Tabs onTabClick={onTabClick} tabs={TABS} />
        </LoadingArea>
      </div>
      {confirmRemoveModal}
    </>
  );
};

export default observer(CorporateClientBoard);
