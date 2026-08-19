import { knex, Knex } from 'knex';

let knexInstance: Knex | null = null;

export const connectPostgres = async (config: Knex.Config): Promise<Knex> => {
  if (knexInstance) {
    return knexInstance;
  }

  knexInstance = knex(config);

  try {
    await knexInstance.raw('SELECT 1');
    console.log('Postgres connected');
  } catch (error) {
    console.error('Failed to connect to Postgres', error);
    process.exit(1);
  }

  return knexInstance;
};

export const disconnectPostgres = async (): Promise<void> => {
  if (knexInstance) {
    await knexInstance.destroy();
    knexInstance = null;
    console.log('Postgres disconnected.');
  }
};

export const isPostgresHealthy = async (): Promise<boolean> => {
  if (!knexInstance) return false;

  try {
    await knexInstance.raw('SELECT 1');
    return true;
  } catch {
    return false;
  }
};
