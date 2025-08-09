import { User } from 'generated/prisma';

export type AuthUserType = Pick<User, 'id' | 'email'>;
