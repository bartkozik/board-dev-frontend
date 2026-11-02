import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import Button from '@/theme/button';
import Chip from '@/theme/chip';
import Icon, { icons, iconSize } from '@/theme/icon/Icon';
import IconButton from '@/theme/iconButton';
import Table from '@/theme/table';
import TooltipMenu from '@/theme/tooltipMenu';
import UserInitialsAvatar from '@/theme/userInitialsAvatar';
import { DEFAULT_USER_TAB } from '@/users/constants';
import { User } from '@/users/types';
import { useOnClickOutside, useMatchStatus } from '@/utils/hooks';
import styles from './CorporateClientUsersTableRow.module.scss';

interface CorporateClientUsersTableRowProps {
  user: User;
  onUserRemove: () => void;
}

const CorporateClientUsersTableRow = ({ user, onUserRemove }: CorporateClientUsersTableRowProps): JSX.Element => {
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

  const matchStatus = useMatchStatus(user);

  const handleDetailsClick = (userId: string): void => {
    navigate(routes.User.path(userId, DEFAULT_USER_TAB));
  };

  const handleEditUser = (userId: string): void => {
    setIsTooltipVisible(false);
    navigate(routes.UserEdit.path(userId));
  };

  const removeUser = (): void => {
    setSelectedUserById(user.id);
    setIsTooltipVisible(false);
    onUserRemove();
  };
  const toggleTooltipMenu = (): void => {
    setIsTooltipVisible((prevState) => !prevState);
  };

  return (
    <Table.Row key={user.id} onClick={() => handleDetailsClick(user.id)}>
      <Table.Cell label="User">
        <div className={styles.userDetails}>
          <UserInitialsAvatar item={user} />
          <span className={styles.username}>{user.name}</span>
          {user.email}
          <div className={styles.createdAtMobile}>
            <span>Created:</span> {user.formattedCreatedAt}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell label="Status">
        <Chip label={matchStatus} />
      </Table.Cell>
      <Table.Cell label="Type">
        <Chip label={user.type || '---'} />
      </Table.Cell>
      <Table.Cell label="Date added">{user.formattedCreatedAt}</Table.Cell>
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
                text="Remove user"
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

export default observer(CorporateClientUsersTableRow);
