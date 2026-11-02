import api from '@/api';
import { FetchMatchingListParams, GetMatchesReturn } from '../types';

export const fetchMatches = (params: FetchMatchingListParams): GetMatchesReturn => {
  return api.get('/matches', { params });
};
