import Koa from 'koa';
import koaBodyparser from 'koa-bodyparser';
import logger from './helpers/logger';
import healthRouter from './server/health/router';
import uiRouter, { serveStaticFiles } from './server/ui/router';
import swaggersRouter from './server/swaggers/router';
import errorHandler from './server/middlewares/errorHandler';
import corsHandler from './server/middlewares/corsHandler';

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
  corsHandler(app);
  app.use(errorHandler());
  app.use(koaBodyparser());

  // register routes
  app.use(healthRouter());
  app.use(swaggersRouter());
  app.use(uiRouter());
  app.use(serveStaticFiles());

  return app;
}
