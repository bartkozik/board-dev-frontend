import { useEffect, useState } from 'react';
import * as requests from '@/matches/matches/requests';
import { RawMatch } from '@/matches/types';
import { User } from '@/users/types';
import { getKeyBaseOnUserRole } from '@/utils/helpers/getKeyBaseOnUserRole';

export interface UseUserMatchReturn {
  userMatchExists: boolean;
  userMatchCompleted: boolean;
  loading: boolean;
  match: RawMatch | null;
}

export const useUserMatch = (user: User | null): UseUserMatchReturn => {
  const [hasMatch, setHasMatch] = useState(false);
  const [hasMatchCompleted, setHasMatchCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<RawMatch | null>(null);

  useEffect(() => {
    if (!user) return;

    const role = user.roles[0];
    const key = getKeyBaseOnUserRole(role);

    const fetchUserMatches = async (): Promise<void> => {
      setLoading(true);
      try {
        const allMatchesResponse = await requests.fetchMatches({
          [key]: user.id,
        });

        const allMatches = allMatchesResponse.data;
        setHasMatch(allMatches.count > 0);
        if (allMatches.count > 0) setMatch(allMatches.results[0]);

        const completedMatchesResponse = await requests.fetchMatches({
          [key]: user.id,
          crmSent: true,
        });

        const completedMatches = completedMatchesResponse.data.count;
        setHasMatchCompleted(completedMatches > 0);
      } catch (error) {
        setHasMatch(false);
        setHasMatchCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMatches();
  }, [user]);

  return { userMatchExists: hasMatch, userMatchCompleted: hasMatchCompleted, loading, match };
};
