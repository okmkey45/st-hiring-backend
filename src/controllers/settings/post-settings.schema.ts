import * as yup from 'yup';

export const settingsSchema = yup.object({
  body: yup.object({
    maxTicketsPerBooking: yup.number().strict().typeError('The maxTicketsPerBooking field must be a number.').required('The maxTicketsPerBooking field is required.'),
    bookingTimeoutMinutes: yup.number().strict().typeError('The bookingTimeoutMinutes field must be a number.').required('The bookingTimeoutMinutes field is required.'),
    serviceFeePercentage: yup.number().strict().typeError('The serviceFeePercentage field must be a number.').required('The serviceFeePercentage field is required.'),
  }).nullable().required('The body payload is required.'),
});

export type SettingsPayload = yup.InferType<typeof settingsSchema>;
