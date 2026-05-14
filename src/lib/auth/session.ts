import 'server-only';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import type { UserRole } from '@/types';
import { authOptions } from './options';

export type CurrentUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  role: UserRole;
  clientRecordId?: string;
  status: string;
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const session = await getServerSession(authOptions);
  return session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        clientRecordId: session.user.clientRecordId,
        status: session.user.status,
      }
    : null;
};

export const requireAuth = async (): Promise<CurrentUser> => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.status === 'DISABLED') redirect('/login');
  return user;
};

export const requireClient = async (): Promise<CurrentUser> => {
  const user = await requireAuth();
  if (user.role !== 'CLIENT' || !user.clientRecordId) redirect('/login');
  return user;
};

export const requireOperator = async (): Promise<CurrentUser> => {
  const user = await requireAuth();
  if (user.role !== 'OPERATOR' && user.role !== 'ADMIN') redirect('/client/dashboard');
  return user;
};

export const requireAdmin = async (): Promise<CurrentUser> => {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') redirect('/operator/clients');
  return user;
};

export const roleHomePath = (role: UserRole) =>
  role === 'CLIENT' ? '/client/dashboard' : '/operator/clients';

export const redirectByRole = async () => {
  const user = await requireAuth();
  redirect(roleHomePath(user.role));
};
