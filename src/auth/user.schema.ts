import { z } from 'zod';
import { RawUserRole } from '@/users/types';

const identityTypeSchema = z.enum([
  'MailAddress', 'Phone', 'CryptoVerification', 'AdminImpersonate',
  'TimeBasedOneTimePassword', 'RecoveryCode',
]);

export const authUserSchema = z.object({
  authedBy: z.array(z.object({ type: identityTypeSchema, id: z.string().nullish() })),
  exp: z.number(),
  fresh: z.boolean(),
  iat: z.number(),
  id: z.string(),
  identities: z.array(z.object({
    id: z.string(),
    main: z.boolean(),
    type: identityTypeSchema,
    value: z.string().nullish(),
    deviceId: z.string().nullish(),
  })),
  lastAuthedAt: z.string(),
  roles: z.array(z.nativeEnum(RawUserRole)),
  isBlocked: z.boolean(),
  corporateClientId: z.string().nullish(),
});

export const authSchema = z.object({ token: z.string(), user: authUserSchema });
