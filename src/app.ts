import Koa from 'koa';
import serve from 'koa-static';
import koaBodyparser from 'koa-bodyparser';
import logger from './helpers/logger';
import healthRouter from './server/health/router';
import uiRouter from './server/ui/router';
import swaggersRouter from './server/swaggers/router';
import errorHandler from './server/middlewares/errorHandler';
import path from 'path';

process.on('uncaughtException', (error: Error) => {
  logger.error(error, `uncaughtException detected`);
});

process.on('unhandledRejection', (error: Error) => {
  logger.error(error, `unhandledRejection detected`);
});

export function createApp(): Koa {
  logger.info('Starting HTTP server...');
  const app = new Koa();

  // Register Middlewares
  app.use(errorHandler());
  app.use(koaBodyparser());

  // register routes
  app.use(healthRouter());
  app.use(swaggersRouter());
  app.use(uiRouter());

  app.use(serve(path.join(__dirname, '/ui/build')));

  return app;
}
