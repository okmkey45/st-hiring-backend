import { createGetSettingsController } from './get-settings';
import { SettingsDAL } from '../../dal/settings.dal';
import { mockRequest, mockResponse } from '../../test-utils/express.mock';

describe('createGetSettingsController', () => {
  let mockSettingsDAL: jest.Mocked<SettingsDAL>;

  beforeEach(() => {
    mockSettingsDAL = {
      getSettings: jest.fn(),
      upsertSettings: jest.fn(),
    };
  });

  it('should fetch settings from DAL and return them as JSON', async () => {
    const mockSettings = {
      maxTicketsPerBooking: 10,
      bookingTimeoutMinutes: 15,
      serviceFeePercentage: 5,
    };
    mockSettingsDAL.getSettings.mockResolvedValue(mockSettings);

    const controller = createGetSettingsController({ settingsDAL: mockSettingsDAL });
    const req = mockRequest();
    const res = mockResponse();

    await controller(req, res);

    expect(mockSettingsDAL.getSettings).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockSettings);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
