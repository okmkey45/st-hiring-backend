import { Knex } from 'knex';
import { AvailableTicketGroup } from '../entity/ticket';

export interface TicketsDAL {
  getTicketsByEvent(eventId: number): Promise<AvailableTicketGroup[]>;
}

export const createTicketDAL = (knex: Knex): TicketsDAL => {
  return {
    async getTicketsByEvent(eventId): Promise<AvailableTicketGroup[]> {
      const rows = await knex('tickets')
        .select('type', 'status', 'price')
        .count<{ quantity: string | number }>('* as quantity')
        .where({
          event_id: eventId,
          status: 'available',
        })
        .groupBy('type', 'status', 'price')
        .orderBy('type');

      return rows.map((row) => ({
        type: row.type,
        status: row.status,
        price: Number(row.price),
        quantity: Number(row.quantity),
      }));
    },
  };
};
