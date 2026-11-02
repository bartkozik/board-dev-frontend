import api from '@/api';
import { FetchCorporateClientListParams } from '@/domain/types';
import {
  CorporateClientCustomQuestionReturn,
  CorporateClientCustomQuestionsReturn,
  CorporateClientReturn,
  CorporateClientsReturn,
  CustomQuestionFormData,
  RawCorporateClient,
} from './types';

export const fetchCorporateClients = (params: FetchCorporateClientListParams): CorporateClientsReturn => {
  return api.get('/corporate-clients', { params });
};

export const fetchCorporateClient = (id: string): CorporateClientsReturn => {
  return api.get(`/corporate-clients`, { params: { id } });
};

export const createCorporateClient = (corporateClient: Partial<RawCorporateClient>): CorporateClientReturn => {
  return api.post('/corporate-clients', corporateClient);
};

export const updateCorporateClient = (
  id: string,
  corporateClient: Partial<RawCorporateClient>
): CorporateClientReturn => {
  return api.patch(`/corporate-clients/${id}`, corporateClient);
};

export const deleteCorporateClient = (id: string): Promise<void> => {
  return api.delete(`/corporate-clients/${id}`);
};

export const fetchCorporateClientCustomQuestions = (id: string): CorporateClientCustomQuestionsReturn => {
  return api.get(`/corporate-clients/${id}/custom-questions`);
};

export const updateCorporateClientCustomQuestion = (
  id: string,
  data: CustomQuestionFormData
): CorporateClientCustomQuestionReturn => {
  return api.put(`/corporate-clients/${id}/custom-questions`, data);
};
