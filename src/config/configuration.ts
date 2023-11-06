import * as process from 'process';

export default () => ({
  // DATABASE
  database_dialect: process.env.DATABASE_DIALECT,
  database_host: process.env.DATABASE_HOST,
  database_port: process.env.DATABASE_PORT,
  database_db: process.env.DATABASE_DB,
  database_user: process.env.DATABASE_USER,
  database_password: process.env.DATABASE_PASSWORD,

  // COMMON SETTINGS
  api_port: process.env.API_PORT,

  // JWT CREDENTIALS
  jwt_secret: process.env.JWT_SECRET,

  // LINKS
  frontend_url: process.env.FRONTEND_URL,
});
