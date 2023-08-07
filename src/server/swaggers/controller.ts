import StatusCodes from 'http-status-codes';
import { Context } from 'koa';
import SwaggerModel, { SwaggerRequestBody } from '../database/models/swagger';
import { SwaggersRepository } from '../database/repositories/swaggerRepo';

export default class SwaggersController {
  // Get
  async getAllSwaggers(ctx: Context): Promise<void> {
    ctx.body = await SwaggersRepository.getAllSwaggers();
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

    const updatedSwagger = await SwaggersRepository.updateSwagger(
      existingResource as SwaggerModel,
      requestBody
    );

    ctx.body = updatedSwagger;
    ctx.status = StatusCodes.OK;
  }

  // Delete
  async deleteSwagger(ctx: Context): Promise<void> {
    const swagger = ctx.swaggerResource;

    await SwaggersRepository.deleteSwagger(swagger.id);

    ctx.body = undefined;
    ctx.status = StatusCodes.NO_CONTENT;
  }
}
