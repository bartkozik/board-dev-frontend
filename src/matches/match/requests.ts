import { AxiosResponse } from 'axios';
import api from '@/api';
import { GenerateMatchSummaryReturn, GetMatchesReturn, MatchFormType, PutMatchesReturn } from '../types';

export const fetchMatch = (params: { npoUserId?: string; techLeaderUserId?: string }): GetMatchesReturn => {
  return api.get('/matches', { params });
};

export const saveMatch = (match: Partial<MatchFormType>): PutMatchesReturn => {
  return api.put('/matches', match);
};

export const sendToCRM = (match: Partial<MatchFormType>): PutMatchesReturn => {
  return api.put('/matches/with-crm', match);
};

export const deleteMatch = (match: { npoUserId: string; techLeaderUserId: string }): Promise<void> => {
  return api.delete(`/matches`, { data: match });
};

export const generateMatchSummary = (params: {
  customizationPrompt: string;
  npoUserId: string;
  techLeaderUserId: string;
}): GenerateMatchSummaryReturn => {
  return api.post('/matches/ai/summarize', params);
};

export const getAllUniqueAnswers = (formKey: string, userRole: string): Promise<AxiosResponse<string[]>> => {
  return api.get(`/forms/values/get?key=${formKey}&role=${userRole}`);
};
