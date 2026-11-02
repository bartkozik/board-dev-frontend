import { useRef, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { CorporateClient } from '@/corporateClients/types';
import { SortByParams } from '@/domain/sorting';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import IconButton from '@/theme/iconButton';
import Table from '@/theme/table';
import TooltipMenu from '@/theme/tooltipMenu';
import { useOnClickOutside } from '@/utils/hooks';
import styles from './CorporateClientsTableRow.module.scss';

interface CorporateClientsTableRowProps {
  corporateClient: CorporateClient;
  onUserRemove: () => void;
}

const CorporateClientsTableRow = ({ corporateClient, onUserRemove }: CorporateClientsTableRowProps): JSX.Element => {
  const {
    corporateClientStore: { setSelectedCorporateClientById },
  } = useStores();

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const navigate = useNavigate();
  const tooltipContainerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    ref: tooltipContainerRef,
    handler: () => setIsTooltipVisible(false),
    condition: isTooltipVisible,
  });

  const handleClickRow = (): void => {
    const pathname = routes.CorporateClient.path(corporateClient.id, 'companyUsersTable');
    const search = createSearchParams({ pageNumber: '1', sortBy: SortByParams.userNameAsc }).toString();
    navigate({ pathname, search });
  };

  const handleEditUser = (companyId: string): void => {
    setIsTooltipVisible(false);
    navigate(routes.CorporateClientEdit.path(companyId));
  };

  const removeUser = (): void => {
    setSelectedCorporateClientById(corporateClient.id);
    setIsTooltipVisible(false);
    onUserRemove();
  };

  const toggleTooltipMenu = (): void => {
    setIsTooltipVisible((prevState) => !prevState);
  };

  return (
    <Table.Row onClick={handleClickRow}>
      <Table.Cell label="Company name">{corporateClient.name}</Table.Cell>
      <Table.Cell label="Members">{corporateClient.memberCount || 0}</Table.Cell>
      <Table.Cell label="Date added">{corporateClient.formatedCreatedAt}</Table.Cell>
      <Table.Cell label="Action">
        <div className={styles.tooltipContainer} ref={tooltipContainerRef} onClick={(event) => event.stopPropagation()}>
          <IconButton
            icon={icons.dots}
            ariaLabel="Manage details"
            title="Manage details"
            onClick={toggleTooltipMenu}
            size={iconSize.medium}
          />
          {isTooltipVisible && (
            <TooltipMenu className={styles.tooltipMenu}>
              <Button
                className={styles.tooltipButton}
                text="Edit company"
                variant="outlined"
                icon={<Icon icon={icons.pencil} size={iconSize.medium} />}
                maxWidth
                onClick={() => handleEditUser(corporateClient.id)}
              />
              <Button
                className={styles.tooltipButton}
                text="Remove company"
                variant="outlined"
                icon={<Icon icon={icons.remove} size={iconSize.medium} />}
                maxWidth
                onClick={removeUser}
              />
            </TooltipMenu>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default CorporateClientsTableRow;
