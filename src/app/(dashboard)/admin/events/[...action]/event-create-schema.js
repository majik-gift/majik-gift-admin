import * as yup from 'yup';

// Reusable test for numeric values >= 1
const positiveNumberTest = (fieldName) => {
  return yup
    .string()
    .required(`${fieldName} is required`)
    .test('is-positive', `${fieldName} must be a number greater than or equal to 1`, (value) => {
      const number = parseFloat(value);
      return !isNaN(number) && number >= 1;
    });
};

export const eventCreateSchema = yup.object({
  description: yup
    .string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .max(3000, 'Description cannot exceed 3000 characters'),

  total_price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(1, 'Price must be at least 1'),
  title: yup.string().required('Title is required'),
  created_for: yup.object().required('Created for is required'),
  event_date: yup
    .date()
    .required('Group Activities Date is required')
    .typeError('Invalid date')
    .test('not-past-date', 'Group Activities date cannot be in the past', function (value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to midnight for a clean date comparison
      const eventDate = new Date(value);
      if (eventDate < today) {
        return false; // If the event date is in the past, validation fails
      }
      return true; // Otherwise, it's valid (including if the date is today)
    }),
  start_time: yup.date().required('Start time is required').typeError('Invalid date'),
  end_time: yup
    .date()
    .required('End time is required')
    .typeError('Invalid date')
    .test('end-time-after-start-time', 'End time must be after the start time', function (value) {
      const { start_time } = this.parent; // Access other fields (start_time)
      if (start_time && value && new Date(value) <= new Date(start_time)) {
        return false;
      }
      return true;
    }),
  // banner_image: yup.mixed().required('Image is required'),
  // image: yup.array().min(1, 'At least one image is required').required('Image is required'),
  venue: yup.string().required('Venue is required'),
  slots: yup
    .number()
    .typeError('Expected number, received NaN')
    .required('Slots is required')
    .min(1, 'Slots must be at least 1')
    .test(
      'is-valid-slot',
      'Number of slots must be greater than or equal to booked slots',
      function (value) {
        const { context } = this.options;
        const bookedSlotsLength = context?.singleEvent?.tickets?.length || 0;
        return value >= bookedSlotsLength;
      }
    ),
  fee_option: yup.mixed().notOneOf(['fee_option'], 'Fee_option is not allowed'),
  applied_fee: yup.mixed().notOneOf(['applied_fee'], 'Applied_fee is not allowed'),
  categories_ids: yup
    .array()
    .min(1, 'At least one category is required')
    .required('Categories are required'),
});
