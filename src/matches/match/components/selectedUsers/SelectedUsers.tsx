import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { MatchUserKey } from '@/matches/types';
import MatchIcon from '../matchIcon';
import UserToMatch from '../userToMatch';

interface SelectedUsersProps {
  inputNames: MatchUserKey[];
  handleRemoveUser: (name: MatchUserKey, index: number) => void;
}

const SelectedUsers = ({ inputNames, handleRemoveUser }: SelectedUsersProps): JSX.Element => {
  const { matchStore } = useStores();
  const { match, matchedUsers, areUsersSelected } = matchStore;

  return (
    <>
      {inputNames?.map((name, index) => {
        const matchIconIsVisible = index === 0 && areUsersSelected;

        return (
          <React.Fragment key={name}>
            <UserToMatch
              user={matchedUsers.find((user) => user.id === match[name])}
              onRemove={() => handleRemoveUser(name, index)}
            />
            {matchIconIsVisible && <MatchIcon />}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default observer(SelectedUsers);
