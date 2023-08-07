export interface DatabaseConnector {
  initializeConnection: () => Promise<unknown>;
  ping: () => Promise<boolean>;
  closeConnection: () => Promise<unknown>;
}
