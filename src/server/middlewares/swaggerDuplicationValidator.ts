import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { SwaggerRequestBody } from '../database/models/swagger';
import { SwaggersRepository } from '../database/repositories/swaggerRepo';
import { ErrorMessages } from '../../helpers/common';

export const swaggerDuplicationValidator = (): ((
  ctx: Context,
  next: Next
) => void) => {
  return async (ctx: Context, next: Next) => {
    const requestBody = ctx.request.body as SwaggerRequestBody;

    const existingSwaggerNames = (
      await SwaggersRepository.getAllSwaggers()
    ).map((swagger) => swagger.name.toLowerCase());

    if (existingSwaggerNames.includes(requestBody.name.toLowerCase())) {
      ctx.throw(StatusCodes.CONFLICT, ErrorMessages.SWAGGER_ALREADY_EXISTS);
    }

    await next();
  };
};
