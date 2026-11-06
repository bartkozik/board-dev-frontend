import { v4 as uuid4 } from 'uuid';
import { LOCAL_STORAGE_AUTH_NAME } from '@/auth/constants';
import { authSchema, authUserSchema } from '@/auth/user.schema';
import { Auth, AuthTokenUser } from '@/auth/types';

export const parseJwt = (token: string): AuthTokenUser => {
  const base64Url = token.split('.')[1];
  if (!base64Url) throw new Error('Invalid access token');
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return authUserSchema.parse(JSON.parse(jsonPayload));
};

export const getAccessTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN);
};

export const readStoredAuth = (): Auth | null => {
  const stored = getAccessTokenFromLocalStorage();
  if (!stored) return null;
  try {
    return authSchema.parse(JSON.parse(stored));
  } catch {
    removeAccessTokenFromLocalStorage();
    removeRefreshTokenFromLocalStorage();
    return null;
  }
};

export const saveAccessTokenInLocalStorage = (token: string): Auth => {
  const user = parseJwt(token);
  const newSerializedState: Auth = { token, user };

  localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN, JSON.stringify(newSerializedState));

  return newSerializedState;
};

export function removeAccessTokenFromLocalStorage(): void {
  localStorage.removeItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN);
}

export const getRefreshTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.REFRESH_TOKEN);
};

export const saveRefreshTokenInLocalStorage = (token: string): string => {
  localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.REFRESH_TOKEN, token);
  return token;
};

export const removeRefreshTokenFromLocalStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_AUTH_NAME.REFRESH_TOKEN);
};

export const getDeviceId = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.DEVICE_ID);
};

export const saveDeviceId = (): void | undefined => {
  if (getDeviceId()) return;
  localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.DEVICE_ID, uuid4());
};
