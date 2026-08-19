import { validate } from '../../middleware/validate';
import { getTicketsSchema } from './get-tickets.schema';
import { mockRequest, mockResponse, mockNext } from '../../test-utils/express.mock';

describe('getTicketsSchema validation middleware', () => {
  const middleware = validate(getTicketsSchema);
  const next = mockNext();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succeed when given a valid eventId', async () => {
    const req = mockRequest({
      params: {
        eventId: '1',
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.validated).toEqual({
      params: {
        eventId: 1,
      },
    });
  });

  it('should fail with validation errors when eventId is missing', async () => {
    const req = mockRequest({ params: {} });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        eventId: 'The eventId field is required.',
      },
    });
  });

  it('should fail with validation errors when eventId is not a number', async () => {
    const req = mockRequest({
      params: {
        eventId: 'abc',
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        eventId: 'The eventId field must be a number.',
      },
    });
  });

  it('should fail with validation errors when eventId is not an integer', async () => {
    const req = mockRequest({
      params: {
        eventId: '1.5',
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        eventId: 'The eventId field must be an integer.',
      },
    });
  });

  it('should fail with validation errors when eventId is less than 1', async () => {
    const req = mockRequest({
      params: {
        eventId: '0',
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        eventId: 'The eventId field must be at least 1.',
      },
    });
  });
});
