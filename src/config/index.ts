export default {
  port: Number(process.env.PORT) || 8080,
  backendIp: process.env.BACKEND_IP || '10.10.11.65', // Bind to all interfaces in Docker
  db: {
  host: process.env.PG_HOST || 'localhost', // fallback to localhost
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres123',
  name: process.env.PG_DATABASE || 'm360ict_hr',
  url: process.env.DATABASE_URL,
  ssl: process.env.PG_SSL === 'true',
}
};
