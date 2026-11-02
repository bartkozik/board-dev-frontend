import api from '@/api';
import { ComparisonReturn } from '../types';

export const createComparison = (userId: string, comparedUsersIds: string[]): ComparisonReturn => {
  return api.post('/comparisons', {
    userId,
    comparedUsersIds,
  });
};

export const updateComparison = (comparisonId: string, comparedUsersIds: string[]): ComparisonReturn => {
  return api.patch(`/comparisons/${comparisonId}`, { comparedUsersIds });
};

export const deleteComparison = (comparisonId: string): ComparisonReturn => {
  return api.delete(`/comparisons/${comparisonId}`);
};
