import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import qs from 'qs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { rootStore } from '@/RootStore';
import { routes } from '@/app/routes';
import env from '@/domain/env';
import { readStoredAuth, getDeviceId, getRefreshTokenFromLocalStorage } from './utils';

const LEEWAY = 1;
dayjs.extend(isSameOrBefore);

const api = axios.create({
  baseURL: env.backendUrl,
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      arrayFormat: 'repeat',
    });
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    return new Promise((resolve) => {
      const parsedAuthDetails = readStoredAuth();

      const refreshToken = getRefreshTokenFromLocalStorage();

      const currentTimeInMs = new Date().getTime();
      const accessTokenExpTimeInMs = parsedAuthDetails?.user.exp
        ? dayjs(parsedAuthDetails.user.exp * 1000).subtract(LEEWAY, 'minute')
        : 0;
      const isAccessTokenValid = dayjs(currentTimeInMs).isSameOrBefore(accessTokenExpTimeInMs, 'minute');

      const deviceId = getDeviceId() ?? '';

      const defaultHeaders = {
        ...config.headers,
        'device-id': deviceId,
      };

      if (isAccessTokenValid) {
        return resolve({
          ...config,
          headers: new AxiosHeaders({
            ...defaultHeaders,
            Authorization: `Bearer ${parsedAuthDetails?.token}`,
          }),
        });
      } else if (refreshToken) {
        rootStore.authStore.setQueuedRequests((token: string) => {
          return resolve({
            ...config,
            headers: new AxiosHeaders({
              ...defaultHeaders,
              Authorization: `Bearer ${token}`,
            }),
          });
        });

        if (!rootStore.authStore.submittingLoginWithRefreshToken)
          return rootStore.authStore.logInWithRefreshToken(refreshToken);
      } else
        return resolve({
          ...config,
          headers: new AxiosHeaders(defaultHeaders),
        });
    });
  },
  (err: unknown) => Promise.reject(err)
);

api.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error: unknown) => {
    if (axios.isAxiosError<unknown>(error) && !error.config?.url?.startsWith('/auth') && error.response?.status === 401) {
      rootStore.authStore.logout();
      return window.location.replace(location.origin + routes.Login.path());
    } else return Promise.reject(error);
  }
);

export default api;
