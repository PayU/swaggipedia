import { Middleware } from 'koa';
import koaRouter from '@koa/router';
import { createReadStream } from 'fs';

export default function uiRouter(): Middleware {
  const router = new koaRouter();

  router.get('/', (ctx) => {
    ctx.status = 404;
  });
  router.get('/ui', (ctx) => {
    ctx.type = 'html';
    ctx.body = createReadStream('./src/ui/build/index.html');
    ctx.status = 200;
  });

  return router.routes() as Middleware;
}
