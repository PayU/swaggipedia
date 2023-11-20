import loadSecretsIfNeeded from './secrets';
type SupportedDatabaseTypes =
  | 'sqlite'
  | 'mysql'
  | 'postgres'
  | 'mariadb'
  | 'mssql'
  | 'oracle';

interface Env {
  LOG_LEVEL: string;
  DATABASE_TYPE: SupportedDatabaseTypes;
  DATABASE_NAME: string;
  DATABASE_ADDRESS: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  SQLITE_STORAGE_PATH: string;
  PORT: number;
  FORCE_SHUTDOWN_TIMEOUT_SEC: number;
  SHUTDOWN_INITIAL_DELAY_SEC: number;
  SERVER_KEEP_ALIVE: number;
}

loadSecretsIfNeeded();
const env: Env = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_TYPE: (process.env.DATABASE_TYPE ||
    'sqlite') as SupportedDatabaseTypes,
  DATABASE_NAME: process.env.DATABASE_NAME || 'swaggipedia',
  DATABASE_ADDRESS: process.env.DATABASE_ADDRESS,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  SQLITE_STORAGE_PATH:
    process.env.SQLITE_STORAGE_PATH || './db/swaggipedia.sqlite',
  PORT: Number(process.env.PORT) || 3000,
  FORCE_SHUTDOWN_TIMEOUT_SEC:
    Number(process.env.FORCE_SHUTDOWN_TIMEOUT_SEC) || 30,
  SHUTDOWN_INITIAL_DELAY_SEC:
    Number(process.env.SHUTDOWN_INITIAL_DELAY_SEC) || 5,
  SERVER_KEEP_ALIVE: Number(process.env.SERVER_KEEP_ALIVE),
};

export default env;
