import { Sequelize, Options, Dialect } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { DatabaseConnector } from '../types';
import env from '../../../../helpers/env';
import logger from '../../../../helpers/logger';
import path from 'path';
import SwaggerModel from '../../models/swagger';

export default class sequelizeConnector implements DatabaseConnector {
  private client: Sequelize;

  constructor() {
    const options: Options = {
      dialect: env.DATABASE_TYPE.toLowerCase() as Dialect,
      logging: false,
      host: env.DATABASE_ADDRESS,
      define: {
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      ...(env.DATABASE_TYPE === 'sqlite' && {
        storage: env.SQLITE_STORAGE_PATH,
      }),
    };

    this.client = new Sequelize(
      env.DATABASE_NAME.toLowerCase(),
      env.DATABASE_USERNAME,
      env.DATABASE_PASSWORD,
      options
    );
  }

  private async migrateDatabase(): Promise<void> {
    logger.info('Migrating database..');

    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, './migrations/*.ts'),
      },
      context: this.client.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.client }),
      logger,
    });

    try {
      await umzug.up();
    } catch (error) {
      logger.error(error, 'Failed to run sequlize migration, doing rollback');
      await umzug.down();
      throw error;
    }
    logger.info('Migration completed');
  }

  public async initializeConnection(): Promise<void> {
    await this.client?.authenticate();
    await this.migrateDatabase();
    SwaggerModel.initializeModel(this.client);

    await this.client.sync();
  }

  public async ping(): Promise<boolean> {
    let isUpAndRunning = true;

    try {
      await this.client?.authenticate();
    } catch (error) {
      logger.error(
        'Error occurred in communication with database: ' + error.message
      );
      isUpAndRunning = false;
    }

    return isUpAndRunning;
  }

  public async closeConnection(): Promise<void> {
    await this.client?.close();
  }
}
