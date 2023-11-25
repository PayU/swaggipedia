import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import YamlToJson from 'js-yaml';
import { SwaggerRequestBody } from '../database/models/swagger';
import { ErrorMessages } from '../../helpers/common';

export const swaggerParser = (): ((ctx: Context, next: Next) => void) => {
  return async (ctx: Context, next: Next) => {
    const swaggerData = (ctx.request.body as SwaggerRequestBody).file_content;
    if (swaggerData) {
      try {
        const jsonContent = YamlToJson.load(swaggerData);
        (ctx.request.body as SwaggerRequestBody).file_content =
          JSON.stringify(jsonContent);
      } catch (err) {
        ctx.throw(
          StatusCodes.BAD_REQUEST,
          `${ErrorMessages.SWAGGER_NOT_PARSABLE}: [${err.message}].`
        );
      }
    }

    await next();
  };
};
