import Koa from 'koa';
import cors from '@koa/cors';
import logger from '../../helpers/logger';
import env from '../../helpers/env';

export default function (app: Koa): void {
  if (env.ENABLE_CORS) {
    logger.info('Enabling cors middleware');
    app.use(cors());
  }
}
