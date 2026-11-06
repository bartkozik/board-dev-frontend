import { AxiosResponse } from 'axios';
import { z } from 'zod';
import { authSchema, authUserSchema } from './user.schema';

export enum IdentityType {
  MailAddress = 'MailAddress',
}

export type AuthTokenUser = z.infer<typeof authUserSchema>;
export type AuthUser = AuthTokenUser & { email: string };
export type Auth = z.infer<typeof authSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type QueuedRequest = (accessToken: string) => void;

export type LoginReturn = Promise<AxiosResponse<AuthTokens>>;
export type RefreshTokenReturn = Promise<AxiosResponse<{ refreshTokenJwt: string }>>;
