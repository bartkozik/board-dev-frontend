import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { SortColumn } from '@/domain/sorting';
import Button from '@/theme/button';
import Chip from '@/theme/chip';
import Icon, { icons, iconSize } from '@/theme/icon/Icon';
import IconButton from '@/theme/iconButton';
import Table from '@/theme/table';
import TooltipMenu from '@/theme/tooltipMenu';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import { DEFAULT_USER_TAB } from '@/users/constants';
import { User } from '@/users/types';
import { getUserName } from '@/users/utils';
import { useOnClickOutside } from '@/utils/hooks';
import { PublicChip } from '../../components';
import styles from './UsersTableRow.module.scss';

interface UsersTableRowProps {
  user: User;
  onUserRemove: () => void;
  onToggleBlockUser: () => void;
}

const UsersTableRow = ({ user, onUserRemove, onToggleBlockUser }: UsersTableRowProps): JSX.Element => {
  const {
    userStore: { setSelectedUserById },
  } = useStores();

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const tooltipContainerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    ref: tooltipContainerRef,
    handler: () => setIsTooltipVisible(false),
    condition: isTooltipVisible,
  });

  const handleDetailsClick = (userId: string): void => {
    navigate(routes.User.path(userId, DEFAULT_USER_TAB));
  };

  const handleEditUser = (userId: string): void => {
    setIsTooltipVisible(false);
    navigate(routes.UserEdit.path(userId));
  };

  const handleUserAction = (action: () => void): void => {
    setSelectedUserById(user.id);
    setIsTooltipVisible(false);
    action();
  };

  const toggleTooltipMenu = (): void => {
    setIsTooltipVisible((prevState) => !prevState);
  };

  const blockUserButtonText = `${user.isBlocked ? 'Unblock' : 'Block'} user`;

  const isLastUpdateVisible = user.lastFormUpdateAt && user.formCompleted;
  const userName = getUserName(user);

  return (
    <Table.Row key={user.id} onClick={() => handleDetailsClick(user.id)}>
      <Table.Cell label={SortColumn.User}>
        <div className={styles.userDetails}>
          <UserInitialsAvatar stringToInitialize={user.name} />
          {user.isBlocked && <Icon icon={icons.block} size={iconSize.small} />}
          <span className={styles.username} title={user.name}>
            {userName}
          </span>
          {user.email}
          <div className={styles.createdAtMobile}>
            <span>Created:</span> {user.formattedCreatedAt}
            {isLastUpdateVisible && (
              <div className={styles.formUpdateAtMobile}>
                <span>Application updated:</span> <Chip label={user.formattedLastFormUpdateAt} type="outlined" />
              </div>
            )}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell label={SortColumn.Company}>
        {user.corporateClientName ? (
          <Chip label={user.corporateClientName} variant="data" />
        ) : (
          <PublicChip role={user.roles[0]} />
        )}
      </Table.Cell>
      <Table.Cell label={SortColumn.Type}>
        <Chip label={user.type} />
      </Table.Cell>
      <Table.Cell label={SortColumn.FormUpdate}>
        {isLastUpdateVisible && <Chip label={user.formattedLastFormUpdateAt} variant="important" />}
      </Table.Cell>
      <Table.Cell label={SortColumn.DateAdded}>{user.formattedCreatedAt}</Table.Cell>
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
                text="Edit"
                variant="outlined"
                icon={<Icon icon={icons.pencil} size={iconSize.medium} />}
                maxWidth
                onClick={() => handleEditUser(user.id)}
              />
              <Button
                className={styles.tooltipButton}
                text={blockUserButtonText}
                variant="outlined"
                icon={<Icon icon={user.isBlocked ? icons.refresh : icons.block} size={iconSize.medium} />}
                maxWidth
                onClick={() => handleUserAction(onToggleBlockUser)}
              />
              <Button
                className={styles.tooltipButton}
                text="Remove user"
                variant="outlined"
                icon={<Icon icon={icons.remove} size={iconSize.medium} />}
                maxWidth
                onClick={() => handleUserAction(onUserRemove)}
              />
            </TooltipMenu>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default observer(UsersTableRow);
