import { createPostSettingsController } from './post-settings';
import { SettingsDAL } from '../dal/settings.dal';
import { mockRequest, mockResponse } from '../test-utils/express.mock';

describe('createPostSettingsController', () => {
  let mockSettingsDAL: jest.Mocked<SettingsDAL>;

  beforeEach(() => {
    mockSettingsDAL = {
      getSettings: jest.fn(),
      upsertSettings: jest.fn(),
    };
  });

  it('should successfully update settings and return them when body is valid', async () => {
    const validBody = {
      maxTicketsPerBooking: 5,
      bookingTimeoutMinutes: 10,
      serviceFeePercentage: 2.5,
    };
    mockSettingsDAL.upsertSettings.mockResolvedValue(validBody);

    const controller = createPostSettingsController({ settingsDAL: mockSettingsDAL });
    const req = mockRequest({ body: validBody });
    const res = mockResponse();

    await controller(req, res);

    expect(mockSettingsDAL.upsertSettings).toHaveBeenCalledWith(validBody);
    expect(mockSettingsDAL.upsertSettings).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(validBody);
  });

  it('should return 400 when body is null or not an object', async () => {
    const controller = createPostSettingsController({ settingsDAL: mockSettingsDAL });
    const req = mockRequest({ body: null });
    const res = mockResponse();

    await controller(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Invalid settings. Expected numeric fields: maxTicketsPerBooking, bookingTimeoutMinutes, serviceFeePercentage',
    });
    expect(mockSettingsDAL.upsertSettings).not.toHaveBeenCalled();
  });

  it('should return 400 when body is missing required fields', async () => {
    const controller = createPostSettingsController({ settingsDAL: mockSettingsDAL });
    const req = mockRequest({
      body: {
        maxTicketsPerBooking: 5,
        // missing bookingTimeoutMinutes and serviceFeePercentage
      },
    });
    const res = mockResponse();

    await controller(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Invalid settings. Expected numeric fields: maxTicketsPerBooking, bookingTimeoutMinutes, serviceFeePercentage',
    });
    expect(mockSettingsDAL.upsertSettings).not.toHaveBeenCalled();
  });

  it('should return 400 when body fields have wrong types', async () => {
    const controller = createPostSettingsController({ settingsDAL: mockSettingsDAL });
    const req = mockRequest({
      body: {
        maxTicketsPerBooking: '5', // string instead of number
        bookingTimeoutMinutes: 10,
        serviceFeePercentage: 2.5,
      },
    });
    const res = mockResponse();

    await controller(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Invalid settings. Expected numeric fields: maxTicketsPerBooking, bookingTimeoutMinutes, serviceFeePercentage',
    });
    expect(mockSettingsDAL.upsertSettings).not.toHaveBeenCalled();
  });
});
