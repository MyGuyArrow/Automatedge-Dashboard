import 'server-only';

import type { CurrentUser } from '@/lib/auth/session';

export class AuthorizationError extends Error {
  constructor(message = 'You are not authorized to perform this action.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export const isInternalUser = (user: CurrentUser) =>
  user.role === 'OPERATOR' || user.role === 'ADMIN';

export const assertClientAccess = (user: CurrentUser, clientRecordId: string) => {
  if (isInternalUser(user)) return;
  if (user.role === 'CLIENT' && user.clientRecordId === clientRecordId) return;
  throw new AuthorizationError('Client workspace access denied.');
};

export const assertInternal = (user: CurrentUser) => {
  if (!isInternalUser(user)) {
    throw new AuthorizationError('Operator or admin access required.');
  }
};

export const assertAdmin = (user: CurrentUser) => {
  if (user.role !== 'ADMIN') {
    throw new AuthorizationError('Admin access required.');
  }
};
