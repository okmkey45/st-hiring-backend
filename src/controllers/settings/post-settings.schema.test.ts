import { validate } from '../../middleware/validate';
import { settingsSchema } from './post-settings.schema';
import { mockRequest, mockResponse, mockNext } from '../../test-utils/express.mock';

describe('settingsSchema validation middleware', () => {
  const middleware = validate(settingsSchema);
  const next = mockNext();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succeed when given a valid payload', async () => {
    const req = mockRequest({
      body: {
        maxTicketsPerBooking: 5,
        bookingTimeoutMinutes: 10,
        serviceFeePercentage: 2.5,
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should fail with validation errors when required fields are missing', async () => {
    const req = mockRequest({
      body: {
        maxTicketsPerBooking: 5,
        // missing bookingTimeoutMinutes and serviceFeePercentage
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        bookingTimeoutMinutes: 'The bookingTimeoutMinutes field is required.',
        serviceFeePercentage: 'The serviceFeePercentage field is required.',
      },
    });
  });

  it('should fail with validation errors when field types are incorrect', async () => {
    const req = mockRequest({
      body: {
        maxTicketsPerBooking: '5', // String instead of number
        bookingTimeoutMinutes: 10,
        serviceFeePercentage: 2.5,
      },
    });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        maxTicketsPerBooking: 'The maxTicketsPerBooking field must be a number.',
      },
    });
  });

  it('should fail when the body payload is entirely missing', async () => {
    const req = mockRequest({ body: null });
    const res = mockResponse();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The given data was invalid.',
      errors: {
        'body': 'The body payload is required.',
      },
    });
  });
});
