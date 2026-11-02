import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { MATCH_FORM_KEYS } from '@/matches/constants';
import { MatchFormType, MatchUserKey } from '@/matches/types';
import { matchFormSchema } from '@/matches/zodSchemas';
import { User } from '@/users/types';
import { FiltersActions, UrlFiltersActions, useFormValidation } from '@/utils/hooks';
import { UserSelector } from '../components';
import SelectedUsers from '../components/selectedUsers';
import { getAvailableRoles, getKeyForName } from '../utils';
import styles from './MatchForm.module.scss';
import { Instruction, SummarySection, UsersList } from './components';
import { useInputNames } from './useInputNames';

interface MatchFormProps {
  urlFilters: UrlFiltersActions;
  localStorageFilters: FiltersActions;
}

const MatchForm = ({ urlFilters, localStorageFilters }: MatchFormProps): JSX.Element => {
  const { matchStore } = useStores();
  const navigate = useNavigate();
  const {
    match,
    matchedUsers,
    areUsersSelected,
    isOneUserSelected,
    submitting,
    setMatchedUsers,
    removeMatch,
    updateMatch,
    sendToCRM,
  } = matchStore;
  const { formMethods } = useFormValidation(
    matchFormSchema,
    MATCH_FORM_KEYS.reduce((acc, key) => ({ ...acc, [key]: match[key] }), {} as MatchFormType)
  );

  const { setValue, handleSubmit, register, getValues } = formMethods;
  const [searchParams, setSearchParams] = useSearchParams();
  const { inputNames, updateInputNames, clearNextInput } = useInputNames(match);

  const availableRoles = getAvailableRoles(match);
  const loading = (!match.shortSummary || !match.longSummary) && submitting;

  const shouldDisplayUserSelector = !isOneUserSelected && !areUsersSelected;

  const registerFormValues = (): void =>
    MATCH_FORM_KEYS.forEach((key) => {
      register(key);
      setValue(key, match[key]);
    });

  const handleRemoveUser = (name: MatchUserKey, index: number): void => {
    const { npoUserId, techLeaderUserId } = match;

    if (npoUserId && techLeaderUserId) {
      handleRemoveMatch(npoUserId, techLeaderUserId);
    }

    clearUserFromMatch(name);
    removeUserFromMatchedList(name);
    searchParams.delete(name);
    setSearchParams(searchParams);

    if (index === 0) {
      handleClearNextInput(index);
    }

    resetSummaries();
  };

  const handleSelectUser = (key: MatchUserKey, user: User): void => {
    setValue(key, user.id);
    updateMatch({
      [getKeyForName(key)]: user.name,
      [key]: user.id,
    });
    setMatchedUsers([...matchedUsers, user]);
  };

  const clearUserFromMatch = (name: MatchUserKey): void => {
    const keyForName = getKeyForName(name);
    setValue(name, '');
    updateMatch({ [name]: '', [keyForName]: '' });
  };

  const removeUserFromMatchedList = (name: MatchUserKey): void => {
    const filteredUsers = matchedUsers.filter((user) => user.id !== match[name]);
    setMatchedUsers(filteredUsers);
  };

  const resetSummaries = (): void => {
    setValue('shortSummary', '');
    setValue('longSummary', '');
    updateMatch({ shortSummary: '', longSummary: '' });
  };

  const handleRemoveMatch = (npoUserId: string, techLeaderUserId: string): void => {
    removeMatch(npoUserId, techLeaderUserId);
  };

  const handleClearNextInput = (index: number): void => {
    clearNextInput(index, updateMatch);
    setMatchedUsers([]);
    searchParams.delete(inputNames[index + 1]);
    setSearchParams(searchParams);
  };

  const saveAndSendToCRM = handleSubmit((): void => {
    sendToCRM().then(() => {
      navigate(routes.Matches.path('sentToCrm'));
    });
  });

  useEffect(() => {
    registerFormValues();
  }, []);

  useEffect(() => {
    updateInputNames(match);
  }, [match?.npoUserId, match?.techLeaderUserId]);

  return (
    <form className={styles.root} onSubmit={saveAndSendToCRM}>
      <div className={styles.header}>
        <div className={styles.selectors}>
          {shouldDisplayUserSelector && (
            <UserSelector
              formMethods={formMethods}
              onSelect={handleSelectUser}
              name={inputNames[0]}
              availableRoles={availableRoles}
            />
          )}
          <SelectedUsers inputNames={inputNames} handleRemoveUser={handleRemoveUser} />
        </div>
        {!areUsersSelected && <Instruction areUsersSelected={areUsersSelected} />}
      </div>
      {isOneUserSelected && (
        <UsersList
          role={availableRoles[0]}
          onSelectUser={handleSelectUser}
          urlFilters={urlFilters}
          localStorageFilters={localStorageFilters}
        />
      )}
      <SummarySection areUsersSelected={areUsersSelected} formMethods={formMethods} loading={loading} />
    </form>
  );
};

export default observer(MatchForm);
