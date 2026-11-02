import api from '@/api';
import { UserReturn } from '@/users/types';
import { UserFormFieldReturn, UserFormReturn, FormData, GoogleDocumentType } from './types';

export const fetchUserForm = (userId: string): UserFormReturn => {
  return api.get(`/users/${userId}/forms`);
};

export const updateUserFormField = (userId: string, formData: FormData): UserFormFieldReturn => {
  return api.put(`/users/${userId}/forms`, formData);
};

export const deleteFormField = (userId: string, key: string): Promise<void> => {
  return api.delete(`/users/${userId}/forms/${key}`);
};

export const markUserFormCompletionStatus = (
  userId: string,
  data: { formCompleted: boolean; googleDocuments: GoogleDocumentType[] }
): UserReturn => {
  return api.patch(`/users/${userId}`, data);
};
