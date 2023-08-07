import { Server } from 'http';
import { setTimeout } from 'timers/promises';

interface Opts {
  server: Server;
  events?: Events[];
  logger: LoggerInstance;
  clients?: Client[];
  initialShutdownDelaySec: number;
  forceShutdownTimeoutSec: number;
}

interface LoggerInstance {
  info: { (...args: unknown[]): unknown };
  error: { (...args: unknown[]): unknown };
}

type Client = {
  closeConnection(): Promise<unknown>;
};

export type Events = 'SIGINT' | 'SIGTERM';

export default class GracefulShutdown {
  private static shuttingDown = false;

  public static register(opts: Opts): void {
    const {
      events = ['SIGINT', 'SIGTERM'],
      logger,
      forceShutdownTimeoutSec,
      initialShutdownDelaySec,
    } = opts;

    logger.info(
      { events, forceShutdownTimeoutSec, initialShutdownDelaySec },
      'Setting up graceful shutdown event handler'
    );
    events.forEach((event) => {
      process.on(event.toUpperCase(), () => {
        GracefulShutdown.shutdown(opts);
      });
    });
  }

  private static async shutdown(opts: Opts): Promise<void> {
    if (GracefulShutdown.shuttingDown) return;

    GracefulShutdown.shuttingDown = true;

    const {
      server,
      logger,
      clients,
      forceShutdownTimeoutSec: forceShutdownTimeout,
      initialShutdownDelaySec: initialShutdownDelay,
    } = opts;

    logger.info('Starting graceful shutdown sequence');

    logger.info(
      `Waiting for ${initialShutdownDelay}s before starting shutdown sequence`
    );
    await setTimeout(initialShutdownDelay * 1000);

    logger.info('Closing Http server');
    // Stops the server from accepting new connections and finishes existing connections.
    server.close(async (error) => {
      if (error) {
        logger.error(error, 'Failed to close http server');
        await GracefulShutdown.closeClients(clients);
        process.exit(1);
      }

      // close dependencies connections
      logger.info('All Http connections were closed');
      await GracefulShutdown.closeClients(clients);

      logger.info('Graceful shutdown sequence has ended successfully');
      process.exit(0);
    });

    logger.info(
      `Waiting for all open Http connections to be closed within ${forceShutdownTimeout}s`
    );
    await setTimeout(forceShutdownTimeout * 1000);
    logger.error(
      'Could not close connections on time, forcefully shutting down'
    );
    await GracefulShutdown.closeClients(clients);
    logger.info('Graceful shutdown sequence ended with errors');
    process.exit(1);
  }

  public static async closeClients(clients?: Client[]): Promise<void> {
    if (!clients) return;

    const promises = clients.map(async (client) => {
      return client.closeConnection();
    });
    await Promise.allSettled(promises);
  }
}
