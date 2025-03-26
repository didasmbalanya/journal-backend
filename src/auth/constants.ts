export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
