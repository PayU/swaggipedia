import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { SwaggerResource } from '../database/models/swagger';
import { SwaggersRepository } from '../database/repositories/swaggerRepo';
import { ErrorMessages } from '../../helpers/common';

declare module 'koa' {
  interface ExtendableContext {
    swaggerResource?: SwaggerResource;
  }
}

export const findSwagger = (): ((ctx: Context, next: Next) => void) => {
  return async (ctx: Context, next: Next) => {
    const swaggerId = ctx.params.swagger_id;

    ctx.swaggerResource = await SwaggersRepository.getSwagger(swaggerId);

    if (!ctx.swaggerResource) {
      ctx.throw(StatusCodes.NOT_FOUND, ErrorMessages.SWAGGER_NOT_FOUND);
    }

    await next();
  };
};
