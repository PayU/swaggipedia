import { createApp } from './app';
import DatabaseClient from './server/database/client';
import env from './helpers/env';
import GracefulShutdown from './helpers/gracefulShutdown';
import logger from './helpers/logger';

(async function init(): Promise<void> {
  const clients = [DatabaseClient];

  try {
    logger.info(`Starting application...`);

    await DatabaseClient.initializeConnection();

    const app = createApp();

    const server = app.listen(env.PORT);
    server.keepAliveTimeout = env.SERVER_KEEP_ALIVE;

    GracefulShutdown.register({
      forceShutdownTimeoutSec: env.FORCE_SHUTDOWN_TIMEOUT_SEC,
      initialShutdownDelaySec: env.SHUTDOWN_INITIAL_DELAY_SEC,
      clients: clients,
      logger: logger,
      server: server,
    });

    logger.info(`Application running on port: ${env.PORT}`);
  } catch (error) {
    logger.error(error, 'An error occurred while initializing application');
    GracefulShutdown.closeClients(clients);
    process.exit(1);
  }
})();
