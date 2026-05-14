import type { DefaultSession } from 'next-auth';
import type { UserRole } from './index';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      clientRecordId?: string;
      status: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: UserRole;
    clientRecordId?: string;
    status: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    clientRecordId?: string;
    status: string;
  }
}
