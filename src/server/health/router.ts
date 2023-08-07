import { Middleware } from 'koa';
import koaRouter from '@koa/router';
import { HealthController } from './controller';

export default function healthRouter(): Middleware {
  const router = new koaRouter();
  const healthController = new HealthController();

  router.get('/health', (ctx) => healthController.checkHealth(ctx));

  return router.routes() as Middleware;
}
