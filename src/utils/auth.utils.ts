import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  // TODO: Export it from Config module and `process.env`
  const salt = await bcrypt.genSalt();

  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hash: string = '10',
) => {
  return await bcrypt.compare(password, hash);
};
