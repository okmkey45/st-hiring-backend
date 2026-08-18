import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createSettingsDAL } from './dal/settings.dal';
import { createGetEventsController } from './controllers/get-events';
import { createGetSettingsController } from './controllers/get-settings';
import { createPostSettingsController } from './controllers/post-settings';
import { connectMongo, disconnectMongo } from './database/mongo';
import { connectPostgres, disconnectPostgres } from './database/postgres';
import postgresConfig from './knexfile';
import mongoConfig from './mongoConfig';

const startServer = async () => {
  const Knex = await connectPostgres(postgresConfig.development);
  const mongoDb = await connectMongo(mongoConfig.development);

  const eventDAL = createEventDAL(Knex);
  const TicketDAL = createTicketDAL(Knex);
  const settingsDAL = createSettingsDAL(mongoDb);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/events', createGetEventsController({ eventsDAL: eventDAL, ticketsDAL: TicketDAL }));
  app.get('/settings', createGetSettingsController({ settingsDAL }));
  app.post('/settings', createPostSettingsController({ settingsDAL }));

  app.use('/', (_req, res) => {
    res.json({ message: 'Hello API' });
  });

  const server = app.listen(3000, () => {
    console.log('Server Started on port 3000');
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await disconnectMongo();
        await disconnectPostgres();
        
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnection:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
