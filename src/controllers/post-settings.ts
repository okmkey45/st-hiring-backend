import { Request, Response } from 'express';
import { SettingsDAL } from '../dal/settings.dal';
import { Settings } from '../entity/settings';

const SETTINGS_FIELDS: (keyof Settings)[] = [
  'maxTicketsPerBooking',
  'bookingTimeoutMinutes',
  'serviceFeePercentage',
];

const isValidSettings = (body: unknown): body is Settings => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  return SETTINGS_FIELDS.every((field) => {
    const value = (body as Record<string, unknown>)[field];
    return typeof value === 'number' && Number.isFinite(value);
  });
};

export const createPostSettingsController =
  ({ settingsDAL }: { settingsDAL: SettingsDAL }) =>
  async (req: Request, res: Response) => {
    if (!isValidSettings(req.body)) {
      res.status(400).json({
        message:
          'Invalid settings. Expected numeric fields: maxTicketsPerBooking, bookingTimeoutMinutes, serviceFeePercentage',
      });
      return;
    }

    const settings = await settingsDAL.upsertSettings(req.body);
    res.json(settings);
  };
