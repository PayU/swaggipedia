import { Middleware } from 'koa';
import koaRouter from '@koa/router';
import SwaggersController from './controller';
import { findSwagger } from '../middlewares/findSwagger';
import { swaggerParser } from '../middlewares/swaggerParser';
import openApiValidator from '../middlewares/openApiValidator';
import { swaggerDuplicationValidator } from '../middlewares/swaggerDuplicationValidator';

export default function swaggersRouter(): Middleware {
  const router = new koaRouter({
    prefix: '/v1/swaggers',
  });

  const swaggersController = new SwaggersController();

  // Get
  router.get('/', openApiValidator(), (ctx) =>
    swaggersController.getAllSwaggers(ctx)
  );
  router.get('/:swagger_id', openApiValidator(), findSwagger(), (ctx) =>
    swaggersController.getSwagger(ctx)
  );

  // Create
  router.post(
    '/',
    openApiValidator(),
    swaggerParser(),
    swaggerDuplicationValidator(),
    (ctx) => swaggersController.createSwagger(ctx)
  );

  // Update
  router.put(
    '/:swagger_id',
    openApiValidator(),
    findSwagger(),
    swaggerParser(),
    swaggerDuplicationValidator(),
    (ctx) => swaggersController.updateSwagger(ctx)
  );

  // Delete
  router.delete('/:swagger_id', openApiValidator(), findSwagger(), (ctx) =>
    swaggersController.deleteSwagger(ctx)
  );

  return router.routes() as Middleware;
}
