import { CosmosClient } from '@azure/cosmos';

const connectionString = process.env.COSMOS_CONNECTION_STRING as string;
export const cosmos = new CosmosClient(connectionString);

export function getDb(dbName: string) {
  return cosmos.database(dbName);
}


