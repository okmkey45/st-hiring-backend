export const TICKET_TYPES = ['general', 'vip', 'premium'] as const;
export type TicketType = (typeof TICKET_TYPES)[number];

export const TICKET_STATUSES = ['available', 'sold', 'reserved'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface AvailableTicketGroup {
  type: TicketType;
  status: 'available'; // only available tickets are returned
  price: number;
  quantity: number;
}
