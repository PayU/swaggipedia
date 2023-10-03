import StatusCodes from 'http-status-codes';
import { Context } from 'koa';
import SwaggerModel, { SwaggerRequestBody } from '../database/models/swagger';
import { SwaggersRepository } from '../database/repositories/swaggerRepo';

export default class SwaggersController {
  // Get
  async getAllSwaggers(ctx: Context): Promise<void> {
    const includeFileContent = ctx.request.query['expand'] === 'file_content';

    const allSwaggers = await SwaggersRepository.getAllSwaggers(
      includeFileContent
    );

    ctx.body = allSwaggers.map((swagger) => SwaggerModel.toResponse(swagger));
    ctx.status = StatusCodes.OK;
  }

  // Get
  async getSwagger(ctx: Context): Promise<void> {
    const swagger = ctx.swaggerResource;
    ctx.body = await SwaggerModel.includeFileContent(swagger);
    ctx.status = StatusCodes.OK;
  }

  // Create
  async createSwagger(ctx: Context): Promise<void> {
    const requestBody = ctx.request.body as SwaggerRequestBody;

    const swagger = await SwaggersRepository.createSwagger(
      SwaggerModel.fromRequest(requestBody)
    );

    ctx.body = swagger;
    ctx.status = StatusCodes.CREATED;
  }

  // Update
  async updateSwagger(ctx: Context): Promise<void> {
    const existingResource = ctx.swaggerResource;
    const requestBody = ctx.request.body as SwaggerRequestBody;

    await SwaggersRepository.updateSwagger(existingResource, requestBody);

    ctx.body = await SwaggerModel.includeFileContent(existingResource);
    ctx.status = StatusCodes.OK;
  }

  // Delete
  async deleteSwagger(ctx: Context): Promise<void> {
    const swagger = ctx.swaggerResource;

    await SwaggersRepository.deleteSwagger(swagger);

    ctx.body = undefined;
    ctx.status = StatusCodes.NO_CONTENT;
  }
}
