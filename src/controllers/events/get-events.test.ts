import { createGetEventsController } from './get-events';
import { EventDAL } from '../../dal/events.dal';
import { mockRequest, mockResponse, mockNext } from '../../test-utils/express.mock';

describe('createGetEventsController', () => {
  let mockEventsDAL: jest.Mocked<EventDAL>;

  beforeEach(() => {
    mockEventsDAL = {
      getEvents: jest.fn().mockResolvedValue([{ id: 1, name: 'Event 1' }]),
      countEvents: jest.fn().mockResolvedValue(100),
    };
  });

  it('should return events with pagination parameters', async () => {
    const controller = createGetEventsController({ eventsDAL: mockEventsDAL });
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();
    res.locals = {
      pagination: {
        limit: 10,
        skip: 20,
        fields: ['id', 'name'],
      },
    };

    await controller(req, res, next);

    expect(mockEventsDAL.getEvents).toHaveBeenCalledWith({
      limit: 10,
      skip: 20,
      fields: ['id', 'name'],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: 1, name: 'Event 1' }],
      meta: {
        totalItems: 100,
        totalPages: 10,
        currentPage: 3,
        nextPage: 4,
        prevPage: 2,
      },
    });
  });
});
