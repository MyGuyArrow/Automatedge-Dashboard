import bcrypt from 'bcryptjs';

const saltRounds = 12;

export const hashPassword = (password: string) => bcrypt.hash(password, saltRounds);

export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
