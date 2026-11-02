import api from '@/api';
import { FetchUserListParams } from '@/domain/types';
import { UserDeleteReturn, UserFormData, UserEditFormData, UserReturn, UsersReturn, UserSummaryReturn } from './types';

export const fetchUsers = (params: FetchUserListParams): UsersReturn => {
  return api.get('/users', { params });
};

export const createUser = (user: UserFormData): UserReturn => {
  return api.post('/users', user);
};

export const updateUser = (user: Partial<UserEditFormData>): UserReturn => {
  const { userId, ...data } = user;

  return api.patch(`/users/${userId}`, { googleDocuments: [], ...data });
};

export const deleteUser = (userId: string): UserDeleteReturn => {
  return api.delete(`/users/${userId}`);
};

export const generateUserSummary = (userId: string, prompt: { customizationPrompt: string }): UserSummaryReturn => {
  return api.post(`/users/${userId}/form/ai/summarize`, prompt);
};
