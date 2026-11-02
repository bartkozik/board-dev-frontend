import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { routes } from '@/app/routes';
import { SortColumn } from '@/domain/sorting';
import { RawMatch } from '@/matches/types';
import Icon, { icons, iconSize } from '@/theme/icon';
import Table from '@/theme/table';
import UserNameWithAvatar from '@/theme/userNameWithAvatar';
import { DATE_FORMAT, formatDate } from '@/utils/helpers';
import styles from './MatchesTableRow.module.scss';

interface MatchesTableRowProps {
  match: RawMatch;
  onClick?: () => void;
}

const MatchesTableRow = ({ match, onClick }: MatchesTableRowProps): JSX.Element => {
  const navigate = useNavigate();
  const params = useParams();
  const handleClickRowTable = (): void => {
    navigate({
      pathname: params.tab === 'sentToCrm' ? routes.Match.path() : routes.NewMatch.path(),
      search: createSearchParams({
        techLeaderUserId: match.techLeaderUserId,
        npoUserId: match.npoUserId,
      }).toString(),
    });
    onClick && onClick();
  };

  return (
    <Table.Row onClick={handleClickRowTable}>
      <Table.Cell label={SortColumn.TechLeader}>
        <div className={styles.techLeaderContainer}>
          <UserNameWithAvatar userName={match.techLeaderUserName} className={styles.userDetails} />
          <Icon icon={icons.matched} size={iconSize.medium} />
        </div>
      </Table.Cell>
      <Table.Cell label={SortColumn.NonProfit}>
        <UserNameWithAvatar userName={match.npoUserName} />
      </Table.Cell>
      <Table.Cell label="Date added">
        <div className={styles.dateContainer}>{formatDate(match.createdAt, DATE_FORMAT.FULL)}</div>
      </Table.Cell>
    </Table.Row>
  );
};

export default observer(MatchesTableRow);
