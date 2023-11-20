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

    if (requestBody.file_content) {
      const swaggerName = requestBody.name?.toLowerCase();

      let existingSwaggers = await SwaggersRepository.getAllSwaggers(true);
      if (ctx.request.method === 'PUT') {
        existingSwaggers = existingSwaggers.filter(
          (swagger) => swagger.id !== ctx.params.swagger_id
        );
      }

      const existingSwaggerNames = existingSwaggers.map((swagger) =>
        swagger.name.toLowerCase()
      );

      if (existingSwaggerNames.includes(swaggerName)) {
        ctx.throw(
          StatusCodes.CONFLICT,
          ErrorMessages.SWAGGER_NAME_ALREADY_EXISTS
        );
      }
    }

    await next();
  };
};
