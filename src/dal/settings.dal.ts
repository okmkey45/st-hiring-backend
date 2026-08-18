import { Db } from 'mongodb';
import { Settings } from '../entity/settings';

const SETTINGS_COLLECTION = 'settings';
const GLOBAL_SETTINGS_ID = 'global';

const DEFAULT_SETTINGS: Settings = {
  maxTicketsPerBooking: 10,
  bookingTimeoutMinutes: 15,
  serviceFeePercentage: 5,
};

type SettingsDocument = Settings & { _id: string };

export interface SettingsDAL {
  getSettings(): Promise<Settings>;
  upsertSettings(settings: Settings): Promise<Settings>;
}

export const createSettingsDAL = (db: Db): SettingsDAL => {
  const collection = db.collection<SettingsDocument>(SETTINGS_COLLECTION);

  const upsertSettings = async (settings: Settings): Promise<Settings> => {
    await collection.updateOne(
      { _id: GLOBAL_SETTINGS_ID },
      { $set: settings },
      { upsert: true },
    );

    return settings;
  };

  return {
    async getSettings(): Promise<Settings> {
      const document = await collection.findOne({ _id: GLOBAL_SETTINGS_ID });

      if (!document) {
        return upsertSettings(DEFAULT_SETTINGS);
      }

      const { _id: _, ...settings } = document;
      return settings;
    },

    upsertSettings,
  };
};
