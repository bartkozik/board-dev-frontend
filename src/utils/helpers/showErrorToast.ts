import axios from 'axios';
import { rootStore } from '@/RootStore';

export const API_ERROR_STATUS_TYPE = {
  AUTHORIZATION_FAILED: 'rejection:authentication-failed',
  TOKEN_EXPIRED: 'result:login-by-token:token-expired',
  DUPLICATED_USER: 'result:user-create:identity-already-exist',
  DUPLICATED_CORPORATE_CLIENT: 'result:corporate-client-create:identity-already-exist',
  INVALID_CREDENTIALS: 'result:login:invalid-credentials',
  LOGIN_NOT_FOUND: 'result:login:user-or-password-not-found',
  CORPORATE_CLIENT_NOT_FOUND: 'result:corporate-client:not-found',
};

interface ErrorTypeMessages {
  [key: string]: string;
}

interface ErrorMessageMap {
  [key: string]: ErrorTypeMessages | string;
}

export function showErrorToast(errorMessageMap: ErrorMessageMap, error: unknown): void {
  const { addToast, toastMessages } = rootStore.toastsStore;

  if (!axios.isAxiosError<unknown>(error)) {
    addToast(toastMessages.DEFAULT.ERROR, 'error');
    return;
  }

  const { response } = error;
  const statusCode = response?.status?.toString() ?? 'default';
  const data = response?.data;
  const errorType = data && typeof data === 'object' && 'type' in data && typeof data.type === 'string' ? data.type : undefined;

  let toastMessage = errorMessageMap.default as string;

  if (statusCode in errorMessageMap) {
    const statusMessages = errorMessageMap[statusCode];

    if (typeof statusMessages === 'object') {
      const matchedKey = Object.keys(statusMessages).find((key) => errorType?.includes(key));
      if (matchedKey) {
        toastMessage = statusMessages[matchedKey];
      } else {
        toastMessage = statusMessages.default ?? toastMessage;
      }
    } else if (typeof statusMessages === 'string') {
      toastMessage = statusMessages;
    }
  }

  addToast(toastMessage, 'error');
}
