import { useState, useEffect } from 'react';
import { USERS_TO_MATCH_KEYS, NPO_USER_ID, TECH_LEADER_USER_ID } from '@/matches/constants';
import { getKeyForName } from '@/matches/match/utils';
import { MatchFormType, MatchUserKey } from '@/matches/types';

interface UseInputNamesReturn {
  inputNames: MatchUserKey[];
  updateInputNames: (match: MatchFormType) => void;
  clearNextInput: (index: number, updateMatch: (data: Partial<MatchFormType>) => void) => void;
}

export const useInputNames = (match: MatchFormType): UseInputNamesReturn => {
  const [inputNames, setInputNames] = useState<MatchUserKey[]>(USERS_TO_MATCH_KEYS);

  const updateInputNames = (currentMatch: MatchFormType): void => {
    if (currentMatch?.[NPO_USER_ID] && !currentMatch?.[TECH_LEADER_USER_ID]) {
      setInputNames([NPO_USER_ID, TECH_LEADER_USER_ID]);
    } else if (currentMatch?.[TECH_LEADER_USER_ID] && !currentMatch?.[NPO_USER_ID]) {
      setInputNames([TECH_LEADER_USER_ID, NPO_USER_ID]);
    } else {
      setInputNames(USERS_TO_MATCH_KEYS);
    }
  };

  const clearNextInput = (index: number, updateMatch: (data: Partial<MatchFormType>) => void): void => {
    const nextInputName = inputNames?.[index + 1];
    if (!nextInputName) return;

    const nextKeyForName = getKeyForName(nextInputName);
    updateMatch({ [nextInputName]: '', [nextKeyForName]: '' });
  };

  useEffect(() => {
    updateInputNames(match);
  }, [match?.[NPO_USER_ID], match?.[TECH_LEADER_USER_ID]]);

  return {
    inputNames,
    updateInputNames,
    clearNextInput,
  };
};
