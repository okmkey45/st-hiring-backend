import { createGetEventsController } from './get-events';
import { EventDAL } from '../../dal/events.dal';
import { mockRequest, mockResponse } from '../../test-utils/express.mock';

describe('createGetEventsController', () => {
  let mockEventsDAL: jest.Mocked<EventDAL>;

  beforeEach(() => {
    mockEventsDAL = {
      getEvents: jest.fn().mockResolvedValue([{ id: 1, name: 'Event 1' }]),
    };
  });

  it('should return events with pagination parameters', async () => {
    const controller = createGetEventsController({ eventsDAL: mockEventsDAL });
    const req = mockRequest();
    const res = mockResponse();
    res.locals = {
      pagination: {
        limit: 10,
        skip: 20,
        fields: ['id', 'name'],
      },
    };

    await controller(req, res);

    expect(mockEventsDAL.getEvents).toHaveBeenCalledWith({
      limit: 10,
      skip: 20,
      fields: ['id', 'name'],
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Event 1' }]);
  });
});
