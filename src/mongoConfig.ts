import { config } from 'dotenv';
import path from 'path';
import { MongoConfig } from './database/mongo';

// Load the .env file from the root directory
config({ path: path.resolve(__dirname, '../.env') });

const mongoConfig: { [key: string]: MongoConfig } = {
  development: {
    uri: process.env.MONGO_URI ?? 'mongodb://root:example@localhost:27017',
    dbName: process.env.MONGO_DB_NAME ?? 'seetickets',
  },
};

export default mongoConfig;
