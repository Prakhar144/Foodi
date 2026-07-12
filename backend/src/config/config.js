import 'dotenv/config';

const getDbConfig = () => {
  const databaseUrlValue = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
  if (databaseUrlValue) {
    try {
      const databaseUrl = new URL(databaseUrlValue);
      return {
        host: databaseUrl.hostname,
        port: Number(databaseUrl.port || 3306),
        user: decodeURIComponent(databaseUrl.username || 'root'),
        password: decodeURIComponent(databaseUrl.password || ''),
        database: databaseUrl.pathname.replace(/^\//, '') || 'railway',
      };
    } catch (e) {
      console.error('Invalid DATABASE_URL, falling back to individual parameters.', e.message);
    }
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'cravingdash',
  };
};

export const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_default_for_development',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  clientUrl: process.env.CLIENT_URL || '*',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  db: getDbConfig(),
};
