import { NextFunction, Request, Response } from 'express';
import { SettingsDAL } from '../../dal/settings.dal';

export const createGetSettingsController =
  ({ settingsDAL }: { settingsDAL: SettingsDAL }) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsDAL.getSettings();
      res.status(200).json(settings);
    } catch (err) {
      next(err);
    }
  };
