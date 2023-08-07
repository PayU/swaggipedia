import logger from '../../helpers/logger';
import { DatabaseConnector } from './connectors/types';
import SequlizeConnector from './connectors/sequlize/sequlizeClient';

export default class DatabaseClient {
  private static connector: DatabaseConnector;

  public static async initializeConnection(): Promise<void> {
    logger.info('Opening database connection...');

    this.connector = new SequlizeConnector();
    await this.connector.initializeConnection();

    logger.info('Database connection is now open');
  }

  public static async ping(): Promise<boolean> {
    return await this.connector.ping();
  }

  public static async closeConnection(): Promise<void> {
    logger.info('Closing database connection...');

    this.connector.closeConnection();

    logger.info('Database connection is closed');
  }
}
