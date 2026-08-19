import { createGetTicketsController } from './get-tickets';
import { GetTicketsPayload } from './get-tickets.schema';
import { TicketsDAL } from '../../dal/tickets.dal';
import { mockNext, mockRequest, mockResponse } from '../../test-utils/express.mock';

describe('createGetTicketsController', () => {
  let mockTicketsDAL: jest.Mocked<TicketsDAL>;

  beforeEach(() => {
    mockTicketsDAL = {
      getTicketsByEvent: jest.fn(),
    };
  });

  it('should fetch tickets from DAL and return them as JSON', async () => {
    const mockTickets = [
      {
        type: 'general' as const,
        status: 'available' as const,
        price: 50,
        quantity: 10,
      },
      {
        type: 'vip' as const,
        status: 'available' as const,
        price: 100,
        quantity: 5,
      },
    ];
    mockTicketsDAL.getTicketsByEvent.mockResolvedValue(mockTickets);

    const controller = createGetTicketsController({ ticketsDAL: mockTicketsDAL });
    const req = mockRequest();
    const res = mockResponse<{ validated: GetTicketsPayload }>();
    res.locals = { validated: { params: { eventId: 1 } } };
    const next = mockNext();

    await controller(req, res, next);

    expect(mockTicketsDAL.getTicketsByEvent).toHaveBeenCalledWith(1);
    expect(mockTicketsDAL.getTicketsByEvent).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      tickets: mockTickets,
    });
  });
});
