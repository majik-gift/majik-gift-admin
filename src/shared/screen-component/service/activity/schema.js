import * as yup from 'yup';

export const createActivitySchema = yup.object({
  content: yup.string().required('Content is required*'),
});

import dayjs from 'dayjs';

export const createZoomMeetingSchema = yup.object({
  start_time: yup
    .date()
    .required('Start time is required')
    .test('is-future', 'Start time must be in the future', (value) => {
      return dayjs(value).isAfter(dayjs());
    }),
  duration: yup
    .number()
    .required('Duration is required')
    .typeError('Duration must be a number')
    .positive('Duration must be a positive number')
    .integer('Duration must be an integer'),
});
