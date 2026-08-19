import * as yup from 'yup';

export const settingsSchema = yup.object({
  body: yup.object({
    maxTicketsPerBooking: yup
      .number()
      .strict()
      .min(1, 'The maxTicketsPerBooking field must be at least 1.')
      .typeError('The maxTicketsPerBooking field must be a number.')
      .required('The maxTicketsPerBooking field is required.'),
    bookingTimeoutMinutes: yup
      .number()
      .strict()
      .min(1, 'The bookingTimeoutMinutes field must be at least 1.')
      .typeError('The bookingTimeoutMinutes field must be a number.')
      .required('The bookingTimeoutMinutes field is required.'),
    serviceFeePercentage: yup
      .number()
      .strict()
      .min(0, 'The serviceFeePercentage field must be at least 0.')
      .max(100, 'The serviceFeePercentage field must be at most 100.')
      .typeError('The serviceFeePercentage field must be a number.')
      .required('The serviceFeePercentage field is required.'),
  }).nullable().required('The body payload is required.'),
});

export type SettingsPayload = yup.InferType<typeof settingsSchema>;
