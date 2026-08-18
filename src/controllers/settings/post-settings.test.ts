import { createPostSettingsController } from './post-settings';
import { SettingsDAL } from '../../dal/settings.dal';
import { mockRequest, mockResponse } from '../../test-utils/express.mock';

describe('createPostSettingsController', () => {
  let mockSettingsDAL: jest.Mocked<SettingsDAL>;

  beforeEach(() => {
    mockSettingsDAL = {
      getSettings: jest.fn(),
      upsertSettings: jest.fn(),
    };
  });

  it('should successfully update settings and return them', async () => {
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
});
