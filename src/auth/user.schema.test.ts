import { parseJwt, readStoredAuth } from '@/api/utils';
import { LOCAL_STORAGE_AUTH_NAME } from './constants';
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

describe('stored authentication', () => {
  beforeEach(() => localStorage.clear());

  it('decodes the backend token contract', () => {
    const token = `header.${btoa(JSON.stringify(user))}.signature`;
    expect(parseJwt(token)).toEqual(user);
  });

  it('restores validated tokens', () => {
    const stored = { token: 'test-token', user };
    localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN, JSON.stringify(stored));
    expect(readStoredAuth()).toEqual(stored);
  });

  it.each(['{broken', JSON.stringify({ token: 'test-token', user: { roles: 'Admin' } })])(
    'clears corrupt authentication without crashing startup', (stored) => {
      localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN, stored);
      localStorage.setItem(LOCAL_STORAGE_AUTH_NAME.REFRESH_TOKEN, 'test-refresh');
      expect(readStoredAuth()).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem(LOCAL_STORAGE_AUTH_NAME.REFRESH_TOKEN)).toBeNull();
    }
  );
});
