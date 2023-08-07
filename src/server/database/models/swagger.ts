import { v4 } from 'uuid';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { TableNames } from '../connectors/consts';

export enum SwaggerFormats {
  Yaml = 'yaml',
  Json = 'json',
}

interface SwaggerAttributes {
  id: string;
  name: string;
  data: string;
  created_at?: Date;
  updated_at?: Date;
}
export type SwaggerRequestBody = Optional<
  SwaggerAttributes,
  'id' | 'created_at' | 'updated_at'
>;
export type SwaggerResource = Required<SwaggerAttributes>;

class SwaggerModel
  extends Model<SwaggerAttributes, SwaggerRequestBody>
  implements SwaggerAttributes
{
  public id!: string;
  public name!: string;
  public data!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static initializeModel(sequelizeClient: Sequelize): void {
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
        data: {
          type: DataTypes.TEXT('long'),
          allowNull: false,
        },
      },
      {
        tableName: TableNames.SWAGGERS_TABLE_NAME,
        sequelize: sequelizeClient,
      }
    );
  }

  public static fromRequest(requestBody: SwaggerRequestBody): SwaggerResource {
    const now = new Date();
    return {
      id: v4(),
      ...requestBody,
      created_at: now,
      updated_at: now,
    };
  }
}

export default SwaggerModel;
