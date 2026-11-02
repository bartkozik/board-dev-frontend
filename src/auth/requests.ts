import axios, { AxiosResponse } from 'axios';
import api, { getDeviceId } from '@/api';
import env from '@/domain/env';
import { UserFormData } from '@/users/types';
import { LoginReturn } from './types';

export const createUser = (user: UserFormData): Promise<void> => {
  return api.post('/users', user);
};

export const sendEmailWithMagicLink = (email: string, additionalUrlParams?: string): Promise<void> => {
  return api.post('/auth/get-token', { email, additionalUrlParams });
};

export function logInWithToken(email: string, token: string): LoginReturn {
  return api.post('/auth/token', { email, token });
}

export function logInWithRefreshToken(token: string): LoginReturn {
  const deviceId = getDeviceId() ?? '';

  return axios.post(
    `${env.backendUrl}/auth/refresh-token`,
    { refreshTokenJwt: token },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'device-id': deviceId,
      },
    }
  );
}

export function invalidateRefreshToken(): Promise<AxiosResponse> {
  return api.delete(`/auth/refresh-tokens/${getDeviceId()}`);
}
