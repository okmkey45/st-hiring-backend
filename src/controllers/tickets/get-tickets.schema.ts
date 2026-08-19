import * as yup from 'yup';

export const getTicketsSchema = yup.object({
  params: yup
    .object({
      eventId: yup
        .number()
        .integer('The eventId field must be an integer.')
        .min(1, 'The eventId field must be at least 1.')
        .typeError('The eventId field must be a number.')
        .required('The eventId field is required.'),
    })
    .required(),
});

export type GetTicketsPayload = yup.InferType<typeof getTicketsSchema>;
