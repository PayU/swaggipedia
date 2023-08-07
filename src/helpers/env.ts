interface Env {
  LOG_LEVEL: string;
  PORT: number;
  FORCE_SHUTDOWN_TIMEOUT_SEC: number;
  SHUTDOWN_INITIAL_DELAY_SEC: number;
  SERVER_KEEP_ALIVE: number;
}

const env: Env = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  PORT: Number(process.env.PORT) || 3000,
  FORCE_SHUTDOWN_TIMEOUT_SEC: Number(process.env.FORCE_SHUTDOWN_TIMEOUT_SEC),
  SHUTDOWN_INITIAL_DELAY_SEC: Number(process.env.SHUTDOWN_INITIAL_DELAY_SEC),
  SERVER_KEEP_ALIVE: Number(process.env.SERVER_KEEP_ALIVE),
};

export default env;
