import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import YamlToJson from 'js-yaml';
import { SwaggerFormats, SwaggerRequestBody } from '../database/models/swagger';
import { ErrorMessages, Headers } from '../../helpers/common';

export const swaggerParser = (): ((ctx: Context, next: Next) => void) => {
  return async (ctx: Context, next: Next) => {
    const swaggerFormat = ctx.get(Headers.X_SWAGGER_FORMAT) as SwaggerFormats;
    const swaggerData = (ctx.request.body as SwaggerRequestBody).file_content;
    if (swaggerData) {
      if (swaggerFormat === SwaggerFormats.Yaml) {
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
      } else if (swaggerFormat === SwaggerFormats.Json) {
        try {
          JSON.parse(swaggerData);
        } catch (err) {
          ctx.throw(
            StatusCodes.BAD_REQUEST,
            `${ErrorMessages.SWAGGER_NOT_PARSABLE}: [${err.message}].`
          );
        }
      }
    }

    await next();
  };
};
