import React from 'react';
import { useStores } from '@/RootStore';
import { RawMatch } from '@/matches/types';
import DetailsLayout from '@/theme/detailsLayout';
import LoadingArea from '@/theme/loadingArea';
import SummaryPreview from '@/theme/summaryPreview';
import SummaryWrapper from '@/theme/summaryWrapper';
import MatchIcon from '../components/matchIcon';
import UserToMatch from '../components/userToMatch';
import styles from './MatchDetails.module.scss';

const MatchDetails = (): JSX.Element => {
  const { matchStore } = useStores();
  const { match, matchedUsers, loading } = matchStore;
  const { shortSummary, longSummary } = match as RawMatch;

  return (
    <LoadingArea loading={loading}>
      <div className={styles.users}>
        {matchedUsers.map((user, index) => (
          <React.Fragment key={'matched user: ' + user.id + index}>
            <UserToMatch user={user} />
            {index === 0 && <MatchIcon />}
          </React.Fragment>
        ))}
      </div>
      <DetailsLayout className={styles.detailsLayout}>
        <SummaryWrapper>
          <SummaryPreview long={longSummary} short={shortSummary} />
        </SummaryWrapper>
      </DetailsLayout>
    </LoadingArea>
  );
};

export default MatchDetails;
