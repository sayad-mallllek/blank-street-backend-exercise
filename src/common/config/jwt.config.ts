export const JwtConfig = {
  secret: process.env.JWT_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
