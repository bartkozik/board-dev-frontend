import { AxiosResponse } from 'axios';
import { UserRole } from '@/users/types';

export enum IdentityType {
  MailAddress = 'MailAddress',
}

interface Identity {
  main: boolean;
  type: IdentityType;
  value: string;
}

export interface AuthUser {
  authedBy: string[];
  email: string;
  exp: number;
  fresh: boolean;
  iat: number;
  id: string;
  identities: Identity[];
  lastAuthedAt: string;
  roles: UserRole[];
}

export interface Auth {
  token: string;
  user: AuthUser;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type QueuedRequest = (accessToken: string) => void;

export type LoginReturn = Promise<AxiosResponse<AuthTokens>>;
export type RefreshTokenReturn = Promise<AxiosResponse<{ refreshTokenJwt: string }>>;
