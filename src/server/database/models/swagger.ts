import { v4 } from 'uuid';
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { TableNames } from '../connectors/consts';

export interface SwaggerFileContent {
  id: string;
  file_content: string;
}

export interface InternalSwaggerResource {
  id: string;
  title: string;
  aliases?: string;
  file_content_id?: string;
  FileContent?: SwaggerFileContent;
  repository_url: string;
  file_source_path?: string;
  created_at?: Date;
  updated_at?: Date;
}
export type SwaggerRequestBody = {
  title: string;
  aliases?: string;
  file_content: string;
  repository_url: string;
  file_source_path?: string;
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
  public title!: string;
  public aliases?: string;
  public readonly file_content_id!: string;
  public repository_url!: string;
  public file_source_path?: string;
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        aliases: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        repository_url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        file_source_path: {
          type: DataTypes.STRING,
          allowNull: true,
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
      title: requestBody.title,
      aliases: JSON.stringify(requestBody.aliases || []),
      file_content: requestBody.file_content,
      repository_url: requestBody.repository_url,
      file_source_path: requestBody.file_source_path,
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
      title: swagger.title,
      aliases: swagger.aliases,
      file_content: swaggerFileContent.file_content,
      repository_url: swagger.repository_url,
      file_source_path: swagger.file_source_path,
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
