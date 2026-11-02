import { v4 as uuid4 } from 'uuid';
import { LOCAL_STORAGE_AUTH_NAME } from '@/auth/constants';
import { Auth } from '@/auth/types';

// eslint-disable-next-line
export const parseJwt = (token: string): any => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
};

// ------------------ Access Token ------------------
export const getAccessTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN);
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

// ------------------ Refresh Token ------------------
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

// ------------------ Device ID ------------------
export const getDeviceId = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.DEVICE_ID);
};

export const saveDeviceId = (): void | undefined => {
  if (getDeviceId()) return;
  localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.DEVICE_ID, uuid4());
};
