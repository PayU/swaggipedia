import SwaggerModel, {
  SwaggerRequestBody,
  SwaggerResource,
} from '../models/swagger';

export class SwaggersRepository {
  public static async getAllSwaggers(): Promise<SwaggerResource[]> {
    const swaggers = await SwaggerModel.findAll();
    return swaggers;
  }
  public static async getSwagger(id: string): Promise<SwaggerResource> {
    const swaggers = await SwaggerModel.findByPk(id);
    return swaggers;
  }

  public static async createSwagger(
    swagger: SwaggerResource
  ): Promise<SwaggerResource> {
    const createdSwagger = await SwaggerModel.create(swagger);
    return createdSwagger;
  }

  public static async updateSwagger(
    existingResource: SwaggerModel,
    payload: SwaggerRequestBody
  ): Promise<SwaggerResource> {
    const updatedSwagger = await existingResource.update({
      ...payload,
      updated_at: new Date(),
    });

    return updatedSwagger;
  }

  public static async deleteSwagger(id: string): Promise<boolean> {
    const deletedSwagger = await SwaggerModel.destroy({
      where: { id },
    });
    return !!deletedSwagger;
  }
}
