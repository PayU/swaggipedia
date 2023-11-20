import { v4 } from 'uuid';
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { TableNames } from '../connectors/consts';

export enum SwaggerFormats {
  Yaml = 'yaml',
  Json = 'json',
}

export interface SwaggerFileContent {
  id: string;
  file_content: string;
}

export interface InternalSwaggerResource {
  id: string;
  name: string;
  file_content_id?: string;
  FileContent?: SwaggerFileContent;
  created_at?: Date;
  updated_at?: Date;
}
export type SwaggerRequestBody = {
  name: string;
  file_content: string;
};
export type SwaggerResource = Omit<
  InternalSwaggerResource,
  'file_content_id'
> & {
  file_content?: string;
};

class SwaggerModel
  extends Model<InternalSwaggerResource, SwaggerRequestBody>
  implements InternalSwaggerResource
{
  public static FileContent: ModelStatic<Model<SwaggerFileContent>>;

  public id!: string;
  public name!: string;
  public readonly file_content_id!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static initializeModel(sequelizeClient: Sequelize): void {
    this.FileContent = sequelizeClient.define(
      'FileContent',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        file_content: {
          type: DataTypes.TEXT('long'),
          allowNull: false,
        },
      },
      {
        tableName: TableNames.SWAGGERS_CONTENT_TABLE_NAME,
        timestamps: false,
      }
    );

    this.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: TableNames.SWAGGERS_TABLE_NAME,
        sequelize: sequelizeClient,
      }
    );

    this.belongsTo(this.FileContent, {
      foreignKey: {
        name: 'file_content_id',
        allowNull: false,
      },
    });
  }

  public static fromRequest(requestBody: SwaggerRequestBody): SwaggerResource {
    const now = new Date();

    return {
      id: v4(),
      name: requestBody.name,
      file_content: requestBody.file_content,
      created_at: now,
      updated_at: now,
    };
  }

  public static toResponse(swagger: SwaggerModel): SwaggerResource {
    const { file_content_id, FileContent, ...restSwaggerProps } =
      swagger.dataValues;

    if (FileContent) {
      return this.toResponseWithFileContent(restSwaggerProps, FileContent);
    }

    return restSwaggerProps;
  }

  private static toResponseWithFileContent(
    swagger: SwaggerResource,
    swaggerFileContent: SwaggerFileContent
  ): SwaggerResource {
    return {
      id: swagger.id,
      name: swagger.name,
      file_content: swaggerFileContent.file_content,
      created_at: swagger.created_at,
      updated_at: swagger.updated_at,
    };
  }

  public static async includeFileContent(
    swagger: SwaggerModel
  ): Promise<SwaggerResource> {
    const fileContent = (await swagger[
      'getFileContent'
    ]()) as SwaggerFileContent;

    const { file_content_id, ...restSwaggerProps } = swagger.dataValues;

    return this.toResponseWithFileContent(restSwaggerProps, fileContent);
  }
}

export default SwaggerModel;
