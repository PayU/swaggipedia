import { Middleware } from 'koa';
import koaRouter from '@koa/router';
import mount from 'koa-mount';
import serve from 'koa-static';
import { createReadStream } from 'fs';
import path from 'path';

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

export function serveStaticFiles(): Middleware {
  return mount('/ui', serve(path.join(__dirname, '..', '..', '/ui/build')));
}
