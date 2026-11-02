import { useEffect } from 'react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { CorporateClient } from '@/corporateClients/types';
import { DEFAULT_FORM_MESSAGES } from '@/domain/constants';
import { INSTRUCTIONS } from '@/domain/instructions';
import { NPO_ESTIMATED_TIME_IN_MINUTES, TECH_LEADER_ESTIMATED_TIME_IN_MINUTES } from '@/forms/constants';
import LoadingArea from '@/theme/loadingArea';
import { User } from '@/users/types';
import { useUserRoles } from '@/utils/hooks';
import styles from './MessageWithInstructions.module.scss';

const getMessage = (message: string | undefined, defaultMessage: string): string => {
  return message?.trim().length ? message : defaultMessage;
};

const getUserMessage = ({
  isNPO,
  isFormCompleted,
  connectedCompany,
}: {
  isNPO: boolean;
  isFormCompleted?: boolean;
  connectedCompany?: CorporateClient;
}): string => {
  const npoWelcomeMessage = getMessage(connectedCompany?.npoWelcomeMessage, DEFAULT_FORM_MESSAGES.WELCOME.NPO);
  const techLeaderWelcomeMessage = getMessage(
    connectedCompany?.techLeaderWelcomeMessage,
    DEFAULT_FORM_MESSAGES.WELCOME.TECH_LEADER
  );
  const npoThankYouMessage = getMessage(connectedCompany?.npoThankYouMessage, DEFAULT_FORM_MESSAGES.THANK_YOU.NPO);
  const techLeaderThankYouMessage = getMessage(
    connectedCompany?.techLeaderThankYouMessage,
    DEFAULT_FORM_MESSAGES.THANK_YOU.TECH_LEADER
  );

  const messages = {
    welcome: isNPO ? npoWelcomeMessage : techLeaderWelcomeMessage,
    thankYou: isNPO ? npoThankYouMessage : techLeaderThankYouMessage,
  };

  return isFormCompleted ? messages.thankYou : messages.welcome;
};

interface MessageWithInstructionsProps {
  user: User | null;
  isUserMatched?: boolean;
}

const MessageWithInstructions = ({ user, isUserMatched }: MessageWithInstructionsProps): JSX.Element => {
  const { corporateClientStore } = useStores();
  const { corporateClient, fetchCorporateClient, loading } = corporateClientStore;
  const { isNPO } = useUserRoles();

  const { corporateClientId = null, formCompleted = false, name = '' } = user || {};

  useEffect(() => {
    if (corporateClientId) fetchCorporateClient(corporateClientId);
  }, []);

  const userMessage = getUserMessage({ isNPO, isFormCompleted: formCompleted, connectedCompany: corporateClient });

  const estimatedTimeInMinutes = isNPO ? NPO_ESTIMATED_TIME_IN_MINUTES : TECH_LEADER_ESTIMATED_TIME_IN_MINUTES;

  const renderInstructionMessage = (): JSX.Element[] => {
    const messages: JSX.Element[] = [];

    if (!isUserMatched)
      messages.push(
        <p key="userMessage" className={styles.userMessage}>
          {userMessage}
        </p>
      );

    if (!formCompleted)
      messages.push(
        <React.Fragment key="application">{INSTRUCTIONS.dashboard.application(estimatedTimeInMinutes)}</React.Fragment>
      );

    if (isUserMatched)
      messages.push(
        <div key="matchedInfo" className={styles.matchedInfo}>
          {INSTRUCTIONS.dashboard.matchCompleted(name)}
        </div>
      );

    return messages;
  };

  return (
    <LoadingArea loading={loading} className={styles.root}>
      {renderInstructionMessage()}
    </LoadingArea>
  );
};

export default observer(MessageWithInstructions);
