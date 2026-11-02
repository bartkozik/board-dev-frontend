import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { routes } from '@/app/routes';
import { SortColumn } from '@/domain/sorting';
import { Comparison } from '@/matches/types';
import Icon, { icons, iconSize } from '@/theme/icon';
import Table from '@/theme/table';
import UserNameWithAvatar from '@/theme/userNameWithAvatar';
import { RawUserRole } from '@/users/types';
import ComparedAvatarsGroup from '../comparedAvatarsGroup';
import styles from './SavedComparisonsTableRow.module.scss';

interface SavedComparisonsTableRowProps {
  comparison: Comparison;
}

const SavedComparisonsTableRow = ({ comparison }: SavedComparisonsTableRowProps): JSX.Element => {
  const navigate = useNavigate();

  const { id, userDetails, comparedUsersDetails, userId, comparedUsersIds, formattedCreatedAt } = comparison;

  const isComparedUserTechLeader = userDetails.roles[0] === RawUserRole.TechLeader;

  const handleClickTableRow = (): void => {
    const comparedUsersIdsCommaSeparated = comparedUsersIds.join(',');
    navigate(routes.SavedUsersComparison.path(id, userId, comparedUsersIdsCommaSeparated));
  };

  const userNameWithAvatar = <UserNameWithAvatar userName={userDetails.name} />;
  const comparedUsersDisplay = <ComparedAvatarsGroup comparedUsers={comparedUsersDetails} />;

  const [techLeaderContent, nonProfitContent] = isComparedUserTechLeader
    ? [userNameWithAvatar, comparedUsersDisplay]
    : [comparedUsersDisplay, userNameWithAvatar];

  return (
    <Table.Row onClick={handleClickTableRow}>
      <Table.Cell label={SortColumn.TechLeader}>
        <div className={styles.techLeaderContainer}>
          {techLeaderContent}
          <Icon icon={icons.matched} size={iconSize.medium} />
        </div>
      </Table.Cell>
      <Table.Cell label={SortColumn.NonProfit}>{nonProfitContent}</Table.Cell>
      <Table.Cell label="Date added">
        <div className={styles.dateContainer}>{formattedCreatedAt}</div>
      </Table.Cell>
    </Table.Row>
  );
};

export default observer(SavedComparisonsTableRow);
