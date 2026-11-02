import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from '@/RootStore';
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  removeAccessTokenFromLocalStorage,
  removeRefreshTokenFromLocalStorage,
  saveAccessTokenInLocalStorage,
  saveRefreshTokenInLocalStorage,
} from '@/api';
import { UserFormData } from '@/users/types';
import { API_ERROR_STATUS_TYPE, showErrorToast } from '@/utils/helpers';
import * as requests from './requests';
import { Auth, AuthUser, IdentityType, QueuedRequest } from './types';

class AuthStore {
  rootStore: RootStore;
  accessToken: Auth | null = null;
  queuedRequests: QueuedRequest[] = [];
  refreshToken: string | null = null;
  submitting = false;
  submittingLogin = false;
  submittingLoginWithRefreshToken = false;
  submittingLogout = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.init();
    makeAutoObservable(this);
  }

  get loggedInUser(): AuthUser | null {
    if (!this.accessToken) return null;

    return {
      ...this.accessToken.user,
      email: this.accessToken.user?.identities?.find(({ type }) => type === IdentityType.MailAddress)?.value ?? '',
    };
  }

  get isAuthenticated(): boolean {
    return Boolean(this.accessToken && this.refreshToken);
  }

  private init = (): void | null => {
    const authDetails = getAccessTokenFromLocalStorage();
    const refreshToken = getRefreshTokenFromLocalStorage();

    if (!authDetails || !refreshToken) return null;

    this.saveAccessToken(JSON.parse(authDetails));
    this.saveRefreshToken(refreshToken);
  };

  private saveAccessToken = (data: Auth): void => {
    this.accessToken = data;
  };

  private removeAccessToken = (): void => {
    this.accessToken = null;
  };

  private saveRefreshToken = (token: string | null): void => {
    this.refreshToken = token;
  };

  private removeRefreshToken = (): void => {
    this.refreshToken = null;
  };

  createUser = (user: UserFormData, withToast: boolean = true): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .createUser(user)
      .then(() => {
        withToast && addToast(toastMessages.USERS.CREATE_SUCCESS, 'success');
        return;
      })
      .catch((err) =>
        showErrorToast(
          {
            default: toastMessages.USERS.CREATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  loginWithToken = (email: string, token: string): Promise<string | void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submittingLogin = true));

    return requests
      .logInWithToken(email, token)
      .then(({ data: { accessToken, refreshToken } }) => {
        const authDetails = saveAccessTokenInLocalStorage(accessToken);
        this.saveAccessToken(authDetails);

        const refreshTokenData = saveRefreshTokenInLocalStorage(refreshToken);
        this.saveRefreshToken(refreshTokenData);
      })
      .catch((err) => {
        if (err.message === API_ERROR_STATUS_TYPE.TOKEN_EXPIRED) return toastMessages.AUTH.LOGIN_TOKEN_EXPIRED;
        else return toastMessages.DEFAULT.ERROR;
      })
      .finally(() => runInAction(() => (this.submittingLogin = false)));
  };

  sendEmailWithMagicLink = (email: string): Promise<void | boolean> => {
    const { toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .sendEmailWithMagicLink(email)
      .then(() => true)
      .catch((err) => {
        showErrorToast(
          {
            default: toastMessages.DEFAULT.ERROR,
          },
          err
        );
      })
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  setQueuedRequests = (newReq: QueuedRequest): void => {
    this.queuedRequests = [...this.queuedRequests, newReq];
  };

  logInWithRefreshToken = (refreshToken: string): Promise<string | void> => {
    runInAction(() => (this.submittingLoginWithRefreshToken = true));

    return requests
      .logInWithRefreshToken(refreshToken)
      .then(({ data }) => {
        const authDetails = saveAccessTokenInLocalStorage(data.accessToken);
        this.saveAccessToken(authDetails);

        saveRefreshTokenInLocalStorage(data.refreshToken);
        this.saveRefreshToken(data.refreshToken);

        Promise.all(this.queuedRequests.map((req) => req(data.accessToken)));

        return data.accessToken;
      })
      .catch(() => {
        this.removeAccessToken();
        this.removeRefreshToken();
        removeAccessTokenFromLocalStorage();
        removeRefreshTokenFromLocalStorage();
      })
      .finally(() =>
        runInAction(() => {
          this.submittingLoginWithRefreshToken = false;
          this.queuedRequests = [];
        })
      );
  };

  private invalidateRefreshToken = (): Promise<void> => {
    return requests.invalidateRefreshToken().then(() => {
      this.removeRefreshToken();
      removeRefreshTokenFromLocalStorage();
    });
  };

  logout = (): Promise<void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submittingLogout = true));

    return this.invalidateRefreshToken()
      .then(() => {
        this.removeAccessToken();
        removeAccessTokenFromLocalStorage();
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.AUTH.LOGOUT_ERROR }, err);
      })
      .finally(() => runInAction(() => (this.submittingLogout = false)));
  };
}

export default AuthStore;
