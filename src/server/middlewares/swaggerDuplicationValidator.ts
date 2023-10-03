import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import {
  SwaggerFileContent,
  SwaggerRequestBody,
} from '../database/models/swagger';
import { SwaggersRepository } from '../database/repositories/swaggerRepo';
import { ErrorMessages } from '../../helpers/common';

const extractSwaggerTitleFromContent = (swaggerContent: string): string =>
  JSON.parse(swaggerContent)?.info?.title;

export const swaggerDuplicationValidator = (): ((
  ctx: Context,
  next: Next
) => void) => {
  return async (ctx: Context, next: Next) => {
    const requestBody = ctx.request.body as SwaggerRequestBody;

    if (requestBody.file_content) {
      const swaggerName = requestBody.name.toLowerCase();
      const swaggerTitle = extractSwaggerTitleFromContent(
        requestBody.file_content
      );

      let existingSwaggers = await SwaggersRepository.getAllSwaggers(true);
      if (ctx.request.method === 'PUT') {
        existingSwaggers = existingSwaggers.filter(
          (swagger) => swagger.id !== ctx.params.swagger_id
        );
      }

      const existingSwaggerNames = existingSwaggers.map((swagger) =>
        swagger.name.toLowerCase()
      );
      const existingSwaggerTitles = existingSwaggers.map((swagger) => {
        const swaggerFileContent = swagger['FileContent']
          .dataValues as SwaggerFileContent;
        return extractSwaggerTitleFromContent(swaggerFileContent.file_content);
      });

      if (existingSwaggerNames.includes(swaggerName)) {
        ctx.throw(
          StatusCodes.CONFLICT,
          ErrorMessages.SWAGGER_NAME_ALREADY_EXISTS
        );
      }
      if (existingSwaggerTitles.includes(swaggerTitle)) {
        ctx.throw(
          StatusCodes.CONFLICT,
          ErrorMessages.SWAGGER_TITLE_ALREADY_EXISTS
        );
      }
    }

    await next();
  };
};
