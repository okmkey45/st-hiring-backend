import { Knex } from 'knex';
import { Event } from '../entity/event';

const DEFAULT_FIELDS: (keyof Event)[] = ['id', 'name'];

// checks with big values to protect the database from performance issues
// but leaving some space for future growth and other implementations
// these values are not final and can be changed
export const MAX_EVENTS_LIMIT = 1000;
export const MAX_EVENTS_SKIP = 10000;

export const ALLOWED_EVENT_FIELDS = ['id', 'name', 'date', 'location', 'description'] as (keyof Event)[];

export interface GetEventsParams {
  limit: number;
  skip: number;
  fields?: (keyof Event)[];
}

export interface EventDAL {
  getEvents(params: GetEventsParams): Promise<Partial<Event>[]>;
  countEvents(): Promise<number>;
}

export const createEventDAL = (knex: Knex): EventDAL => {
  const assertPaginationParams = (limit: number, skip: number) => {
    if (limit > MAX_EVENTS_LIMIT) {
      throw new Error(`Limit cannot be greater than ${MAX_EVENTS_LIMIT}`);
    }
    if (skip > MAX_EVENTS_SKIP) {
      throw new Error(`Skip cannot be greater than ${MAX_EVENTS_SKIP}`);
    }
  };

  const getCleanedFields = (fields: (keyof Event)[] = []): (keyof Event)[] => {
    return fields.filter((field) => ALLOWED_EVENT_FIELDS.includes(field));
  };

  return {
    async countEvents(): Promise<number> {
      const result = await knex('events').count<{ count: string | number }>('* as count').first();
      return Number(result?.count || 0);
    },
    async getEvents({ limit, skip, fields = [] }): Promise<Partial<Event>[]> {
      assertPaginationParams(limit, skip);

      const cleanedFields = getCleanedFields(fields.length > 0 ? fields : DEFAULT_FIELDS);
      const select = Object.fromEntries(
        cleanedFields
          .map((field) => [field, field])
          .filter(([_, column]) => column !== undefined),
      );

      return await knex<Event>('events')
        .select(select)
        .limit(limit)
        .offset(skip);
    },
  };
};
