import { NextFunction, Request, Response } from 'express';
import { SettingsDAL } from '../../dal/settings.dal';

export const createPostSettingsController =
  ({ settingsDAL }: { settingsDAL: SettingsDAL }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsDAL.upsertSettings(req.body);
      res.status(201).json(settings);
    } catch (err) {
      next(err);
    }
  };