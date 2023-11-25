import { DataTypes } from 'sequelize';
import { TableNames } from '../../consts';

export const up = async ({ context }) => {
  await context.createTable(TableNames.SWAGGERS_CONTENT_TABLE_NAME, {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    file_content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  });
  await context.createTable(TableNames.SWAGGERS_TABLE_NAME, {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    file_content_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TableNames.SWAGGERS_CONTENT_TABLE_NAME,
        key: 'id',
      },
    },
    repository_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_source_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

export const down = async ({ context: queryInterface }) =>
  await queryInterface.dropTable(TableNames.SWAGGERS_TABLE_NAME);
