import { Db, MongoClient } from 'mongodb';

export interface MongoConfig {
  uri: string;
  dbName: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongo = async (config: MongoConfig): Promise<Db> => {
  if (db) {
    return db;
  }

  client = new MongoClient(config.uri);
  await client.connect();
  db = client.db(config.dbName);
  
  console.log('MongoDB connected');

  return db;
};

export const disconnectMongo = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
