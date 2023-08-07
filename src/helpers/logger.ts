import pino from 'pino';
import env from './env';

const logger = pino({
  name: 'swaggipedia',
  level: env.LOG_LEVEL || 'info',
});

export default logger;
