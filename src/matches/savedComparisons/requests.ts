import api from '@/api';
import { ComparisonsReturn, FetchComparisonsListParams } from '../types';

export const fetchComparisons = (params: FetchComparisonsListParams): ComparisonsReturn => {
  return api.get('/comparisons', { params });
};
