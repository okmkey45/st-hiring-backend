import { NextFunction, Request, Response } from 'express';
import { SettingsDAL } from '../../dal/settings.dal';
import { SettingsPayload } from './post-settings.schema';

export const createPostSettingsController =
  ({ settingsDAL }: { settingsDAL: SettingsDAL }) =>
  async (
    req: Request,
    res: Response<any, { validated: SettingsPayload }>,
    next: NextFunction
  ) => {
    try {
      const {
        maxTicketsPerBooking,
        bookingTimeoutMinutes,
        serviceFeePercentage,
      } = res.locals.validated.body;

      const settings = await settingsDAL.upsertSettings(
        {
          maxTicketsPerBooking,
          bookingTimeoutMinutes,
          serviceFeePercentage,
        }
      );
      res.status(201).json(settings);
    } catch (err) {
      next(err);
    }
  };