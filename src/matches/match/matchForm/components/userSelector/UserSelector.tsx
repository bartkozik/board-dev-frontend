import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { MatchFormType, MatchUserKey } from '@/matches/types';
import Input from '@/theme/input';
import Loader from '@/theme/loader';
import { User, UserRole } from '@/users/types';
import { getKeyBaseOnUserRole } from '@/utils/helpers/getKeyBaseOnUserRole';
import { useUsersReadyToMatch } from '@/utils/hooks';
import styles from './UserSelector.module.scss';

interface UserSelectorProps {
  name: MatchUserKey;
  formMethods: UseFormReturn<MatchFormType>;
  onSelect: (key: MatchUserKey, user: User) => void;
  disabled?: boolean;
  availableRoles: (keyof typeof UserRole)[];
}

const UserSelector = ({ formMethods, onSelect, name, disabled, availableRoles }: UserSelectorProps): JSX.Element => {
  const { register, watch, setValue } = formMethods;
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedValue = watch(name);
  const role = availableRoles.length === 1 ? availableRoles[0] : undefined;
  const { usersReadyToMatch, loadingUsers, resetSearchedList } = useUsersReadyToMatch({
    phrase: searchedValue,
    role,
    pageSize: 100, 
  });

  useEffect(() => {
    setValue(name, '');
    resetSearchedList();
  }, []);

  const handleSelect = (user: User): void => {
    const keyName = getKeyBaseOnUserRole(user.roles[0]);
    onSelect(keyName, user);
    setValue(keyName, user.id);
    resetSearchedList();

    const newParams = new URLSearchParams(searchParams);
    newParams.set(keyName, user.id);
    setSearchParams(newParams);
  };

  const noUsersReadyToMatchElement = !loadingUsers && usersReadyToMatch.length === 0 && <li>No user found</li>;

  const loadingUsersElement = loadingUsers && (
    <li className={styles.loader}>
      <Loader loading={loadingUsers} small />
    </li>
  );

  return (
    <div className={styles.root}>
      <Input
        placeholder="Search for user"
        type="text"
        {...register(name)}
        className={styles.input}
        disabled={disabled}
      />
      {searchedValue && (
        <ul className={styles.list}>
          {noUsersReadyToMatchElement}
          {loadingUsersElement}
          {usersReadyToMatch.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSelect(user)}
              tabIndex={0}
            >
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSelector;
