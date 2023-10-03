import { v4 } from 'uuid';
import SwaggerModel, {
  SwaggerRequestBody,
  InternalSwaggerResource,
  SwaggerResource,
} from '../models/swagger';

export class SwaggersRepository {
  public static async getAllSwaggers(
    includeFileContent = false
  ): Promise<SwaggerModel[]> {
    const swaggers = await SwaggerModel.findAll({
      include: includeFileContent ? SwaggerModel.FileContent : undefined,
    });

    return swaggers;
  }
  public static async getSwagger(id: string): Promise<SwaggerModel> {
    const swaggers = await SwaggerModel.findByPk(id);
    return swaggers;
  }

  public static async createSwagger(
    swagger: SwaggerResource
  ): Promise<SwaggerResource> {
    const { file_content, ...restSwaggerProps } = swagger;
    const swaggerFileContent = {
      id: v4(),
      file_content: file_content,
    };

    await SwaggerModel.FileContent.create(swaggerFileContent);
    await SwaggerModel.create({
      ...restSwaggerProps,
      file_content_id: swaggerFileContent.id,
    } as InternalSwaggerResource);

    return swagger;
  }

  public static async updateSwagger(
    existingResource: SwaggerModel,
    payload: SwaggerRequestBody
  ): Promise<void> {
    if (payload.name) {
      await existingResource.update({
        name: payload.name,
        updated_at: new Date(),
      });
    }

    if (payload.file_content) {
      await SwaggerModel.FileContent.update(
        {
          file_content: payload.file_content,
        },
        { where: { id: existingResource.file_content_id } }
      );
    }
  }

  public static async deleteSwagger(swagger: SwaggerModel): Promise<boolean> {
    const deletedSwagger = await SwaggerModel.destroy({
      where: { id: swagger.id },
    });
    SwaggerModel.FileContent.destroy({
      where: { id: swagger.file_content_id },
    });

    return !!deletedSwagger;
  }
}
