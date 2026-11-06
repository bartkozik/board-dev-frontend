import { authUserSchema } from './user.schema';
import { RawUserRole } from '@/users/types';

const user = {
  authedBy: [{ type: 'MailAddress', id: 'identity-1' }],
  exp: 1900000000,
  fresh: true,
  iat: 1800000000,
  id: 'user-1',
  identities: [{ id: 'identity-1', main: true, type: 'MailAddress', value: 'developer@example.test', deviceId: null }],
  lastAuthedAt: '2026-11-06T10:00:00Z',
  roles: [RawUserRole.TechLeader],
  isBlocked: false,
  corporateClientId: null,
};

describe('authentication payload validation', () => {
  it('accepts backend claims without a derived email field', () => {
    expect(authUserSchema.parse(user)).toEqual(user);
  });

  it('accepts identities with hidden values and optional identifiers', () => {
    expect(authUserSchema.safeParse({ ...user,
      authedBy: [{ type: 'RecoveryCode' }],
      identities: [{ id: 'identity-2', main: false, type: 'RecoveryCode', value: null }],
    }).success).toBe(true);
  });

  it.each([null, [], {}, { ...user, roles: 'Admin' }, { ...user, roles: ['Tech Leader'] },
    { ...user, exp: '1900000000' }, { ...user, identities: [{}] }, { ...user, authedBy: ['MailAddress'] },
  ])('rejects malformed payloads', (input) => {
    expect(authUserSchema.safeParse(input).success).toBe(false);
  });
});
