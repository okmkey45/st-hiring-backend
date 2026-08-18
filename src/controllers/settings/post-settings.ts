import { Request, Response } from 'express';
import { SettingsDAL } from '../../dal/settings.dal';

export const createPostSettingsController =
  ({ settingsDAL }: { settingsDAL: SettingsDAL }) =>
  async (req: Request, res: Response) => {
    const settings = await settingsDAL.upsertSettings(req.body);
    res.json(settings);
  };
