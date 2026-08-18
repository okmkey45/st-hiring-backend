import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { knex } from 'knex';
import dbConfig from './knexfile';
import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createSettingsDAL } from './dal/settings.dal';
import { createGetEventsController } from './controllers/get-events';
import { createGetSettingsController } from './controllers/get-settings';
import { createPostSettingsController } from './controllers/post-settings';
import { connectMongo } from './database/mongo';

const Knex = knex(dbConfig.development);

const eventDAL = createEventDAL(Knex);
const TicketDAL = createTicketDAL(Knex);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  const mongoDb = await connectMongo(
    process.env.MONGO_URI ?? 'mongodb://root:example@localhost:27017',
    process.env.MONGO_DB_NAME ?? 'seetickets',
  );
  const settingsDAL = createSettingsDAL(mongoDb);

  app.use('/events', createGetEventsController({ eventsDAL: eventDAL, ticketsDAL: TicketDAL }));
  app.get('/settings', createGetSettingsController({ settingsDAL }));
  app.post('/settings', createPostSettingsController({ settingsDAL }));

  app.use('/', (_req, res) => {
    res.json({ message: 'Hello API' });
  });

  app.listen(3000, () => {
    console.log('Server Started');
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
